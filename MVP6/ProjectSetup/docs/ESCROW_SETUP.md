# Escrow Adapter Setup Guide

The Procuredex platform integrates with third-party escrow service providers to handle secure payment processing for tenders. This guide explains how to configure and use the escrow adapter.

## Overview

The escrow adapter provides a standardized interface to work with multiple escrow service providers. It handles:

- **Escrow Creation**: Setting up secure payment holds for awarded tenders
- **Payment Release**: Releasing funds upon milestone completion
- **Dispute Resolution**: Managing payment disputes between entities and providers
- **Webhook Processing**: Handling real-time updates from escrow providers
- **Audit Trail**: Maintaining comprehensive logs of all escrow activities

## Supported Providers

### Generic Provider
A flexible implementation that can work with most REST API-based escrow services.

### Mock Provider
For development and testing purposes.

## Environment Configuration

Add these environment variables to your `.env.local` file:

```bash
# Escrow Provider Configuration
ESCROW_PROVIDER_NAME="Your Escrow Provider Name"
ESCROW_PROVIDER_API_URL="https://api.escrowprovider.com"
ESCROW_PROVIDER_API_KEY="your_api_key_here"
ESCROW_PROVIDER_WEBHOOK_SECRET="your_webhook_secret_here"

# Supported currencies (comma-separated)
ESCROW_PROVIDER_CURRENCIES="BWP,USD,EUR,GBP"

# Feature flags
ESCROW_PROVIDER_MILESTONES=true
ESCROW_PROVIDER_DISPUTES=true
ESCROW_PROVIDER_MULTICURRENCY=true
ESCROW_PROVIDER_INSTANT=true
ESCROW_PROVIDER_SCHEDULED=true
ESCROW_PROVIDER_PARTIAL=true

# Preview mode (set to true for development)
NEXT_PUBLIC_PREVIEW_MODE=false
```

## Provider Integration

### 1. API Endpoints

Your escrow provider should support these endpoints:

```
POST /escrow/create          - Create new escrow
POST /escrow/{id}/release    - Release payment
POST /escrow/{id}/hold       - Hold funds for milestone
POST /escrow/{id}/refund     - Refund payment
POST /escrow/{id}/dispute    - Initiate dispute
POST /escrow/{id}/resolve    - Resolve dispute
GET  /escrow/{id}            - Get escrow details
```

### 2. Webhook Configuration

Configure your escrow provider to send webhooks to:
```
https://your-domain.com/api/escrow/webhook
```

Required headers:
- `x-escrow-signature`: HMAC signature for validation
- `x-escrow-provider`: Provider ID (optional)

Supported webhook events:
- `escrow.created` - Escrow successfully created
- `escrow.funded` - Funds deposited into escrow
- `escrow.released` - Payment released to recipient
- `escrow.refunded` - Payment refunded to sender
- `escrow.disputed` - Dispute initiated
- `escrow.resolved` - Dispute resolved
- `escrow.expired` - Escrow expired

### 3. Authentication

The adapter supports Bearer token authentication. Include your API key in the `Authorization` header:
```
Authorization: Bearer your_api_key_here
```

## Usage Examples

### Creating an Escrow

```typescript
import { escrowAdapter } from '@/lib/escrow-adapter'

// Create escrow for a tender
const escrowId = await escrowAdapter.createEscrow(
  'TND-001',    // Tender ID
  1000000,      // Amount in BWP
  'BWP'         // Currency
)

console.log('Escrow created:', escrowId)
```

### Releasing Payment

```typescript
// Release payment after milestone completion
const success = await escrowAdapter.releasePayment('ESC-123-TND001')

if (success) {
  console.log('Payment released successfully')
}
```

### Handling Disputes

```typescript
// Initiate dispute
await escrowAdapter.disputeEscrow('ESC-123-TND001', 'DIS-001')

// Resolve dispute
await escrowAdapter.resolveDispute('ESC-123-TND001', 'Payment released to provider')
```

## API Integration

### Create Escrow via API

```bash
curl -X POST /api/escrow/operations \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "create",
    "tenderId": "TND-001",
    "amount": 1000000,
    "currency": "BWP"
  }'
```

### Release Payment via API

```bash
curl -X POST /api/escrow/operations \
  -H "Content-Type: application/json" \
  -d '{
    "operation": "release",
    "escrowRef": "ESC-123-TND001"
  }'
```

