const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const Ajv2020 = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');
const standaloneCode = require('ajv/dist/standalone').default;
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const schemaPath = path.join(
  root, 'schemas', 'titan-canonical-response.schema.json'
);
const outputPath = path.join(
  root, 'dist', 'nodes', 'TitanSupport', 'canonical-standalone.cjs'
);

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv2020({
  strict: true,
  validateFormats: true,
  code: { source: true, esm: false },
});
addFormats(ajv);

const validate = ajv.compile(schema);
const generated = standaloneCode(ajv, validate);

const result = esbuild.buildSync({
  stdin: {
    contents: generated,
    resolveDir: root,
    sourcefile: 'canonical-standalone-generated.cjs',
    loader: 'js',
  },
  bundle: true,
  platform: 'node',
  format: 'cjs',
  write: false,
  metafile: true,
});

const outputs = Object.values(result.metafile.outputs);
assert.equal(outputs.length, 1, 'Expected exactly one bundled output');
assert.equal(outputs[0].imports.length, 0, 'Validator has external imports');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, result.outputFiles[0].contents);

const bundledValidate = require(outputPath);
assert.equal(typeof bundledValidate, 'function');

console.log('Production Canonical validator generated.');
console.log('External imports: 0');
console.log('Bundled bytes:', fs.statSync(outputPath).size);
