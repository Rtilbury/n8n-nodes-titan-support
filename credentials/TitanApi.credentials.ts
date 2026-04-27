import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TitanApi implements ICredentialType {
	name = 'titanApi';
	displayName = 'Titan API';
	icon = 'file:titan.svg' as const;
	documentationUrl = 'https://github.com/Rtilbury/n8n-nodes-titan-support';

	test = {
		request: {
			baseURL: 'https://b2hmcbgju7.eu-west-1.awsapprunner.com',
			url: '/health',
			method: 'GET' as const,
		},
	};

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
	];
}