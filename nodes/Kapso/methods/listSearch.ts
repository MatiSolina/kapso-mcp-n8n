import type {
	ILoadOptionsFunctions,
	INodeListSearchResult,
	IHttpRequestMethods,
} from 'n8n-workflow';

const MCP_BASE_URL = 'https://app.kapso.ai/mcp';

export async function searchTemplates(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'kapsoApi',
		{
			method: 'POST' as IHttpRequestMethods,
			url: MCP_BASE_URL,
			body: {
				jsonrpc: '2.0',
				id: Date.now(),
				method: 'tools/call',
				params: {
					name: 'whatsapp_templates',
					arguments: { search: filter || '', response_format: 'detailed' },
				},
			},
			json: true,
		},
	);

	const templates = responseData.result?.content?.[0]?.text || '[]';
	let parsedTemplates: Array<{ name: string; language?: string; status?: string }> = [];

	try {
		const parsed = JSON.parse(templates);
		parsedTemplates = Array.isArray(parsed) ? parsed : parsed.templates || [];
	} catch {
		parsedTemplates = [];
	}

	return {
		results: parsedTemplates.map((template) => ({
			name: template.name + (template.language ? ` (${template.language})` : ''),
			value: template.name,
		})),
	};
}

export async function searchCustomers(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'kapsoApi',
		{
			method: 'POST' as IHttpRequestMethods,
			url: MCP_BASE_URL,
			body: {
				jsonrpc: '2.0',
				id: Date.now(),
				method: 'tools/call',
				params: {
					name: 'platform_list_customers',
					arguments: { search: filter || '', response_format: 'detailed' },
				},
			},
			json: true,
		},
	);

	const customersText = responseData.result?.content?.[0]?.text || '[]';
	let customers: Array<{ id: string; name: string }> = [];

	try {
		const parsed = JSON.parse(customersText);
		customers = Array.isArray(parsed) ? parsed : parsed.customers || [];
	} catch {
		customers = [];
	}

	return {
		results: customers.map((customer) => ({
			name: customer.name,
			value: customer.id,
		})),
	};
}

export async function searchWhatsAppConfigs(
	this: ILoadOptionsFunctions,
): Promise<INodeListSearchResult> {
	const responseData = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'kapsoApi',
		{
			method: 'POST' as IHttpRequestMethods,
			url: MCP_BASE_URL,
			body: {
				jsonrpc: '2.0',
				id: Date.now(),
				method: 'tools/call',
				params: {
					name: 'whatsapp_configs_overview',
					arguments: { response_format: 'detailed' },
				},
			},
			json: true,
		},
	);

	const configsText = responseData.result?.content?.[0]?.text || '[]';
	let configs: Array<{ id: string; phone_number?: string; display_name?: string }> = [];

	try {
		const parsed = JSON.parse(configsText);
		configs = Array.isArray(parsed) ? parsed : parsed.configs || [];
	} catch {
		configs = [];
	}

	return {
		results: configs.map((config) => ({
			name: config.display_name || config.phone_number || config.id,
			value: config.id,
		})),
	};
}
