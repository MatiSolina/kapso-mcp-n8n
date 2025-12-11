# n8n-nodes-kapso

This is an n8n community node for [Kapso AI](https://kapso.ai) - a WhatsApp Cloud API integration platform.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
npm install n8n-nodes-kapso
```

## Nodes

This package includes two nodes:

### Kapso Node
The main node for interacting with Kapso's WhatsApp Cloud API - send messages, manage conversations, customers, and more.

### Kapso Trigger Node
A webhook trigger node that listens for incoming Kapso events like new messages, message status updates, and conversation events.

**Supported Events:**
- `whatsapp.message.received` - New incoming message
- `whatsapp.message.sent` - Message sent confirmation
- `whatsapp.message.delivered` - Message delivered
- `whatsapp.message.read` - Message read by recipient
- `whatsapp.message.failed` - Message failed to send
- `whatsapp.conversation.created` - New conversation started
- `whatsapp.conversation.ended` - Conversation ended
- `whatsapp.conversation.inactive` - Conversation became inactive

**Features:**
- Event filtering - select which events trigger the workflow
- Signature verification - optional HMAC SHA256 webhook signature validation

---

## Operations

This node provides **23 operations** matching the Kapso MCP server capabilities:

### WhatsApp Message (4 operations)

| Operation | Description |
|-----------|-------------|
| **Send Text** | Send text message to existing conversation |
| **Send Template** | Send template message with parameters (can start new conversations) |
| **Send Media** | Send image, video, audio, or document |
| **Send Interactive** | Send interactive message with buttons or lists |

### WhatsApp Template (1 operation)

| Operation | Description |
|-----------|-------------|
| **List Templates** | List/search approved templates with parameter details |

### WhatsApp Inbox (2 operations)

| Operation | Description |
|-----------|-------------|
| **View Inbox** | View inbox for a host number with last message preview and unread count |
| **Mark as Read** | Mark messages as read |

### WhatsApp Conversation (4 operations)

| Operation | Description |
|-----------|-------------|
| **Get Context** | Get conversation metadata and recent messages |
| **Search** | Search conversations by phone, name, status, or time |
| **Search Messages** | Search message text |
| **Set Status** | Update conversation status to active or ended |

### WhatsApp Contact (4 operations)

| Operation | Description |
|-----------|-------------|
| **Get Context** | Contact summary with last conversation and recent messages |
| **Search** | Search contacts by name or phone |
| **Add Note** | Add note to contact for triage and follow-ups |
| **Update** | Update contact display name or link to customer |

### WhatsApp Config (1 operation)

| Operation | Description |
|-----------|-------------|
| **List Overview** | List host numbers for selection |

### Customer (3 operations)

| Operation | Description |
|-----------|-------------|
| **Create** | Create new customer |
| **List** | List customers with search and pagination |
| **List Configs** | List WhatsApp configs for a customer |

### Setup Link (3 operations)

| Operation | Description |
|-----------|-------------|
| **Generate** | Generate branded setup link for customer WhatsApp connection |
| **List** | List setup links for a customer with status and expiry |
| **Revoke** | Revoke active setup link to invalidate onboarding link |

### Project (1 operation)

| Operation | Description |
|-----------|-------------|
| **Get Info** | Get current project ID and name |

## Credentials

To use this node, you need a Kapso API Key:

1. Go to [Kapso Dashboard](https://app.kapso.ai)
2. Navigate to Project Settings → API Keys
3. Create a new API Key
4. Use it in the n8n Kapso credentials

## Response Format

All operations support two response formats:

- **Concise** (default): Minimal response to reduce token usage
- **Detailed**: Full response with stable IDs for follow-up calls

## Usage Examples

### Send a Text Message

1. Add the Kapso node to your workflow
2. Select "WhatsApp Message" as the resource
3. Select "Send Text" as the operation
4. Enter conversation ID or phone number
5. Enter your message text

### Send a Template Message

1. Select "WhatsApp Message" > "Send Template"
2. Enter the recipient phone number
3. Enter the template name
4. Provide template parameters as JSON

### Search and Reply to Conversations

1. Use "WhatsApp Conversation" > "Search" to find conversations
2. Get the conversation ID from the response
3. Use "WhatsApp Message" > "Send Text" with the conversation ID

### Onboard a Customer

1. Use "Customer" > "Create" to create a new customer
2. Use "Setup Link" > "Generate" with the customer ID
3. Share the generated URL with your customer to connect their WhatsApp Business

## Resources

- [Kapso Documentation](https://docs.kapso.ai)
- [Kapso MCP Server Docs](https://docs.kapso.ai/docs/mcp/introduction)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Kapso GitHub](https://github.com/gokapso)

## License

[MIT](LICENSE)
