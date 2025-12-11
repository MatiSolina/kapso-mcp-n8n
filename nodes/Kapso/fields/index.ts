import type { INodeProperties } from 'n8n-workflow';

export const responseFormatField: INodeProperties = {
	displayName: 'Response Format',
	name: 'responseFormat',
	type: 'options',
	options: [
		{ name: 'Concise', value: 'concise' },
		{ name: 'Detailed', value: 'detailed' },
	],
	default: 'concise',
	description: 'Whether to return a simplified version of the response instead of the raw data',
};

export const whatsappMessageFields: INodeProperties[] = [
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
	{
		displayName: 'Template Name',
		name: 'templateName',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendTemplate'] } },
		description: 'Name of the approved template to send',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a template...',
				typeOptions: {
					searchListMethod: 'searchTemplates',
					searchable: true,
				},
			},
			{
				displayName: 'By Name',
				name: 'name',
				type: 'string',
				placeholder: 'e.g. order_confirmation',
			},
		],
	},
	{
		displayName: 'Template Parameters (JSON)',
		name: 'templateParams',
		type: 'json',
		default: '{}',
		displayOptions: { show: { resource: ['whatsappMessage'], operation: ['sendTemplate'] } },
		description: 'Template parameters as JSON object',
	},
	{
		displayName: 'Media Type',
		name: 'mediaType',
		type: 'options',
		options: [
			{ name: 'Audio', value: 'audio' },
			{ name: 'Document', value: 'document' },
			{ name: 'Image', value: 'image' },
			{ name: 'Video', value: 'video' },
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
];

export const whatsappTemplateFields: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'searchQuery',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['whatsappTemplate'], operation: ['list'] } },
		description: 'Optional search query to filter templates',
	},
];

export const whatsappInboxFields: INodeProperties[] = [
	{
		displayName: 'Host Number',
		name: 'hostNumberId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		displayOptions: { show: { resource: ['whatsappInbox'], operation: ['view'] } },
		description: 'The WhatsApp host number to view inbox for',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a host number...',
				typeOptions: {
					searchListMethod: 'searchWhatsAppConfigs',
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. 123456789012345',
			},
		],
	},
	{
		displayName: 'Message IDs',
		name: 'messageIds',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['whatsappInbox'], operation: ['markRead'] } },
		description: 'Comma-separated message IDs to mark as read',
	},
];

export const whatsappConversationFields: INodeProperties[] = [
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
];

export const whatsappContactFields: INodeProperties[] = [
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
		displayName: 'Link Customer ID',
		name: 'linkCustomerId',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['whatsappContact'], operation: ['update'] } },
		description: 'Customer ID to link to this contact',
	},
];

export const customerFields: INodeProperties[] = [
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
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: { resource: ['customer'], operation: ['listConfigs'] } },
		description: 'The customer to get configs for',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a customer...',
				typeOptions: {
					searchListMethod: 'searchCustomers',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. cust_abc123',
			},
		],
	},
];

export const setupLinkFields: INodeProperties[] = [
	{
		displayName: 'Customer ID',
		name: 'setupLinkCustomerId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: { show: { resource: ['setupLink'] } },
		description: 'The customer to create/manage setup links for',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a customer...',
				typeOptions: {
					searchListMethod: 'searchCustomers',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. cust_abc123',
			},
		],
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
];

export const allFields: INodeProperties[] = [
	responseFormatField,
	...whatsappMessageFields,
	...whatsappTemplateFields,
	...whatsappInboxFields,
	...whatsappConversationFields,
	...whatsappContactFields,
	...customerFields,
	...setupLinkFields,
];
