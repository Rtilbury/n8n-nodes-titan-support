
import * as fs from 'node:fs';
import * as path from 'node:path';

import Ajv2020 from 'ajv/dist/2020';
import addFormats from 'ajv-formats';

const SCHEMA_VERSION = '1.0.0';

const schemaPath = path.resolve(
	__dirname,
	'../../schemas/titan-canonical-response.schema.json',
);

const schemaBytes = fs.readFileSync(schemaPath, 'utf8');
const schema: unknown = JSON.parse(schemaBytes);

const ajv = new Ajv2020({
	allErrors: false,
	strict: true,
	validateFormats: true,
});

addFormats(ajv);

const validateSchema = ajv.compile(schema);

export function isCanonicalResponse(value: unknown): boolean {
	if (!validateSchema(value)) {
		return false;
	}

	if (
		typeof value !== 'object' ||
		value === null ||
		Array.isArray(value)
	) {
		return false;
	}

	const identity = (value as Record<string, unknown>).identity;

	if (
		typeof identity !== 'object' ||
		identity === null ||
		Array.isArray(identity)
	) {
		return false;
	}

	return (
		(identity as Record<string, unknown>).schema_version ===
		SCHEMA_VERSION
	);
}
