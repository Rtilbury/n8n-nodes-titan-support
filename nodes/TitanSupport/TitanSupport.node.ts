import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeApiError,
} from 'n8n-workflow';

export class TitanSupport implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Titan Support',
		name: 'titanSupport',
		icon: 'file:titan.svg',
		group: ['transform'],
		version: 1,
		description: 'Send errors or payloads to Titan Support API',
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
				placeholder: 'Paste error, JSON, or payload',
				description: 'Input sent to Titan',
			},
			{
				displayName: 'Expected Schema',
				name: 'expectedSchema',
				type: 'json',
				default: '{}',
				description: 'Optional schema for validation',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const input = this.getNodeParameter('input', i) as string;
				const expectedSchema = this.getNodeParameter('expectedSchema', i);

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'titanApi',
					{
						method: 'POST',
						url: 'https://b2hmcbgju7.eu-west-1.awsapprunner.com/v1/support/generate',
						headers: {
							'Content-Type': 'application/json',
						},
						body: {
							error: input,
							context: {
								source: 'n8n-community-node',
								node_version: '0.1.3',
								expected_schema: expectedSchema,
							},
						},
						json: true,
					},
				);

				returnData.push({
					json: response as IDataObject,
				});
			} catch (error) {
				throw new NodeApiError(this.getNode(), error);
			}
		}

		return [returnData];
	}
}