import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const installer = new URL("../public/ares/install.sh", import.meta.url);
const legacy = new URL("../public/hermes/install.sh", import.meta.url);
const source = readFileSync(installer, "utf8");
const programs = [...source.matchAll(/<<'PY'\n([\s\S]*?)\nPY/g)].map((match) => match[1]);
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
  assert.equal(programs.length, 4);
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
`], { input: programs[1], encoding: "utf8" });
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
`], { input: programs[1], encoding: "utf8" });
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
`], { input: JSON.stringify([programs[0], programs[2]]), encoding: "utf8" });
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
`], { input: programs[3], encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
});

test("legacy endpoint forwards visibly and never retains the retired installer", () => {
  const text = readFileSync(legacy, "utf8");
  assert.match(text, /Hermes installer has been retired/);
  assert.match(text, /https:\/\/recursiveintell.com\/ares\/install.sh/);
  assert.doesNotMatch(text, /hermes-agent\.git|20260803|OPENAI_API_KEY/);
});
