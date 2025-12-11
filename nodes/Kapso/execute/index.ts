import type {
	IExecuteFunctions,
	INodeExecutionData,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const MCP_BASE_URL = 'https://app.kapso.ai/mcp';

export async function execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];
	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;
			const responseFormat = this.getNodeParameter('responseFormat', i, 'concise') as string;

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
					const templateNameRaw = this.getNodeParameter('templateName', i) as { value: string } | string;
					const templateName = typeof templateNameRaw === 'string' ? templateNameRaw : templateNameRaw.value;
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
					const hostNumberIdRaw = this.getNodeParameter('hostNumberId', i, { value: '' }) as { value: string } | string;
					const hostNumberId = typeof hostNumberIdRaw === 'string' ? hostNumberIdRaw : hostNumberIdRaw.value;
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
					const customerIdRaw = this.getNodeParameter('customerId', i) as { value: string } | string;
					toolArgs.customer_id = typeof customerIdRaw === 'string' ? customerIdRaw : customerIdRaw.value;
				}
			}

			// ==================== Setup Link ====================
			if (resource === 'setupLink') {
				const customerIdRaw = this.getNodeParameter('setupLinkCustomerId', i) as { value: string } | string;
				const customerId = typeof customerIdRaw === 'string' ? customerIdRaw : customerIdRaw.value;
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
