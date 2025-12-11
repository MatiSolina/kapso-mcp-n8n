import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { createHmac } from 'crypto';

export class KapsoTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Kapso Trigger',
		name: 'kapsoTrigger',
		icon: { light: 'file:kapso.svg', dark: 'file:kapso.dark.svg' },
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["events"].join(", ")}}',
		description: 'Receive WhatsApp events from Kapso webhooks',
		defaults: {
			name: 'Kapso Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		usableAsTool: true,
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Events',
				name: 'events',
				type: 'multiOptions',
				options: [
					{
						name: 'Conversation Created',
						value: 'whatsapp.conversation.created',
						description: 'Triggered when a new conversation is created',
					},
					{
						name: 'Conversation Ended',
						value: 'whatsapp.conversation.ended',
						description: 'Triggered when a conversation is ended',
					},
					{
						name: 'Conversation Inactive',
						value: 'whatsapp.conversation.inactive',
						description: 'Triggered when a conversation has no activity for X minutes',
					},
					{
						name: 'Message Delivered',
						value: 'whatsapp.message.delivered',
						description: 'Triggered when a message is delivered to the recipient',
					},
					{
						name: 'Message Failed',
						value: 'whatsapp.message.failed',
						description: 'Triggered when a message fails to send',
					},
					{
						name: 'Message Read',
						value: 'whatsapp.message.read',
						description: 'Triggered when a message is read by the recipient',
					},
					{
						name: 'Message Received',
						value: 'whatsapp.message.received',
						description: 'Triggered when a new message is received from a customer',
					},
					{
						name: 'Message Sent',
						value: 'whatsapp.message.sent',
						description: 'Triggered when a message is sent to WhatsApp',
					},
				],
				default: ['whatsapp.message.received'],
				required: true,
				description: 'The events to listen to',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Verify Signature',
						name: 'verifySignature',
						type: 'boolean',
						default: false,
						description: 'Whether to verify the webhook signature using the secret key',
					},
					{
						displayName: 'Webhook Secret',
						name: 'webhookSecret',
						type: 'string',
						typeOptions: { password: true },
						default: '',
						displayOptions: {
							show: {
								verifySignature: [true],
							},
						},
						description: 'The secret key used to verify webhook signatures from Kapso',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as {
			event?: string;
			data?: Record<string, unknown>;
			message?: Record<string, unknown>;
			conversation?: Record<string, unknown>;
		};
		const headers = this.getHeaderData() as Record<string, string>;

		const events = this.getNodeParameter('events', []) as string[];
		const options = this.getNodeParameter('options', {}) as {
			verifySignature?: boolean;
			webhookSecret?: string;
		};

		// Get event type from header or body
		const eventType = headers['x-webhook-event'] || body.event;

		// Check if this event type is in our subscribed events
		if (eventType && events.length > 0 && !events.includes(eventType)) {
			// Event not subscribed, acknowledge but don't trigger workflow
			return {
				webhookResponse: { status: 200, body: { received: true, ignored: true } },
			};
		}

		// Verify signature if enabled
		if (options.verifySignature && options.webhookSecret) {
			const signature = headers['x-webhook-signature'];
			if (!signature) {
				return {
					webhookResponse: { status: 401, body: { error: 'Missing signature' } },
				};
			}

			const expectedSignature = createHmac('sha256', options.webhookSecret)
				.update(JSON.stringify(body))
				.digest('hex');

			if (signature !== expectedSignature) {
				return {
					webhookResponse: { status: 401, body: { error: 'Invalid signature' } },
				};
			}
		}

		// Build output data
		const outputData = {
			event: eventType,
			timestamp: new Date().toISOString(),
			idempotencyKey: headers['x-idempotency-key'],
			...body,
		};

		// Extract message content for convenience
		const message = body.message || body.data?.message;
		const conversation = body.conversation || body.data?.conversation;

		if (message) {
			outputData.message = message as Record<string, unknown>;
		}
		if (conversation) {
			outputData.conversation = conversation as Record<string, unknown>;
		}

		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
			webhookResponse: {
				status: 200,
				body: { received: true },
			},
		};
	}
}
