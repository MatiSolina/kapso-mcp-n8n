import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KapsoApi implements ICredentialType {
	name = 'kapsoApi';
	displayName = 'Kapso API';
	documentationUrl = 'https://docs.kapso.ai';
	icon = { light: 'file:../nodes/Kapso/kapso.svg', dark: 'file:../nodes/Kapso/kapso.svg' } as const;
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Kapso API Key. Get it from https://app.kapso.ai',
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

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.kapso.ai',
			url: '/platform/v1/customers',
			method: 'GET',
		},
	};
}
