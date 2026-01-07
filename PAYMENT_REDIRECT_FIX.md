# Payment Redirect Fix

## Issue
After completing Flutterwave payment, users are being redirected to the backend callback URL:
```
https://official-backend-cheetah-production-0cb4.up.railway.app/cheetah/api/v1/flutterwave/callback?status=completed&tx_ref=BOOKING-15-1767821964788&transaction_id=9918199
```

This causes an error: "Missing or invalid Authorization header" because the backend callback endpoint requires authentication.

## Solution

The backend Flutterwave callback endpoint (`/api/v1/flutterwave/callback`) needs two changes:

### 1. Make the endpoint PUBLIC (No Auth Required)
Since Flutterwave calls this endpoint directly, it cannot have authentication. Remove the `@UseGuards(AuthGuard('jwt'))` decorator.

### 2. Redirect to Frontend After Processing
After processing the callback, redirect the user to the frontend payment confirmation page.

### Backend Fix Required

The callback endpoint should:
1. **Be public** - Remove auth guard since Flutterwave calls it
2. **Process payment** - Verify transaction, update booking status
3. **Redirect to frontend** - Use HTTP redirect (302/301) to send user to frontend

### Example Backend Implementation (NestJS)

```typescript
@Get('callback')
// NO @UseGuards(AuthGuard('jwt')) - This endpoint must be public!
async handleCallback(
  @Query('status') status: string,
  @Query('tx_ref') txRef: string,
  @Query('transaction_id') transactionId: string,
  @Res() res: Response
) {
  try {
    // Process the callback (verify payment, update booking, etc.)
    await this.paymentService.verifyAndUpdatePayment(txRef, transactionId, status);
    
    // Redirect to frontend confirmation page
    const frontendUrl = process.env.FRONTEND_URL || 'https://cheetah-frontend-eta.vercel.app';
    const redirectUrl = `${frontendUrl}/payment/confirm?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`;
    
    // Use HTTP redirect (302 Found)
    return res.redirect(302, redirectUrl);
  } catch (error) {
    // Even on error, redirect to frontend with error status
    const frontendUrl = process.env.FRONTEND_URL || 'https://cheetah-frontend-eta.vercel.app';
    const redirectUrl = `${frontendUrl}/payment/confirm?status=failed&tx_ref=${txRef}&transaction_id=${transactionId}`;
    return res.redirect(302, redirectUrl);
  }
}
```

### Environment Variable
Add to backend `.env`:
```
FRONTEND_URL=https://cheetah-frontend-eta.vercel.app
```

For local development:
```
FRONTEND_URL=http://localhost:3000
```

### Alternative: Configure Flutterwave Redirect URL

When creating the Flutterwave payment link, set the `redirect_url` parameter to point directly to the frontend:

```typescript
const paymentData = {
  // ... other payment data
  redirect_url: `${process.env.FRONTEND_URL}/payment/confirm`
};
```

## Frontend Implementation

The frontend payment confirmation page (`/payment/confirm`) is already set up to:
- Accept `status`, `tx_ref`, and `transaction_id` query parameters
- Display payment status
- Fetch payment details using the transaction reference
- Provide navigation to dashboard

## Testing

After the backend fix:
1. Complete a payment on Flutterwave
2. User should be redirected to: `https://cheetah-frontend-eta.vercel.app/payment/confirm?status=completed&tx_ref=...&transaction_id=...`
3. Payment confirmation page should display successfully

