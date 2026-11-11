declare const require: (id: string) => unknown;

type CanonicalValidationFunction = (value: unknown) => boolean;

const loadedValidator: unknown = require('./canonical-standalone.cjs');

if (typeof loadedValidator !== 'function') {
    throw new Error(
        'Titan Canonical standalone validator is unavailable or invalid.',
    );
}

const validateCanonical =
    loadedValidator as CanonicalValidationFunction;

export function isCanonicalResponse(value: unknown): boolean {
    return validateCanonical(value);
}
