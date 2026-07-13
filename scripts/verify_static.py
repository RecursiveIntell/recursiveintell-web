#!/usr/bin/env python3
"""Fail-fast verification for the standalone RecursiveIntell static site."""

from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
import tempfile
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
PAGES = (ROOT / "index.html", ROOT / "concepts.html")
REQUIRED = (
    ROOT / "favicon.svg",
    ROOT / "docs/witness-plane-desktop.png",
    ROOT / "docs/witness-plane-mobile.png",
    ROOT / "vercel.json",
)


class Document(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[str] = []
        self.controls: list[str] = []
        self.inline_scripts: list[str] = []
        self._script: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag == "a" and values.get("href"):
            self.links.append(values["href"] or "")
        if values.get("aria-controls"):
            self.controls.append(values["aria-controls"] or "")
        if tag == "script" and not values.get("src"):
            self._script = []

    def handle_data(self, data: str) -> None:
        if self._script is not None:
            self._script.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._script is not None:
            self.inline_scripts.append("".join(self._script))
            self._script = None


def parse(path: Path) -> tuple[str, Document]:
    text = path.read_text(encoding="utf-8")
    document = Document()
    document.feed(text)
    document.close()
    if not text.lstrip().lower().startswith("<!doctype html>"):
        raise AssertionError(f"{path.name}: missing HTML doctype")
    duplicates = sorted({item for item in document.ids if document.ids.count(item) > 1})
    if duplicates:
        raise AssertionError(f"{path.name}: duplicate IDs: {duplicates}")
    missing_controls = sorted(set(document.controls) - set(document.ids))
    if missing_controls:
        raise AssertionError(f"{path.name}: missing aria-controls targets: {missing_controls}")
    return text, document


def verify_links(page: Path, document: Document, documents: dict[str, Document]) -> None:
    for href in document.links:
        parsed = urlsplit(href)
        if parsed.scheme in {"http", "https", "mailto"}:
            continue
        if href == "#":
            raise AssertionError(f"{page.name}: bare hash link")

        target_name = page.name
        if parsed.path in {"", "/"}:
            target_name = "index.html" if parsed.path == "/" else page.name
        elif parsed.path.startswith("/"):
            target_name = parsed.path.removeprefix("/")
        else:
            target_name = parsed.path

        if target_name and target_name not in documents:
            target = ROOT / target_name
            if not target.exists():
                raise AssertionError(f"{page.name}: missing local target {href}")
            continue
        if parsed.fragment and parsed.fragment not in documents[target_name].ids:
            raise AssertionError(f"{page.name}: missing fragment target {href}")


def verify_javascript(documents: dict[str, Document]) -> None:
    scripts = documents["index.html"].inline_scripts
    if len(scripts) != 1:
        raise AssertionError(f"index.html: expected one inline script, found {len(scripts)}")
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as handle:
        handle.write(scripts[0])
        handle.flush()
        subprocess.run(["node", "--check", handle.name], check=True)


def main() -> None:
    for path in (*PAGES, *REQUIRED):
        if not path.is_file() or path.stat().st_size == 0:
            raise AssertionError(f"missing or empty required artifact: {path.relative_to(ROOT)}")

    parsed = {path.name: parse(path) for path in PAGES}
    texts = {name: item[0] for name, item in parsed.items()}
    documents = {name: item[1] for name, item in parsed.items()}

    for page in PAGES:
        verify_links(page, documents[page.name], documents)
    verify_javascript(documents)

    unfinished = re.compile(r"TODO|FIXME|placeholder|example\.com|href=[\"']#[\"']|\blorem\b|coming soon|\bTBD\b", re.I)
    for name, text in texts.items():
        if match := unfinished.search(text):
            raise AssertionError(f"{name}: unfinished content marker {match.group(0)!r}")

    config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    expected = {
        "framework": None,
        "buildCommand": None,
        "installCommand": None,
    }
    for key, value in expected.items():
        if config.get(key) != value:
            raise AssertionError(f"vercel.json: expected {key}={value!r}")

    receipt = {
        "pages": {name: {"ids": len(doc.ids), "links": len(doc.links)} for name, doc in documents.items()},
        "javascript": "node --check passed",
        "vercel": "static root configuration present",
    }
    print(json.dumps(receipt, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
