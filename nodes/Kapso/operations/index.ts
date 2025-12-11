import type { INodeProperties } from 'n8n-workflow';

export const resourceOptions: INodeProperties = {
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
};

export const whatsappMessageOperations: INodeProperties = {
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
};

export const whatsappTemplateOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['whatsappTemplate'] } },
	options: [
		{ name: 'Get Many', value: 'list', description: 'List or search approved templates with parameter details', action: 'Get many templates' },
	],
	default: 'list',
};

export const whatsappInboxOperations: INodeProperties = {
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
};

export const whatsappConversationOperations: INodeProperties = {
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
};

export const whatsappContactOperations: INodeProperties = {
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
};

export const whatsappConfigOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['whatsappConfig'] } },
	options: [
		{ name: 'Get Many', value: 'listOverview', description: 'List host numbers for selection', action: 'Get many whats app configs' },
	],
	default: 'listOverview',
};

export const customerOperations: INodeProperties = {
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
};

export const setupLinkOperations: INodeProperties = {
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
};

export const projectOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['project'] } },
	options: [
		{ name: 'Get', value: 'getInfo', description: 'Get current project ID and name', action: 'Get project info' },
	],
	default: 'getInfo',
};

export const allOperations: INodeProperties[] = [
	resourceOptions,
	whatsappMessageOperations,
	whatsappTemplateOperations,
	whatsappInboxOperations,
	whatsappConversationOperations,
	whatsappContactOperations,
	whatsappConfigOperations,
	customerOperations,
	setupLinkOperations,
	projectOperations,
];
