import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync, readdirSync, writeFileSync, mkdirSync, chmodSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const installer = new URL("../public/ares/install.sh", import.meta.url);
const legacy = new URL("../public/hermes/install.sh", import.meta.url);
const source = readFileSync(installer, "utf8");
const programs = [...source.matchAll(/<<'PY'\n([\s\S]*?)\nPY/g)].map((match) => match[1]);
const restoreProgram = programs.find((program) => program.includes("manifest = backup/'files.json'"));
const launcherProgram = programs.find((program) => program.includes("unrecognized launcher"));
const gatewayProgram = programs.find((program) => program.includes("units = Path.home()"));
const buildProgram = programs.find((program) => program.includes("class FullInstallRuntime"));
const configProgram = programs.find((program) => program.includes("from hermes_cli.config import"));
const doctorProgram = programs.find((program) => program.includes("Required Ares runtime health checks"));
const run = (args, env = {}) => spawnSync("bash", [installer.pathname, ...args], { encoding: "utf8", env: { ...process.env, ...env } });

test("both public installer endpoints have valid shell syntax", () => {
  for (const file of [installer, legacy]) {
    assert.equal(spawnSync("bash", ["-n", file.pathname]).status, 0);
  }
});

test("default plan includes the full downstream installation without writes", () => {
  const directory = mkdtempSync(join(tmpdir(), "ares-plan-"));
  try {
    const result = run(["--plan"], { HOME: directory, ARES_HOME: join(directory, "ares") });
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /branch=main.*Desktop=true; enhancements=true; gateway=true; provider wizard=true/);
    assert.match(result.stdout, /No OpenAI API key is required/);
    assert.deepEqual(readdirSync(directory), []);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("explicit opt-outs are reflected without silently changing defaults", () => {
  const result = run(["--plan", "--minimal", "--no-desktop", "--no-gateway", "--skip-setup", "--branch", "candidate"]);
  assert.equal(result.status, 0);
  assert.match(result.stdout, /branch=candidate.*Desktop=false; enhancements=false; gateway=false; provider wizard=false/);
});

test("unknown and incomplete options fail before provisioning", () => {
  for (const args of [["--missing"], ["--branch"], ["--home", "--plan"], ["--bin-dir", ""]]) {
    const result = run(args);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unknown option|needs a value/);
  }
});

test("embedded Python configuration and build adapter compile", () => {
  assert.equal(programs.length, 6);
  for (const program of programs) {
    const result = spawnSync("python3", ["-c", "import ast,sys; ast.parse(sys.stdin.read())"], { input: program, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
  }
});

test("inactive runtime builder fails closed on missing native artifacts", () => {
  const result = spawnSync("python3", ["-c", `
import os, sys, types, tempfile
from pathlib import Path
for name in ['ares_runtime', 'ares_runtime.local_runtime', 'hermes_cli', 'hermes_cli.managed_uv']:
    sys.modules[name] = types.ModuleType(name)
sys.modules['ares_runtime.local_runtime'].AresLocalRuntime = object
sys.modules['ares_runtime.local_runtime'].AresLocalRuntimeError = RuntimeError
sys.modules['hermes_cli.managed_uv'].ensure_uv = lambda: 'uv'
with tempfile.TemporaryDirectory() as temp:
    os.environ.update(ARES_HOME=temp, ARES_INSTALL_EXTRAS='true', ARES_INSTALL_DESKTOP='false', ARES_INSTALL_WHEELS=temp)
    try:
        exec(sys.stdin.read())
    except SystemExit as error:
        assert 'Expected three verified native wheels' in str(error), error
    else:
        raise AssertionError('Missing wheel set did not block installation')
`], { input: buildProgram, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("fresh native runtime is sealed before activation and existing releases are preserved", () => {
  const result = spawnSync("python3", ["-c", `
import os, sys, types, tempfile, subprocess
from contextlib import nullcontext
from pathlib import Path
program = sys.stdin.read()
for name in ['ares_runtime', 'ares_runtime.local_runtime', 'hermes_cli', 'hermes_cli.managed_uv']:
    sys.modules[name] = types.ModuleType(name)
events = []
class Runtime:
    def __init__(self):
        self.paths = types.SimpleNamespace(releases_dir=Path(os.environ['ARES_HOME'])/'releases')
    def locked(self): return nullcontext()
    def _git_output(self, source, *args): return 'a' * 40
    def _release_source(self, revision): raise AssertionError('Fresh install must not require an existing release')
    def _python_for(self, source): return source/'.venv/bin/python'
    def _build_environment(self, source): return {}
    def _agent_environment(self): return {}
    def _sync_python_runtime(self, source):
        events.append('base-sync')
        (source/'.venv'/'bin').mkdir(parents=True,exist_ok=True)
    def _run(self, argv, **kwargs):
        events.append([str(a) for a in argv])
        return types.SimpleNamespace(stdout='fixture tool versions')
    def _materialize(self, source, revision, **kwargs):
        self._sync_python_runtime(self.paths.releases_dir/revision/'source')
        events.append('sealed-inactive')
sys.modules['ares_runtime.local_runtime'].AresLocalRuntime = Runtime
sys.modules['ares_runtime.local_runtime'].AresLocalRuntimeError = RuntimeError
sys.modules['hermes_cli.managed_uv'].ensure_uv = lambda: 'uv'
with tempfile.TemporaryDirectory() as temp:
    root=Path(temp)
    for index in range(3): (root/f'{index}.whl').write_bytes(b'fixture')
    binaries = root/'enhancements'/'bin'
    binaries.mkdir(parents=True)
    for name in ['context-governor','semantic-memory-mcp','claim-ledger-mcp','agent-graph-mcp','agent-graph-mcpd','agent-graph-operator','cea-graph','pilot-bridge']:
        (binaries/name).write_bytes(b'fixture-tool')
    (root/'installer-sources'/'agent-memory-kits').mkdir(parents=True)
    os.environ.update(ARES_HOME=temp, ARES_INSTALL_EXTRAS='true', ARES_INSTALL_DESKTOP='true', ARES_INSTALL_WHEELS=temp, ARES_INSTALL_SOURCE=temp, ARES_INSTALL_RECIPE_VERSION='fixture')
    exec(program, {})
    assert events[0][:2] == ['cargo','install'], events
    assert events[1] == 'base-sync', events
    assert '--extra' in events[2] and 'wake' in events[2] and 'voice' in events[2], events
    assert 'mcp==2.2.0' in events[3] and '--no-deps' in events[3], events
    assert events[5][:3] == ['uv','pip','install'], events
    assert '-c' in events[6] and events[7] == 'sealed-inactive', events
    import json
    receipt = json.loads((root/'install-receipts/latest.json').read_text())
    assert len(receipt['native_wheels']) == 3 and receipt['sdk_dependencies'] == ['mcp==2.2.0','mcp-types==2.2.0'], receipt
    events.clear()
    assert (root/'releases'/('a'*40)/'source').is_dir()
    os.environ['ARES_INSTALL_RECIPE_VERSION'] = 'changed-inputs'
    try:
        exec(program, {})
    except SystemExit as error:
        assert 'immutable release was preserved' in str(error), error
    else:
        raise AssertionError('Existing incomplete release was not rejected')
    assert events == [['cargo','install','--list','--root',str(root/'enhancements')]], events
`], { input: buildProgram, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("failed configuration restores an existing setup and removes a failed fresh setup", () => {
  const result = spawnSync("python3", ["-c", `
import json, os, sys, tempfile, types
from pathlib import Path
restore, configure = json.loads(sys.stdin.read())
for name in ['hermes_cli', 'hermes_cli.config']:
    sys.modules[name] = types.ModuleType(name)
module = sys.modules['hermes_cli.config']
module.load_config = lambda: {}
with tempfile.TemporaryDirectory() as temp:
    for existed in (True, False):
        home = Path(temp)/str(existed)
        home.mkdir()
        original = {'config.yaml': b'original-config', '.env': b'private-original-credential'}
        if existed:
            for name, content in original.items(): (home/name).write_bytes(content)
        backup = home/'backup'
        os.environ.update(ARES_HOME=str(home), ARES_INSTALL_SOURCE=temp, ARES_INSTALL_EXTRAS='true', ARES_INSTALL_BACKUP=str(backup))
        def save_config(config): (home/'config.yaml').write_text('changed-config')
        def save_env_value(name, value):
            (home/'.env').write_text('partial-update')
            raise RuntimeError('fixture: write failure before activation')
        module.save_config = save_config
        module.save_env_value = save_env_value
        try: exec(configure, {})
        except RuntimeError: pass
        else: raise AssertionError('Fixture did not reach the failure boundary')
        sys.argv = ['restore', str(backup)]
        exec(restore, {})
        for name, content in original.items():
            assert (home/name).read_bytes() == content if existed else not (home/name).exists(), name
`], { input: JSON.stringify([restoreProgram, configProgram]), encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  assert.doesNotMatch(result.stdout + result.stderr, /private-original-credential/);
});

test("deferred gateway is recorded explicitly and cannot hide another failed health check", () => {
  const result = spawnSync("python3", ["-c", `
import json, os, sys, tempfile
from pathlib import Path
program = sys.stdin.read()
with tempfile.TemporaryDirectory() as temp:
    home = Path(temp)
    records = home/'install-receipts'
    records.mkdir()
    (records/'latest.json').write_text('{}')
    log = home/'doctor.log'
    required = ['active runtime','stable Python','selected release tree','Ares runtime imports','SQLite runtime','Context Governor strict probe','MCP readiness','runtime process coherence','Ares gateway']
    def write_checks(failed):
        log.write_text('\\n'.join(('FAIL' if label in failed else 'PASS')+' '+label+': fixture' for label in required)+'\\n')
    write_checks({'Ares gateway'})
    os.environ.update(ARES_HOME=temp, ARES_BIN_DIR=str(home/'bin'), ARES_INSTALL_GATEWAY_STARTED='false', ARES_INSTALL_SETUP='false', ARES_INSTALL_MODIFY_PATH='false', ARES_INSTALL_DOCTOR_LOG=str(log), ARES_INSTALL_DOCTOR_STATUS='1')
    exec(program, {})
    receipt = json.loads((records/'latest.json').read_text())
    assert receipt['health_checks'][-1]['state'] == 'deferred', receipt
    assert receipt['gateway_started'] is False and receipt['runtime_checks'] == 'passed', receipt
    for failing in ['Context Governor strict probe', 'MCP readiness']:
        write_checks({failing, 'Ares gateway'})
        try: exec(program, {})
        except SystemExit as error: assert 'health checks failed' in str(error), error
        else: raise AssertionError('Required health failure was accepted')
    write_checks({'Ares gateway'})
    os.environ['ARES_INSTALL_GATEWAY_STARTED'] = 'true'
    try: exec(program, {})
    except SystemExit as error: assert 'health checks failed' in str(error), error
    else: raise AssertionError('Started gateway health failure was accepted')
    log.write_text('PASS active runtime: fixture\\n')
    try: exec(program, {})
    except SystemExit as error: assert 'incomplete evidence' in str(error), error
    else: raise AssertionError('Truncated health evidence was accepted')
`], { input: doctorProgram, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("legacy endpoint forwards visibly and never retains the retired installer", () => {
  const text = readFileSync(legacy, "utf8");
  assert.match(text, /Hermes installer has been retired/);
  assert.match(text, /https:\/\/recursiveintell.com\/ares\/install.sh/);
  assert.doesNotMatch(text, /hermes-agent\.git|20260803|OPENAI_API_KEY/);
});

const pythonFixture = (program, fixture) => {
  const result = spawnSync("python3", ["-c", fixture], { input: program, encoding: "utf8" });
  assert.equal(result.status, 0, result.stdout + result.stderr);
};

test("legacy enhancement flags preserve full defaults and valued arguments", () => {
  const directory = mkdtempSync(join(tmpdir(), "ares-legacy-"));
  try {
    const curl = join(directory, "curl");
    writeFileSync(curl, '#!/usr/bin/env bash\ncp "$TEST_INSTALLER" "${@: -1}"\n');
    chmodSync(curl, 0o755);
    const flags = ["--with-josh-setup", "--with-all-mcp", "--with-semantic-memory", "--with-agent-graph", "--with-claim-ledger", "--with-cea-graph", "--with-pilot-bridge"];
    for (const flag of flags) {
      const result = spawnSync("bash", [legacy.pathname, flag, "--plan", "--home", join(directory, "data with spaces"), "--branch", "candidate", "--skip-setup"], {
        encoding: "utf8", env: { ...process.env, PATH: `${directory}:${process.env.PATH}`, TEST_INSTALLER: installer.pathname },
      });
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /covered by Ares full defaults/);
      assert.match(result.stdout, /branch=candidate; home=.*data with spaces.*enhancements=true.*provider wizard=false/);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("unsupported legacy runtime flags fail with guidance before downloading", () => {
  const directory = mkdtempSync(join(tmpdir(), "ares-legacy-reject-"));
  try {
    writeFileSync(join(directory, "curl"), '#!/usr/bin/env bash\ntouch "$TEST_DOWNLOAD_MARKER"\nexit 99\n');
    chmodSync(join(directory, "curl"), 0o755);
    for (const flag of ["--skip-rust", "--no-venv"]) {
      const result = spawnSync("bash", [legacy.pathname, flag, "--plan"], {
        encoding: "utf8", env: { ...process.env, PATH: `${directory}:${process.env.PATH}`, TEST_DOWNLOAD_MARKER: join(directory, "downloaded") },
      });
      assert.equal(result.status, 1);
      assert.match(result.stderr, /unsupported/);
      assert.match(result.stderr, flag === "--skip-rust" ? /--minimal/ : /managed Python runtime/);
      assert.deepEqual(readdirSync(directory), ["curl"]);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("canonical npm test includes the installer regression suite", () => {
  const manifest = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
  assert.match(manifest.scripts.test, /npm run test:installer(?:\s*&&|$)/);
});

test("reused shallow checkout switches to a new branch, advances it, and preserves local work", () => {
  const directory = mkdtempSync(join(tmpdir(), "ares-checkout-"));
  const git = (args, options = {}) => {
    const result = spawnSync("git", args, { encoding: "utf8", ...options });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  try {
    const upstream = join(directory, "upstream");
    const checkout = join(directory, "checkout");
    mkdirSync(upstream);
    git(["init", "-b", "main", upstream]);
    git(["-C", upstream, "config", "user.email", "fixture@example.invalid"]);
    git(["-C", upstream, "config", "user.name", "Fixture"]);
    writeFileSync(join(upstream, "main.txt"), "main");
    git(["-C", upstream, "add", "."]);
    git(["-C", upstream, "commit", "-m", "main"]);
    git(["-C", upstream, "switch", "-c", "candidate"]);
    writeFileSync(join(upstream, "candidate.txt"), "candidate");
    git(["-C", upstream, "add", "."]);
    git(["-C", upstream, "commit", "-m", "candidate"]);
    git(["clone", "--depth", "1", "--single-branch", "--branch", "main", `file://${upstream}`, checkout]);
    // Only transport/origin identity is faked; checkout and merge use real Git.
    const bin = join(directory, "bin");
    mkdirSync(bin);
    writeFileSync(join(bin, "git"), `#!/usr/bin/env bash
if [[ "$3" == remote && "$4" == get-url ]]; then printf '%s\\n' "\${TEST_ORIGIN_IDENTITY:-https://github.com/RecursiveIntell/Ares.git}"; exit; fi
if [[ "$3" == fetch ]]; then exec "$TEST_REAL_GIT" -C "$2" fetch "$TEST_UPSTREAM" "$5"; fi
exec "$TEST_REAL_GIT" "$@"
`);
    chmodSync(join(bin, "git"), 0o755);
    const realGitPath = spawnSync("bash", ["-c", "command -v git"], { encoding: "utf8" }).stdout.trim();
    assert.ok(realGitPath);
    const checkoutFunction = source.match(/checkout\(\) \{[\s\S]*?\n\}\n\nSTEP=source/)[0].replace(/\n\nSTEP=source$/, "");
    const invoke = (extra = {}) => spawnSync("bash", ["-c", `set -euo pipefail\ndie() { printf '%s\\n' "$*" >&2; exit 1; }\n${checkoutFunction}\ncheckout Ares "$TEST_CHECKOUT" candidate`], {
      encoding: "utf8", env: { ...process.env, PATH: `${bin}:${process.env.PATH}`, TEST_REAL_GIT: realGitPath, TEST_UPSTREAM: upstream, TEST_CHECKOUT: checkout, ...extra },
    });
    let result = invoke();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(["-C", checkout, "branch", "--show-current"]), "candidate");
    assert.equal(git(["-C", checkout, "rev-parse", "HEAD"]), git(["-C", upstream, "rev-parse", "candidate"]));
    writeFileSync(join(upstream, "candidate.txt"), "candidate v2");
    git(["-C", upstream, "commit", "-am", "advance"]);
    result = invoke();
    assert.equal(result.status, 0, result.stderr);
    assert.equal(git(["-C", checkout, "rev-parse", "HEAD"]), git(["-C", upstream, "rev-parse", "candidate"]));
    writeFileSync(join(checkout, "local.txt"), "keep local work");
    result = invoke();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Refusing to overwrite local changes/);
    assert.equal(readFileSync(join(checkout, "local.txt"), "utf8"), "keep local work");
    rmSync(join(checkout, "local.txt"));
    result = invoke({ TEST_ORIGIN_IDENTITY: "https://example.invalid/other.git" });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Unexpected repository origin/);
    git(["-C", checkout, "config", "user.email", "fixture@example.invalid"]);
    git(["-C", checkout, "config", "user.name", "Fixture"]);
    writeFileSync(join(checkout, "local.txt"), "local commit");
    git(["-C", checkout, "add", "."]);
    git(["-C", checkout, "commit", "-m", "local"]);
    const localHead = git(["-C", checkout, "rev-parse", "HEAD"]);
    writeFileSync(join(upstream, "remote.txt"), "remote commit");
    git(["-C", upstream, "add", "."]);
    git(["-C", upstream, "commit", "-m", "remote"]);
    result = invoke();
    assert.notEqual(result.status, 0);
    assert.equal(git(["-C", checkout, "rev-parse", "HEAD"]), localHead);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test("minimal update rejects a full home before materialization and permits fresh/minimal homes", () => {
  pythonFixture(buildProgram, `
import json, os, sys, shutil, tempfile, types
from contextlib import nullcontext
from pathlib import Path
program = sys.stdin.read()
for name in ['ares_runtime', 'ares_runtime.local_runtime', 'hermes_cli', 'hermes_cli.managed_uv']:
    sys.modules[name] = types.ModuleType(name)
events = []
class Runtime:
    def __init__(self): self.paths = types.SimpleNamespace(releases_dir=Path(os.environ['ARES_HOME'])/'releases')
    def locked(self): return nullcontext()
    def _git_output(self, *args): return 'b'*40
    def _python_for(self, source): return source/'.venv/bin/python'
    def _agent_environment(self): return {}
    def _build_environment(self, source): return {}
    def _run(self, *args, **kwargs): events.append('run')
    def _sync_python_runtime(self, source): events.append('sync')
    def _materialize(self, source, revision, **kwargs):
        events.append('materialize')
        self._sync_python_runtime(self.paths.releases_dir/revision/'source')
sys.modules['ares_runtime.local_runtime'].AresLocalRuntime = Runtime
sys.modules['hermes_cli.managed_uv'].ensure_uv = lambda: 'uv'
with tempfile.TemporaryDirectory() as temp:
    home = Path(temp)
    current = home/'runtime/current'
    current.parent.mkdir()
    old = home/'old'
    record = old/'.venv/share/ares-full-install.json'
    record.parent.mkdir(parents=True)
    record.write_text(json.dumps({'inputs':{'enhancements':True}}))
    current.symlink_to(old, target_is_directory=True)
    config = home/'config.yaml'
    config.write_text('unchanged full config')
    receipt = home/'install-receipts/latest.json'
    receipt.parent.mkdir()
    receipt.write_text('unchanged receipt')
    os.environ.update(ARES_HOME=temp, ARES_INSTALL_EXTRAS='false', ARES_INSTALL_DESKTOP='false', ARES_INSTALL_WHEELS=temp, ARES_INSTALL_SOURCE=temp, ARES_INSTALL_RECIPE_VERSION='3')
    try: exec(program, {})
    except SystemExit as error: assert 'Cannot switch a full Ares home' in str(error), error
    else: raise AssertionError('Full-to-minimal transition activated')
    assert events == [], events
    assert current.readlink() == old
    assert config.read_text() == 'unchanged full config'
    assert receipt.read_text() == 'unchanged receipt'
    for previously_minimal in (True, False):
        record.write_text(json.dumps({'inputs':{'enhancements':False}})) if previously_minimal else record.unlink()
        shutil.rmtree(home/'releases', ignore_errors=True)
        events.clear()
        exec(program, {})
        assert events[0] == 'materialize', events
        assert json.loads(receipt.read_text())['enhancements'] is False
`);
});

test("memory plugin follows release updates and rollback while preserving customized copies", () => {
  pythonFixture(JSON.stringify([configProgram, restoreProgram]), `
import json, os, sys, shutil, tempfile, types
from pathlib import Path
configure, restore = json.loads(sys.stdin.read())
for name in ['hermes_cli', 'hermes_cli.config']: sys.modules[name] = types.ModuleType(name)
module = sys.modules['hermes_cli.config']
with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    for mode in ['unchanged', 'fresh', 'customized', 'untracked', 'custom-link', 'managed-link']:
        home = root/mode
        home.mkdir()
        current = home/'runtime/current'
        current.parent.mkdir()
        old, new = home/'old', home/'new'
        suffix = Path('.venv/share/agent-memory-kits/hermes')
        for release, version in [(old, 'old'), (new, 'new')]:
            kit = release/suffix
            kit.mkdir(parents=True)
            (kit/'plugin.yaml').write_text('name: semantic-memory-mcp')
            (kit/'__init__.py').write_text(version)
            (kit/'scripts').mkdir()
            (kit/'scripts/helper.py').write_text(version)
        kits_source = home/'installer-sources/agent-memory-kits/hermes'
        shutil.copytree(new/suffix, kits_source)
        current.symlink_to(old, target_is_directory=True)
        target = current/suffix
        plugin = home/'plugins/semantic-memory-mcp'
        plugin.parent.mkdir()
        if mode in ['unchanged', 'customized', 'untracked']:
            shutil.copytree(old/suffix, plugin)
            (plugin/'__pycache__').mkdir()
            (plugin/'__pycache__/generated.pyc').write_bytes(b'bytecode')
            if mode == 'customized': (plugin/'__init__.py').write_text('user-custom')
            if mode == 'untracked': (old/suffix/'unknown').write_text('not copied')
        elif mode == 'custom-link': plugin.symlink_to(new/suffix, target_is_directory=True)
        elif mode == 'managed-link': plugin.symlink_to(target, target_is_directory=True)
        config, env = home/'config.yaml', home/'.env'
        config.write_text('original-config')
        env.write_text('original-env')
        module.load_config = lambda: {}
        module.save_config = lambda data: config.write_text(json.dumps(data))
        module.save_env_value = lambda name, value: env.write_text(name+'='+value)
        backup = home/'backup'
        os.environ.update(ARES_HOME=str(home), ARES_INSTALL_SOURCE=str(root/'source'), ARES_INSTALL_EXTRAS='true', ARES_INSTALL_BACKUP=str(backup))
        if mode in ['customized', 'untracked', 'custom-link']:
            before = (plugin/'__init__.py').read_text()
            try: exec(configure, {})
            except SystemExit as error: assert 'preserved' in str(error), error
            else: raise AssertionError('Custom or untracked plugin silently overwritten')
            assert (plugin/'__init__.py').read_text() == before
            assert config.read_text() == 'original-config' and env.read_text() == 'original-env'
            assert current.readlink() == old and not backup.exists()
            continue
        exec(configure, {})
        assert plugin.is_symlink() and plugin.readlink() == target
        assert (plugin/'scripts/helper.py').read_text() == 'old'
        current.unlink(); current.symlink_to(new, target_is_directory=True)
        assert (plugin/'scripts/helper.py').read_text() == 'new'
        # Runtime rollback automatically restores plugin code via current.
        current.unlink(); current.symlink_to(old, target_is_directory=True)
        assert (plugin/'scripts/helper.py').read_text() == 'old'
        # An activation failure restores original config and original home copy.
        sys.argv = ['restore', str(backup)]
        exec(restore, {})
        assert config.read_text() == 'original-config' and env.read_text() == 'original-env'
        if mode == 'fresh': assert not plugin.exists() and not plugin.is_symlink()
        elif mode == 'unchanged':
            assert not plugin.is_symlink() and (plugin/'__init__.py').read_text() == 'old'
            assert (plugin/'__pycache__/generated.pyc').read_bytes() == b'bytecode'
        else: assert plugin.is_symlink() and plugin.readlink() == target
`);
});

test("gateway identity isolates physical homes and retains only the legacy unit's owner", () => {
  assert.ok(gatewayProgram, "installer must compute a per-home gateway unit");
  pythonFixture(gatewayProgram, `
import contextlib, io, os, sys, tempfile
from pathlib import Path
program = sys.stdin.read()
with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    os.environ['HOME'] = temp
    first, second = root/'first', root/'second'
    first.mkdir(); second.mkdir()
    alias = root/'alias'; alias.symlink_to(first, target_is_directory=True)
    def unit(home):
        os.environ['ARES_HOME'] = str(home)
        output = io.StringIO()
        with contextlib.redirect_stdout(output): exec(program, {})
        return Path(output.getvalue().strip())
    first_unit = unit(first)
    second_unit = unit(second)
    assert first_unit != second_unit
    assert unit(first) == first_unit and unit(alias) == first_unit
    assert first_unit.name.startswith('ares-full-gateway-')
    assert first_unit.parent == root/'.config/systemd/user'
    first_unit.parent.mkdir(parents=True)
    legacy = first_unit.parent/'ares-full-gateway.service'
    legacy.write_text(f'[Service]\\nEnvironment=HERMES_HOME={first}\\n')
    original = legacy.read_bytes()
    assert unit(first) == legacy and unit(alias) == legacy
    assert unit(second) == second_unit
    assert legacy.read_bytes() == original
    legacy.write_text(f'Environment=HERMES_HOME={alias}\\n')
    assert unit(first) == legacy
    legacy.write_text(f'Environment=HERMES_HOME={first}-different\\n')
    assert unit(first) == first_unit
`);
});

test("a shared launcher cannot redirect the gateway of another physical home", () => {
  assert.ok(launcherProgram, "installer must check launcher ownership before activation");
  pythonFixture(launcherProgram, `
import os, shlex, sys, tempfile
from pathlib import Path
program = sys.stdin.read()
with tempfile.TemporaryDirectory() as temp:
    root = Path(temp)
    first, second = root/'first with spaces', root/'second'
    first.mkdir(); second.mkdir()
    alias = root/'alias'; alias.symlink_to(first, target_is_directory=True)
    bins = root/'bin'; bins.mkdir()
    launcher = bins/'ares'
    original = '#!/usr/bin/env bash\\nif [[ -z "\u0024{ARES_HOME:-}" ]]; then export ARES_HOME='+shlex.quote(str(first))+'; fi\\nexec python -m ares_runtime.local_runtime "\u0024@"\\n'
    launcher.write_text(original)
    os.environ.update(ARES_HOME=str(second), ARES_BIN_DIR=str(bins))
    try: exec(program, {})
    except SystemExit as error: assert 'separate --bin-dir' in str(error), error
    else: raise AssertionError('Second home overwrote first home launcher')
    assert launcher.read_text() == original
    for home in [first, alias]:
        os.environ['ARES_HOME'] = str(home)
        exec(program, {})
    launcher.write_text('unrelated launcher')
    try: exec(program, {})
    except SystemExit as error: assert 'unrecognized launcher' in str(error), error
    else: raise AssertionError('Unrelated launcher was accepted')
    launcher.write_text('# ares_runtime.local_runtime without owner')
    try: exec(program, {})
    except SystemExit as error: assert 'unrecognized launcher' in str(error), error
    else: raise AssertionError('Unknown Ares launcher ownership was accepted')
`);
});
