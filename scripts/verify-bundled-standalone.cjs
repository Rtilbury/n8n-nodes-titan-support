const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const source = path.join(
  __dirname, '..', 'dist', 'canonical-standalone-bundled-probe.cjs'
);

assert.ok(fs.existsSync(source), 'Bundled validator was not generated');

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

  const code = fs.readFileSync(isolated, 'utf8');
  const externalImports = [
    ...new Set(code.match(/require\s*\(\s*["'][^"']+["']\s*\)/g) || []),
  ];

  console.log('Isolated bundled validator: SUCCESS');
  console.log('Bundled bytes:', Buffer.byteLength(code));
  console.log('Rejects invalid nested response: YES');
  console.log('External require statements:', externalImports.length);
  externalImports.forEach((item) => console.log('  ' + item));

  assert.equal(
    externalImports.length,
    0,
    'Bundled validator still contains runtime imports',
  );
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
