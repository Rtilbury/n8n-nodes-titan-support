
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

test('runtime guard rejects schema-invalid nested structures', () => {
	const response = {
		identity: {
			response_id: 'mechanical-test',
			request_id: 'mechanical-test',
			generated_at: '2026-11-05T12:00:00Z',
			engine_version: 'mechanical-test',
			schema_version: '1.0.0',
		},
		intelligence: {
			determination: 'unclassified',
			classification: {
				category: 'unknown_error',
			},
			confidence: null,
			facts: null,
			evidence: {
				supporting: [],
				conflicting: [],
				missing: [],
				sufficiency: 'insufficient',
			},
			operational_signal: null,
			impact: null,
			explanation: null,
		},
		recovery: {
			recommendation: null,
			rationale: null,
			automation: 'not_supported',
			limitations: null,
		},
		governance: {
			disposition: 'manual_review_required',
			constraints: null,
			policy: null,
		},
		telemetry: {
			execution: null,
			indicators: null,
			audit_reference: null,
		},
	};

	assert.equal(
		validateSchema(response),
		false,
		'The authoritative schema must reject this constructed response',
	);

	assert.equal(
		isCanonicalResponse(response),
		false,
		'The runtime guard must not accept schema-invalid nested structures',
	);
});
