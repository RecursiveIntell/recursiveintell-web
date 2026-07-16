#!/usr/bin/env python3
"""Fail-fast verification for the synthesized RecursiveIntell static site."""

from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import subprocess
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET


ROOT = Path(__file__).resolve().parents[1]
PAGES = {
    "index.html": ROOT / "index.html",
    "install.html": ROOT / "install.html",
    "concepts.html": ROOT / "concepts.html",
    "404.html": ROOT / "404.html",
}
REQUIRED = (
    ROOT / "styles.css",
    ROOT / "site.js",
    ROOT / "favicon.svg",
    ROOT / "robots.txt",
    ROOT / "sitemap.xml",
    ROOT / "vercel.json",
    ROOT / ".github/workflows/ci.yml",
)


class Document(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.links: list[str] = []
        self.controls: list[str] = []
        self.labelledby: list[str] = []
        self.canonicals: list[str] = []
        self.lang: str | None = None
        self.json_ld: list[str] = []
        self._json_script: list[str] | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        if tag == "html":
            self.lang = values.get("lang")
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag in {"a", "link", "script", "img"}:
            target = values.get("href") or values.get("src")
            if target:
                self.links.append(target)
        if tag == "link" and values.get("rel") == "canonical" and values.get("href"):
            self.canonicals.append(values["href"] or "")
        if values.get("aria-controls"):
            self.controls.extend((values["aria-controls"] or "").split())
        if values.get("aria-labelledby"):
            self.labelledby.extend((values["aria-labelledby"] or "").split())
        if tag == "script" and values.get("type") == "application/ld+json":
            self._json_script = []

    def handle_data(self, data: str) -> None:
        if self._json_script is not None:
            self._json_script.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._json_script is not None:
            self.json_ld.append("".join(self._json_script))
            self._json_script = None


def parse_page(path: Path) -> tuple[str, Document]:
    text = path.read_text(encoding="utf-8")
    if not text.lstrip().lower().startswith("<!doctype html>"):
        raise AssertionError(f"{path.name}: missing HTML doctype")
    document = Document()
    document.feed(text)
    document.close()
    if document.lang != "en":
        raise AssertionError(f"{path.name}: expected lang=en")
    duplicates = sorted({item for item in document.ids if document.ids.count(item) > 1})
    if duplicates:
        raise AssertionError(f"{path.name}: duplicate IDs: {duplicates}")
    missing_controls = sorted(set(document.controls) - set(document.ids))
    if missing_controls:
        raise AssertionError(f"{path.name}: missing aria-controls targets: {missing_controls}")
    missing_labels = sorted(set(document.labelledby) - set(document.ids))
    if missing_labels:
        raise AssertionError(f"{path.name}: missing aria-labelledby targets: {missing_labels}")
    for payload in document.json_ld:
        json.loads(payload)
    return text, document


def resolve_page(path: str, source: str) -> tuple[str | None, Path]:
    clean = path.removeprefix("/")
    if path == "":
        return source, ROOT / source
    if path == "/":
        return "index.html", ROOT / "index.html"
    if not path.startswith("/"):
        candidate = (ROOT / source).parent / path
    else:
        candidate = ROOT / clean
    if candidate.suffix:
        return candidate.name if candidate.suffix == ".html" else None, candidate
    html = candidate.with_suffix(".html")
    if html.exists():
        return html.name, html
    return None, candidate


def verify_links(source: str, document: Document, documents: dict[str, Document]) -> None:
    for href in document.links:
        parsed = urlsplit(href)
        if parsed.scheme in {"http", "https", "mailto", "data"}:
            continue
        if href == "#":
            raise AssertionError(f"{source}: bare hash link")
        target_name, target = resolve_page(parsed.path, source)
        if not target.exists():
            raise AssertionError(f"{source}: missing local target {href}")
        if parsed.fragment:
            doc_name = target_name or source
            target_document = documents.get(doc_name)
            if target_document is None or parsed.fragment not in target_document.ids:
                raise AssertionError(f"{source}: missing fragment target {href}")


def require_text(text: str, page: str, values: tuple[str, ...]) -> None:
    for value in values:
        if value not in text:
            raise AssertionError(f"{page}: missing required content {value!r}")


def main() -> None:
    for path in (*PAGES.values(), *REQUIRED):
        if not path.is_file() or path.stat().st_size == 0:
            raise AssertionError(f"missing or empty artifact: {path.relative_to(ROOT)}")

    parsed = {name: parse_page(path) for name, path in PAGES.items()}
    texts = {name: item[0] for name, item in parsed.items()}
    documents = {name: item[1] for name, item in parsed.items()}
    for name, document in documents.items():
        verify_links(name, document, documents)

    if documents["index.html"].canonicals != ["https://recursiveintell.com/"]:
        raise AssertionError("index.html: canonical URL is missing or incorrect")
    if documents["install.html"].canonicals != ["https://recursiveintell.com/install"]:
        raise AssertionError("install.html: canonical URL is missing or incorrect")

    require_text(texts["index.html"], "index.html", (
        "Agent memory", "that can show its work.", "programmable trust substrate",
        "Agent Memory Kits", "Semantic Memory MCP", "Semantic Memory",
        "Claude Code", "Codex CLI", "Hermes Agent", "MCP + rules", "Direct MCP", "Rust library",
        "FTS5 / BM25", "Weighted RRF", "Context Governor", "Claim authority",
        "Source-hardened. Not release-certified.", "Evidence vocabulary", "Frozen SciFact retrieval snapshot",
        "Witnessed coding agent", "Release Truth Gate", "Operator Memory OS",
        "Frontier radar", "180-day sequence", "josh@recursiveintell.com",
    ))
    require_text(texts["install.html"], "install.html", (
        "/plugin marketplace add RecursiveIntell/agent-memory-kits",
        "codex plugin add semantic-memory@semantic-memory-codex-kit",
        "hermes mcp test semantic_memory",
        "cursor/scripts/setup.sh --write-project /path/to/project",
        "cargo install semantic-memory-mcp --locked --version '=0.5.4'",
        "cargo add semantic-memory@0.5.10",
        "/memory-ingest .", "An empty store", "tools/list",
    ))
    require_text(texts["concepts.html"], "concepts.html", (
        "The Systems Monograph", "The Witness Plane", "Chain of Custody",
    ))

    unfinished = re.compile(r"TODO|FIXME|placeholder|example\.com|href=[\"']#[\"']|\blorem\b|coming soon|\bTBD\b", re.I)
    for name, text in texts.items():
        if match := unfinished.search(text):
            raise AssertionError(f"{name}: unfinished marker {match.group(0)!r}")

    subprocess.run(["node", "--check", str(ROOT / "site.js")], check=True)
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    if css.count("{") != css.count("}"):
        raise AssertionError("styles.css: unbalanced braces")
    if "@media (prefers-reduced-motion: reduce)" not in css:
        raise AssertionError("styles.css: missing reduced-motion contract")

    config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
    for key in ("framework", "buildCommand", "installCommand"):
        if config.get(key) is not None:
            raise AssertionError(f"vercel.json: expected {key}=null")
    serialized_headers = json.dumps(config.get("headers", []))
    for header in ("Content-Security-Policy", "Strict-Transport-Security", "X-Content-Type-Options"):
        if header not in serialized_headers:
            raise AssertionError(f"vercel.json: missing security header {header}")

    sitemap = ET.parse(ROOT / "sitemap.xml")
    locations = {element.text for element in sitemap.findall(".//{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
    expected_locations = {
        "https://recursiveintell.com/",
        "https://recursiveintell.com/install",
        "https://recursiveintell.com/concepts",
    }
    if locations != expected_locations:
        raise AssertionError(f"sitemap.xml: unexpected locations {locations}")

    receipt = {
        "pages": {name: {"ids": len(doc.ids), "links": len(doc.links)} for name, doc in documents.items()},
        "javascript": "node --check passed",
        "content_contract": "legacy parity + observatory synthesis present",
        "accessibility_contract": "controls, labels, reduced motion, and fragments verified",
        "vercel": "static root and security headers present",
    }
    print(json.dumps(receipt, indent=2, sort_keys=True))


if __name__ == "__main__":
    main()
