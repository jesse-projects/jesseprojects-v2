# Contact Form → N8N → Notion Integration

## Architecture

```
Browser Form POST → /api/contact → Nginx proxy → N8N Webhook → Notion "Inbound Inquiries" DB
                                                              → Email notification (optional)
```

## Setup Steps

### 1. Create Notion Database

Create a database called **"Inbound Inquiries"** in your JesseProjects workspace with these properties:

| Property | Type | Notes |
|----------|------|-------|
| Name | Title | Contact's name |
| Email | Email | Contact's email |
| Subject | Rich text | Form subject line |
| Message | Rich text | Full message |
| Source | Select | Options: website, email, referral, linkedin |
| Status | Select | Options: New, Replied, Qualified, Archived |
| Submitted | Date | Timestamp from form |
| Notes | Rich text | Internal notes |

### 2. Create N8N Webhook Workflow

In N8N (https://n8n.jesseprojects.com):

1. **Add Webhook node** (trigger)
   - Method: POST
   - Path: `/contact-form`
   - Response Mode: "Respond to Webhook"
   - Response Code: 200
   - Response Data: `{"success": true}`
   - Authentication: None (rate limiting via Nginx)

2. **Add Notion node** (Create Database Item)
   - Credential: Use Notion integration token from Vault
   - Database ID: (ID of "Inbound Inquiries" database)
   - Properties:
     - Name: `{{ $json.name }}`
     - Email: `{{ $json.email }}`
     - Subject: `{{ $json.subject || 'Website Contact Form' }}`
     - Message: `{{ $json.message }}`
     - Source: "website"
     - Submitted: `{{ $json.timestamp }}`
     - Status: "New"

3. **Add Send Email node** (optional notification)
   - To: jesse@jesseprojects.com
   - Subject: `New inquiry from {{ $json.name }}`
   - Body: Include name, email, subject, message
   - Use Brevo SMTP or N8N's built-in email

4. **Activate the workflow**

### 3. Update Nginx Config

Add this location block to `nginx.conf` to proxy `/api/contact` to N8N:

```nginx
location /api/contact {
    proxy_pass https://n8n.jesseprojects.com/webhook/contact-form;
    proxy_set_header Content-Type application/json;
    proxy_set_header X-Forwarded-For $remote_addr;

    # Rate limiting
    limit_req zone=contact burst=3 nodelay;
}
```

Add rate limiting zone in the http block:
```nginx
limit_req_zone $binary_remote_addr zone=contact:10m rate=2r/m;
```

### 4. Alternative: Direct N8N Webhook URL

If you don't want to proxy through Nginx, update the `CONTACT_API` constant in `src/sections/About.jsx`:

```javascript
const CONTACT_API = 'https://n8n.jesseprojects.com/webhook/contact-form'
```

Note: This exposes the N8N webhook URL in frontend code, which is fine since webhooks are meant to be public endpoints.

## Testing

1. Fill out the form on the site
2. Check N8N execution history for the webhook trigger
3. Check Notion "Inbound Inquiries" database for the new entry
4. Check email for notification (if configured)

## Notion Integration Token

Stored in RALPH Vault at `secret/ralph/notion` (field: `token`).
