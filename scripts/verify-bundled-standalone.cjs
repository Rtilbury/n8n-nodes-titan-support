const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const dist = path.join(__dirname, '..', 'dist');
const source = path.join(dist, 'canonical-standalone-bundled-probe.cjs');
const metadataPath = path.join(dist, 'canonical-bundle-meta.json');

assert.ok(fs.existsSync(source), 'Bundled validator was not generated');
assert.ok(fs.existsSync(metadataPath), 'esbuild metadata was not generated');

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const outputName = Object.keys(metadata.outputs).find(
  name => name.endsWith('canonical-standalone-bundled-probe.cjs')
);

assert.ok(outputName, 'Bundled validator missing from esbuild metadata');

const imports = metadata.outputs[outputName].imports || [];

assert.equal(
  imports.length,
  0,
  'Bundled validator still contains runtime imports'
);

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-validator-'));

try {
  const isolated = path.join(temp, 'validator.cjs');
  fs.copyFileSync(source, isolated);

  const validate = require(isolated);

  const invalid = {
    identity: null,
    intelligence: null,
    recovery: null,
    governance: null,
    telemetry: null,
  };

  assert.equal(typeof validate, 'function');
  assert.equal(validate(invalid), false);

  console.log('Isolated bundled validator: SUCCESS');
  console.log('Bundled bytes:', fs.statSync(isolated).size);
  console.log('Rejects invalid nested response: YES');
  console.log('esbuild output imports:', imports.length);
  console.log('External dependency verification: PASSED');
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
