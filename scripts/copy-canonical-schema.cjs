
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const source = path.join(
	root,
	'schemas',
	'titan-canonical-response.schema.json',
);

const destinationDirectory = path.join(root, 'dist', 'schemas');
const destination = path.join(
	destinationDirectory,
	'titan-canonical-response.schema.json',
);

if (!fs.existsSync(source)) {
	throw new Error('Authoritative Titan Canonical schema is missing.');
}

fs.mkdirSync(destinationDirectory, { recursive: true });
fs.copyFileSync(source, destination);

const sourceBytes = fs.readFileSync(source);
const destinationBytes = fs.readFileSync(destination);

if (!sourceBytes.equals(destinationBytes)) {
	throw new Error('Packaged Canonical schema differs from its authoritative source.');
}

console.log('Titan Canonical schema copied and byte-verified.');
