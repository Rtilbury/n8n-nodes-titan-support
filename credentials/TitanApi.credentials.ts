
import {
	IAuthenticateGeneric,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class TitanApi implements ICredentialType {
	name = 'titanApi';
	displayName = 'Titan API';
	icon = 'file:titan.svg' as const;

	documentationUrl =
		'https://github.com/Rtilbury/n8n-nodes-titan-support';

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
			description:
				'Titan API key used to authenticate requests to the governed analysis API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};
}
