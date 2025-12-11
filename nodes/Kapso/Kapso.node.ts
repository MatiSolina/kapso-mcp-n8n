import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';

const MCP_BASE_URL = 'https://app.kapso.ai/mcp';

export class Kapso implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kapso',
		name: 'kapso',
		icon: 'file:kapso.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Kapso WhatsApp Cloud API via MCP',
		defaults: {
			name: 'Kapso',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'kapsoApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Customer', value: 'customer' },
					{ name: 'Project', value: 'project' },
					{ name: 'Setup Link', value: 'setupLink' },
					{ name: 'WhatsApp Config', value: 'whatsappConfig' },
					{ name: 'WhatsApp Contact', value: 'whatsappContact' },
					{ name: 'WhatsApp Conversation', value: 'whatsappConversation' },
					{ name: 'WhatsApp Inbox', value: 'whatsappInbox' },
					{ name: 'WhatsApp Message', value: 'whatsappMessage' },
					{ name: 'WhatsApp Template', value: 'whatsappTemplate' },
				],
				default: 'whatsappMessage',
			},

			// ==================== WhatsApp Message Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsappMessage'] } },
				options: [
					{ name: 'Send Text', value: 'sendText', description: 'Send a text message to an existing conversation', action: 'Send a text message' },
					{ name: 'Send Template', value: 'sendTemplate', description: 'Send a template message with parameters to start new conversations', action: 'Send a template message' },
					{ name: 'Send Media', value: 'sendMedia', description: 'Send an image, video, audio, or document', action: 'Send a media message' },
					{ name: 'Send Interactive', value: 'sendInteractive', description: 'Send an interactive message with buttons or lists', action: 'Send an interactive message' },
				],
				default: 'sendText',
			},

			// ==================== WhatsApp Template Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsappTemplate'] } },
				options: [
					{ name: 'Get Many', value: 'list', description: 'List or search approved templates with parameter details', action: 'Get many templates' },
				],
				default: 'list',
			},

			// ==================== WhatsApp Inbox Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsappInbox'] } },
				options: [
					{ name: 'Get Many', value: 'view', description: 'View inbox for a host number with last message preview and unread count', action: 'Get many inbox conversations' },
					{ name: 'Mark as Read', value: 'markRead', description: 'Mark messages as read in a conversation', action: 'Mark inbox messages as read' },
				],
				default: 'view',
			},

			// ==================== WhatsApp Conversation Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsappConversation'] } },
				options: [
					{ name: 'Get', value: 'getContext', description: 'Get conversation metadata and recent messages', action: 'Get a conversation' },
					{ name: 'Get Many', value: 'search', description: 'Search conversations by phone, name, status, or time', action: 'Get many conversations' },
					{ name: 'Search Messages', value: 'searchMessages', description: 'Search message text within conversations', action: 'Search conversation messages' },
					{ name: 'Update', value: 'setStatus', description: 'Update conversation status to active or ended', action: 'Update a conversation status' },
				],
				default: 'getContext',
			},

			// ==================== WhatsApp Contact Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsappContact'] } },
				options: [
					{ name: 'Get', value: 'getContext', description: 'Get contact summary with last conversation and recent messages', action: 'Get a contact' },
					{ name: 'Get Many', value: 'search', description: 'Search contacts by name or phone number', action: 'Get many contacts' },
					{ name: 'Add Note', value: 'addNote', description: 'Add a note to a contact for triage and follow-ups', action: 'Add a note to a contact' },
					{ name: 'Update', value: 'update', description: 'Update contact display name or link to a customer', action: 'Update a contact' },
				],
				default: 'getContext',
			},

			// ==================== WhatsApp Config Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['whatsappConfig'] } },
				options: [
					{ name: 'Get Many', value: 'listOverview', description: 'List host numbers for selection', action: 'Get many whats app configs' },
				],
				default: 'listOverview',
			},

			// ==================== Customer Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['customer'] } },
				options: [
					{ name: 'Create', value: 'create', description: 'Create a new customer in Kapso', action: 'Create a customer' },
					{ name: 'Get Many', value: 'list', description: 'List customers with search and pagination', action: 'Get many customers' },
					{ name: 'Get Many Configs', value: 'listConfigs', description: 'List WhatsApp configs for a customer', action: 'Get many customer configs' },
				],
				default: 'create',
			},

			// ==================== Setup Link Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['setupLink'] } },
				options: [
					{ name: 'Create', value: 'generate', description: 'Generate a branded setup link for customer WhatsApp connection', action: 'Create a setup link' },
					{ name: 'Get Many', value: 'list', description: 'List setup links for a customer with status and expiry', action: 'Get many setup links' },
					{ name: 'Delete', value: 'revoke', description: 'Revoke an active setup link to invalidate the onboarding URL', action: 'Delete a setup link' },
				],
				default: 'generate',
			},

			// ==================== Project Operations ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['project'] } },
				options: [
					{ name: 'Get', value: 'getInfo', description: 'Get current project ID and name', action: 'Get project info' },
				],
				default: 'getInfo',
			},

			// ==================== FIELDS ====================

			// Response Format (common)
			{
				displayName: 'Response Format',
				name: 'responseFormat',
				type: 'options',
				options: [
					{ name: 'Concise', value: 'concise' },
					{ name: 'Detailed', value: 'detailed' },
				],
				default: 'concise',
				description: 'Whether to return a simplified version of the response instead of the raw data',
			},

			// WhatsApp Message Fields
			{
				displayName: 'Conversation ID',
				name: 'conversationId',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendText', 'sendMedia', 'sendInteractive'] } },
				description: 'The conversation ID to send message to',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
				placeholder: 'e.g. +15551234567',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendText', 'sendTemplate', 'sendMedia', 'sendInteractive'] } },
				description: 'Phone number in international format, e.g. +15551234567',
			},
			{
				displayName: 'Message Body',
				name: 'body',
				type: 'string',
				typeOptions: { rows: 4 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendText'] } },
				description: 'The text message to send',
			},

			// Send Template Fields
			{
				displayName: 'Template Name',
				name: 'templateName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendTemplate'] } },
				description: 'Name of the approved template to send',
			},
			{
				displayName: 'Template Parameters (JSON)',
				name: 'templateParams',
				type: 'json',
				default: '{}',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendTemplate'] } },
				description: 'Template parameters as JSON object',
			},

			// Send Media Fields
			{
				displayName: 'Media Type',
				name: 'mediaType',
				type: 'options',
				options: [
					{ name: 'Image', value: 'image' },
					{ name: 'Video', value: 'video' },
					{ name: 'Audio', value: 'audio' },
					{ name: 'Document', value: 'document' },
				],
				default: 'image',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendMedia'] } },
			},
			{
				displayName: 'Media URL',
				name: 'mediaUrl',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendMedia'] } },
				placeholder: 'e.g. https://example.com/image.png',
				description: 'URL of the media file to send',
			},
			{
				displayName: 'Caption',
				name: 'caption',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendMedia'] } },
				description: 'Optional caption for the media',
			},

			// Send Interactive Fields
			{
				displayName: 'Interactive Type',
				name: 'interactiveType',
				type: 'options',
				options: [
					{ name: 'Buttons', value: 'button' },
					{ name: 'List', value: 'list' },
				],
				default: 'button',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendInteractive'] } },
			},
			{
				displayName: 'Body Text',
				name: 'bodyText',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendInteractive'] } },
				description: 'The body text of the interactive message',
			},
			{
				displayName: 'Interactive Data (JSON)',
				name: 'interactiveData',
				type: 'json',
				required: true,
				default: '{\n  "buttons": [\n    { "id": "btn1", "title": "Yes" },\n    { "id": "btn2", "title": "No" }\n  ]\n}',
				displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendInteractive'] } },
				description: 'Buttons or sections data as JSON',
			},

			// WhatsApp Template Fields
			{
				displayName: 'Search Query',
				name: 'searchQuery',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappTemplate'], operation: ['list'] } },
				description: 'Optional search query to filter templates',
			},

			// WhatsApp Inbox Fields
			{
				displayName: 'Host Number ID',
				name: 'hostNumberId',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappInbox'], operation: ['view'] } },
				description: 'The host number ID to view inbox for',
			},
			{
				displayName: 'Message IDs',
				name: 'messageIds',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappInbox'], operation: ['markRead'] } },
				description: 'Comma-separated message IDs to mark as read',
			},

			// WhatsApp Conversation Fields
			{
				displayName: 'Conversation ID',
				name: 'conversationIdGet',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappConversation'], operation: ['getContext', 'setStatus'] } },
			},
			{
				displayName: 'Search Query',
				name: 'conversationSearchQuery',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappConversation'], operation: ['search'] } },
				description: 'Search by phone, name, status, or time',
			},
			{
				displayName: 'Message Search Query',
				name: 'messageSearchQuery',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappConversation'], operation: ['searchMessages'] } },
				description: 'Search message text',
			},
			{
				displayName: 'Status',
				name: 'conversationStatus',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Ended', value: 'ended' },
				],
				default: 'active',
				displayOptions: { show: { resource: ['whatsappConversation'], operation: ['setStatus'] } },
				description: 'The new status for the conversation',
			},

			// WhatsApp Contact Fields
			{
				displayName: 'Contact ID',
				name: 'contactId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappContact'], operation: ['getContext', 'addNote', 'update'] } },
			},
			{
				displayName: 'Search Query',
				name: 'contactSearchQuery',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappContact'], operation: ['search'] } },
				description: 'Search contacts by name or phone',
			},
			{
				displayName: 'Note',
				name: 'contactNote',
				type: 'string',
				typeOptions: { rows: 3 },
				required: true,
				default: '',
				displayOptions: { show: { resource: ['whatsappContact'], operation: ['addNote'] } },
				description: 'Note to add to the contact',
			},
			{
				displayName: 'Display Name',
				name: 'displayName',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappContact'], operation: ['update'] } },
				description: 'New display name for the contact',
			},
			{
				displayName: 'Customer ID',
				name: 'linkCustomerId',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['whatsappContact'], operation: ['update'] } },
				description: 'Customer ID to link to this contact',
			},

			// Customer Fields
			{
				displayName: 'Customer Name',
				name: 'customerName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['customer'], operation: ['create'] } },
				description: 'Name of the customer',
			},
			{
				displayName: 'External Customer ID',
				name: 'externalCustomerId',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['customer'], operation: ['create'] } },
				description: 'Your internal ID for this customer',
			},
			{
				displayName: 'Search Query',
				name: 'customerSearchQuery',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['customer'], operation: ['list'] } },
				description: 'Optional search query',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['customer'], operation: ['listConfigs'] } },
			},

			// Setup Link Fields
			{
				displayName: 'Customer ID',
				name: 'setupLinkCustomerId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['setupLink'] } },
			},
			{
				displayName: 'Setup Link ID',
				name: 'setupLinkId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['setupLink'], operation: ['revoke'] } },
				description: 'The setup link ID to revoke',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;
				const responseFormat = this.getNodeParameter('responseFormat', i, 'concise') as string;

				// Build MCP tool call
				let toolName = '';
				const toolArgs: Record<string, unknown> = { response_format: responseFormat };

				// ==================== WhatsApp Message ====================
				if (resource === 'whatsappMessage') {
					if (operation === 'sendText') {
						toolName = 'whatsapp_send_text_message';
						const conversationId = this.getNodeParameter('conversationId', i, '') as string;
						const phone = this.getNodeParameter('phone', i, '') as string;
						const body = this.getNodeParameter('body', i) as string;
						if (conversationId) toolArgs.conversation_id = conversationId;
						if (phone) toolArgs.phone = phone;
						toolArgs.body = body;
					}
					if (operation === 'sendTemplate') {
						toolName = 'whatsapp_send_template';
						const phone = this.getNodeParameter('phone', i, '') as string;
						const templateName = this.getNodeParameter('templateName', i) as string;
						const templateParams = this.getNodeParameter('templateParams', i, '{}') as string;
						if (phone) toolArgs.phone = phone;
						toolArgs.template_name = templateName;
						toolArgs.parameters = JSON.parse(templateParams);
					}
					if (operation === 'sendMedia') {
						toolName = 'whatsapp_send_media';
						const conversationId = this.getNodeParameter('conversationId', i, '') as string;
						const phone = this.getNodeParameter('phone', i, '') as string;
						const mediaType = this.getNodeParameter('mediaType', i) as string;
						const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
						const caption = this.getNodeParameter('caption', i, '') as string;
						if (conversationId) toolArgs.conversation_id = conversationId;
						if (phone) toolArgs.phone = phone;
						toolArgs.media_type = mediaType;
						toolArgs.url = mediaUrl;
						if (caption) toolArgs.caption = caption;
					}
					if (operation === 'sendInteractive') {
						toolName = 'whatsapp_send_interactive';
						const conversationId = this.getNodeParameter('conversationId', i, '') as string;
						const phone = this.getNodeParameter('phone', i, '') as string;
						const interactiveType = this.getNodeParameter('interactiveType', i) as string;
						const bodyText = this.getNodeParameter('bodyText', i) as string;
						const interactiveData = this.getNodeParameter('interactiveData', i) as string;
						if (conversationId) toolArgs.conversation_id = conversationId;
						if (phone) toolArgs.phone = phone;
						toolArgs.interactive_type = interactiveType;
						toolArgs.body_text = bodyText;
						toolArgs.interactive_data = JSON.parse(interactiveData);
					}
				}

				// ==================== WhatsApp Template ====================
				if (resource === 'whatsappTemplate') {
					if (operation === 'list') {
						toolName = 'whatsapp_templates';
						const searchQuery = this.getNodeParameter('searchQuery', i, '') as string;
						if (searchQuery) toolArgs.search = searchQuery;
					}
				}

				// ==================== WhatsApp Inbox ====================
				if (resource === 'whatsappInbox') {
					if (operation === 'view') {
						toolName = 'whatsapp_inbox';
						const hostNumberId = this.getNodeParameter('hostNumberId', i, '') as string;
						if (hostNumberId) toolArgs.host_number_id = hostNumberId;
					}
					if (operation === 'markRead') {
						toolName = 'whatsapp_mark_inbound_read';
						const messageIds = this.getNodeParameter('messageIds', i, '') as string;
						toolArgs.message_ids = messageIds.split(',').map((id: string) => id.trim());
					}
				}

				// ==================== WhatsApp Conversation ====================
				if (resource === 'whatsappConversation') {
					if (operation === 'getContext') {
						toolName = 'whatsapp_get_conversation_context';
						toolArgs.conversation_id = this.getNodeParameter('conversationIdGet', i) as string;
					}
					if (operation === 'search') {
						toolName = 'whatsapp_search_conversations';
						const searchQuery = this.getNodeParameter('conversationSearchQuery', i, '') as string;
						if (searchQuery) toolArgs.query = searchQuery;
					}
					if (operation === 'searchMessages') {
						toolName = 'whatsapp_search_messages';
						toolArgs.query = this.getNodeParameter('messageSearchQuery', i, '') as string;
					}
					if (operation === 'setStatus') {
						toolName = 'whatsapp_conversation_set_status';
						toolArgs.conversation_id = this.getNodeParameter('conversationIdGet', i) as string;
						toolArgs.status = this.getNodeParameter('conversationStatus', i) as string;
					}
				}

				// ==================== WhatsApp Contact ====================
				if (resource === 'whatsappContact') {
					if (operation === 'getContext') {
						toolName = 'whatsapp_get_contact_context';
						toolArgs.contact_id = this.getNodeParameter('contactId', i) as string;
					}
					if (operation === 'search') {
						toolName = 'whatsapp_search_contacts';
						const searchQuery = this.getNodeParameter('contactSearchQuery', i, '') as string;
						if (searchQuery) toolArgs.query = searchQuery;
					}
					if (operation === 'addNote') {
						toolName = 'whatsapp_contact_add_note';
						toolArgs.contact_id = this.getNodeParameter('contactId', i) as string;
						toolArgs.note = this.getNodeParameter('contactNote', i) as string;
					}
					if (operation === 'update') {
						toolName = 'whatsapp_contact_update';
						toolArgs.contact_id = this.getNodeParameter('contactId', i) as string;
						const displayName = this.getNodeParameter('displayName', i, '') as string;
						const linkCustomerId = this.getNodeParameter('linkCustomerId', i, '') as string;
						if (displayName) toolArgs.display_name = displayName;
						if (linkCustomerId) toolArgs.customer_id = linkCustomerId;
					}
				}

				// ==================== WhatsApp Config ====================
				if (resource === 'whatsappConfig') {
					if (operation === 'listOverview') {
						toolName = 'whatsapp_configs_overview';
					}
				}

				// ==================== Customer ====================
				if (resource === 'customer') {
					if (operation === 'create') {
						toolName = 'platform_create_customer';
						toolArgs.name = this.getNodeParameter('customerName', i) as string;
						const externalId = this.getNodeParameter('externalCustomerId', i, '') as string;
						if (externalId) toolArgs.external_customer_id = externalId;
					}
					if (operation === 'list') {
						toolName = 'platform_list_customers';
						const searchQuery = this.getNodeParameter('customerSearchQuery', i, '') as string;
						if (searchQuery) toolArgs.search = searchQuery;
					}
					if (operation === 'listConfigs') {
						toolName = 'platform_list_customer_configs';
						toolArgs.customer_id = this.getNodeParameter('customerId', i) as string;
					}
				}

				// ==================== Setup Link ====================
				if (resource === 'setupLink') {
					const customerId = this.getNodeParameter('setupLinkCustomerId', i) as string;
					toolArgs.customer_id = customerId;

					if (operation === 'generate') {
						toolName = 'platform_generate_setup_link';
					}
					if (operation === 'list') {
						toolName = 'platform_list_setup_links';
					}
					if (operation === 'revoke') {
						toolName = 'platform_revoke_setup_link';
						toolArgs.setup_link_id = this.getNodeParameter('setupLinkId', i) as string;
					}
				}

				// ==================== Project ====================
				if (resource === 'project') {
					if (operation === 'getInfo') {
						toolName = 'project_info';
					}
				}

				// Make MCP request
				responseData = await this.helpers.httpRequestWithAuthentication.call(
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
								name: toolName,
								arguments: toolArgs,
							},
						},
						json: true,
					},
				);

				// Extract result from MCP response
				if (responseData.result) {
					responseData = responseData.result;
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