### Get Escrow Details

```bash
curl "/api/escrow/operations?operation=details&escrowRef=ESC-123-TND001"
```

## Security Considerations

1. **API Keys**: Store API keys securely in environment variables
2. **Webhook Signatures**: Always validate webhook signatures
3. **HTTPS**: Use HTTPS for all API communications
4. **Rate Limiting**: Implement rate limiting for API calls
5. **Audit Logging**: Maintain comprehensive audit logs

## Error Handling

The adapter provides comprehensive error handling:

```typescript
try {
  const escrowId = await escrowAdapter.createEscrow('TND-001', 1000000)
} catch (error) {
  if (error.message.includes('provider not available')) {
    // Handle provider unavailability
  } else if (error.message.includes('insufficient funds')) {
    // Handle insufficient funds
  } else {
    // Handle other errors
  }
}
```

## Testing

### Preview Mode

Set `NEXT_PUBLIC_PREVIEW_MODE=true` to use the mock provider for testing:

```typescript
// Mock provider automatically used in preview mode
const escrowId = await escrowAdapter.createEscrow('TND-001', 1000000)
// Returns: ESC-1634567890-TND001
```

### Webhook Testing

Use tools like ngrok to test webhooks locally:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3000

# Use the ngrok URL for webhook configuration
# https://abc123.ngrok.io/api/escrow/webhook
```

## Monitoring

### Health Checks

Check if the escrow adapter is ready:

```typescript
if (escrowAdapter.isReady()) {
  console.log('Escrow adapter is ready')
  console.log('Available providers:', escrowAdapter.getAvailableProviders())
}
```

### Provider Features

Check what features a provider supports:

```typescript
const features = escrowAdapter.getProviderFeatures()
console.log('Milestone payments:', features?.milestonePayments)
console.log('Dispute resolution:', features?.disputeResolution)
```

## Troubleshooting

### Common Issues

1. **Provider Not Available**
   - Check API URL and credentials
   - Verify network connectivity
   - Check provider status page

2. **Webhook Signature Validation Failed**
   - Verify webhook secret is correct
   - Check signature algorithm matches provider
   - Ensure payload is not modified

3. **Escrow Creation Failed**
   - Verify all required fields are provided
   - Check currency is supported
   - Ensure amount is within limits

### Debug Mode

Enable debug logging:

```bash
DEBUG=escrow:* npm run dev
```

## Support

For escrow adapter support:

1. Check the logs for detailed error messages
2. Verify provider configuration
3. Test with mock provider first
4. Contact your escrow provider's support team
5. Review the audit trail for transaction history

## Provider-Specific Guides

### Escrow.com Integration

```bash
ESCROW_PROVIDER_NAME="Escrow.com"
ESCROW_PROVIDER_API_URL="https://api.escrow.com/2017-09-01"
ESCROW_PROVIDER_API_KEY="your_escrow_com_api_key"
ESCROW_PROVIDER_WEBHOOK_SECRET="your_webhook_secret"
```

### PayPal Escrow Integration

```bash
ESCROW_PROVIDER_NAME="PayPal"
ESCROW_PROVIDER_API_URL="https://api.paypal.com/v1/payments/escrow"
ESCROW_PROVIDER_API_KEY="your_paypal_client_id:your_paypal_secret"
ESCROW_PROVIDER_WEBHOOK_SECRET="your_webhook_secret"
```

### Custom Provider

To integrate a custom escrow provider, extend the `BaseEscrowProvider` class:

```typescript
import { BaseEscrowProvider, CreateEscrowRequest, EscrowResponse } from '@/lib/escrow-adapter'

export class CustomEscrowProvider extends BaseEscrowProvider {
  async createEscrow(request: CreateEscrowRequest): Promise<EscrowResponse> {
    // Implement your custom logic here
    const response = await this.makeRequest('/custom/endpoint', 'POST', request)
    
    return {
      success: true,
      escrowId: response.id,
      providerReference: response.ref,
      status: response.status,
      fees: response.fees,
      estimatedCompletionDate: new Date(response.completion_date)
    }
  }
  
  // Implement other required methods...
}
```

Then register it in the adapter service:

```typescript
// In escrow-adapter.ts
const customProvider = new CustomEscrowProvider(config)
this.providers.set('custom', customProvider)
```
