
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,	
	NodeOperationError,
} from 'n8n-workflow';

const TITAN_ANALYZE_URL =
	'https://b2hmcbgju7.eu-west-1.awsapprunner.com/v1/analyze';

const CLIENT_VERSION = '0.1.5';
const MAX_EVIDENCE_LENGTH = 200000;

function hasLegacyExpectedSchema(value: unknown): boolean {
	if (value === undefined || value === null) {
		return false;
	}

	if (typeof value === 'string') {
		const parsed: unknown = JSON.parse(value);

		if (
			typeof parsed === 'object' &&
			parsed !== null &&
			!Array.isArray(parsed)
		) {
			return Object.keys(parsed).length > 0;
		}

		return true;
	}

	if (typeof value === 'object' && !Array.isArray(value)) {
		return Object.keys(value).length > 0;
	}

	return true;
}

export class TitanSupport implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Titan Support',
		name: 'titanSupport',
		icon: 'file:titan.svg',
		group: ['transform'],
		version: 1,
		description:
			'Analyse operational evidence using the Titan Canonical API',
		defaults: {
			name: 'Titan Support',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		credentials: [
			{
				name: 'titanApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Input',
				name: 'input',
				type: 'string',
				default: '',
				placeholder: 'Map an error or operational evidence',
				description:
					'Non-empty operational evidence submitted to Titan for governed analysis',
				required: true,
			},
			{
				displayName: 'Expected Schema (Legacy)',
				name: 'expectedSchema',
				type: 'json',
				default: '{}',
				description:
					'Legacy setting. Non-empty values are not supported by Canonical Analysis v1.0.0 and will prevent the request from being sent.',
			},
		],
	};

	async execute(
		this: IExecuteFunctions,
	): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const input = this.getNodeParameter(
				'input',
				i,
			) as string;

			if (
				typeof input !== 'string' ||
				input.trim().length === 0
			) {
				throw new NodeOperationError(
					this.getNode(),
					'Titan requires non-empty operational evidence.',
					{ itemIndex: i },
				);
			}

			if (input.length > MAX_EVIDENCE_LENGTH) {
				throw new NodeOperationError(
					this.getNode(),
					'Titan evidence exceeds the Canonical 200,000-character limit.',
					{ itemIndex: i },
				);
			}

			let legacySchemaConfigured = false;

			try {
				const legacySchema = this.getNodeParameter(
					'expectedSchema',
					i,
					'{}',
				);

				legacySchemaConfigured =
					hasLegacyExpectedSchema(legacySchema);
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'The legacy Expected Schema value is invalid.',
					{ itemIndex: i },
				);
			}

			if (legacySchemaConfigured) {
				throw new NodeOperationError(
					this.getNode(),
					'The legacy Expected Schema option is not supported by the Canonical Analysis Request. Remove this setting before continuing.',
					{ itemIndex: i },
				);
			}

			const requestBody = {
				evidence: input,
				context: {
					platform: 'n8n',
				},
				metadata: {
					client_name: 'n8n-nodes-titan-support',
					client_version: CLIENT_VERSION,
					integration_id: 'n8n-community-node',
				},
				data_handling: {
					retention_preference: 'endpoint_default',
				},
			};

			let response: unknown;

			try {
				response =
					await this.helpers.httpRequestWithAuthentication.call(
						this,
						'titanApi',
						{
							method: 'POST',
							url: TITAN_ANALYZE_URL,
							headers: {
								'Content-Type': 'application/json',
							},
							body: requestBody,
							json: true,
						},
					);
			} catch {
				throw new NodeOperationError(
					this.getNode(),
					'Titan API request failed.',
					{ itemIndex: i },
				);
			}

			if (
				typeof response !== 'object' ||
				response === null ||
				Array.isArray(response)
			) {
				throw new NodeOperationError(
					this.getNode(),
					'Titan returned an invalid Canonical response.',
					{ itemIndex: i },
				);
			}

			const canonical = response as IDataObject;
			const identity = canonical.identity;

			if (
				typeof identity !== 'object' ||
				identity === null ||
				Array.isArray(identity) ||
				(identity as IDataObject).schema_version !== '1.0.0'
			) {
				throw new NodeOperationError(
					this.getNode(),
					'Titan returned a response without the required Canonical v1.0.0 identity.',
					{ itemIndex: i },
				);
			}

			returnData.push({
				json: canonical,
				pairedItem: {
					item: i,
				},
			});
		}

		return [returnData];
	}
}
