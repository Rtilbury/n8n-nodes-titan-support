
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const Ajv2020 = require('ajv/dist/2020').default;
const addFormats = require('ajv-formats');

const { isCanonicalResponse } = require(
	'../dist/nodes/TitanSupport/CanonicalValidator.js',
);

const schemaPath = path.join(
	__dirname,
	'..',
	'schemas',
	'titan-canonical-response.schema.json',
);

const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv2020({
	strict: true,
	allErrors: true,
	validateFormats: true,
});

addFormats(ajv);

const validateSchema = ajv.compile(schema);

test('authoritative schema uses Draft 2020-12', () => {
	assert.equal(
		schema.$schema,
		'https://json-schema.org/draft/2020-12/schema',
	);
});

test('schema requires the five Canonical sections', () => {
	assert.deepEqual(schema.required, [
		'identity',
		'intelligence',
		'recovery',
		'governance',
		'telemetry',
	]);
});

test('runtime guard rejects non-object responses', () => {
	for (const value of [
		null,
		undefined,
		'',
		'not a Canonical response',
		42,
		true,
		[],
	]) {
		assert.equal(isCanonicalResponse(value), false);
	}
});

test('runtime guard rejects an empty response', () => {
	assert.equal(isCanonicalResponse({}), false);
});

test('runtime guard rejects a version-only response', () => {
	const response = {
		identity: {
			schema_version: '1.0.0',
		},
	};

	assert.equal(isCanonicalResponse(response), false);
	assert.equal(validateSchema(response), false);
});

test('runtime guard rejects an unexpected top-level field', () => {
	const response = {
		identity: {},
		intelligence: {},
		recovery: {},
		governance: {},
		telemetry: {},
		private_audit_record: {},
	};

	assert.equal(isCanonicalResponse(response), false);
	assert.equal(validateSchema(response), false);
});

test('runtime guard rejects a missing identity', () => {
	const response = {
		intelligence: {},
		recovery: {},
		governance: {},
		telemetry: {},
	};

	assert.equal(isCanonicalResponse(response), false);
	assert.equal(validateSchema(response), false);
});
