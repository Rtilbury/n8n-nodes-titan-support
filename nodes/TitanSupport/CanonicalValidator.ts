
const SCHEMA_VERSION = '1.0.0';

type CanonicalObject = Record<string, unknown>;

function isObject(value: unknown): value is CanonicalObject {
	return (
		typeof value === 'object' &&
		value !== null &&
		!Array.isArray(value)
	);
}

function hasFields(
	value: unknown,
	fields: readonly string[],
): value is CanonicalObject {
	return (
		isObject(value) &&
		fields.every((field) =>
			Object.prototype.hasOwnProperty.call(value, field),
		)
	);
}

function isNonEmptyString(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0;
}

function isOneOf(
	value: unknown,
	allowed: readonly string[],
): boolean {
	return typeof value === 'string' && allowed.includes(value);
}

const TOP_LEVEL_FIELDS = [
	'identity',
	'intelligence',
	'recovery',
	'governance',
	'telemetry',
];

const DETERMINATIONS = [
	'classified',
	'partially_classified',
	'unclassified',
];

const GOVERNANCE_DISPOSITIONS = [
	'approved',
	'approved_with_constraints',
	'manual_review_required',
	'blocked',
	'indeterminate',
];

const AUTOMATION_DISPOSITIONS = [
	'supported',
	'requires_approval',
	'not_supported',
];

const EVIDENCE_SUFFICIENCY = [
	'sufficient',
	'partially_sufficient',
	'insufficient',
];

export function isCanonicalResponse(value: unknown): boolean {
	if (!hasFields(value, TOP_LEVEL_FIELDS)) {
		return false;
	}

	if (
		!Object.keys(value).every(
			(key) =>
				TOP_LEVEL_FIELDS.includes(key) ||
				key === 'extensions',
		)
	) {
		return false;
	}

	const {
		identity,
		intelligence,
		recovery,
		governance,
		telemetry,
	} = value;

	if (
		!hasFields(identity, [
			'response_id',
			'request_id',
			'generated_at',
			'engine_version',
			'schema_version',
		])
	) {
		return false;
	}

	if (
		identity.schema_version !== SCHEMA_VERSION ||
		!isNonEmptyString(identity.response_id) ||
		!isNonEmptyString(identity.request_id) ||
		!isNonEmptyString(identity.generated_at) ||
		!isNonEmptyString(identity.engine_version)
	) {
		return false;
	}

	if (
		!hasFields(intelligence, [
			'determination',
			'classification',
			'confidence',
			'facts',
			'evidence',
			'operational_signal',
			'impact',
			'explanation',
		])
	) {
		return false;
	}

	if (
		!isOneOf(intelligence.determination, DETERMINATIONS) ||
		!hasFields(intelligence.classification, ['category'])
	) {
		return false;
	}

	const category = intelligence.classification.category;
	const subtype = intelligence.classification.subtype;

	if (
		!isNonEmptyString(category) ||
		category === 'unmapped' ||
		category === 'unmapped_signature' ||
		(subtype !== undefined &&
			(!isNonEmptyString(subtype) ||
				subtype === 'unmapped' ||
				subtype === 'unmapped_signature'))
	) {
		return false;
	}

	if (
		!hasFields(intelligence.evidence, [
			'supporting',
			'conflicting',
			'missing',
			'sufficiency',
		]) ||
		!Array.isArray(intelligence.evidence.supporting) ||
		!Array.isArray(intelligence.evidence.conflicting) ||
		!isOneOf(
			intelligence.evidence.sufficiency,
			EVIDENCE_SUFFICIENCY,
		)
	) {
		return false;
	}

	if (
		!hasFields(recovery, [
			'recommendation',
			'rationale',
			'automation',
			'limitations',
		]) ||
		!isOneOf(recovery.automation, AUTOMATION_DISPOSITIONS)
	) {
		return false;
	}

	if (
		!hasFields(governance, [
			'disposition',
			'constraints',
			'policy',
		]) ||
		!isOneOf(
			governance.disposition,
			GOVERNANCE_DISPOSITIONS,
		)
	) {
		return false;
	}

	if (
		!hasFields(telemetry, [
			'execution',
			'indicators',
			'audit_reference',
		])
	) {
		return false;
	}

	return true;
}
