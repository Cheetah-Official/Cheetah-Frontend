# Payment Redirect Fix - URGENT

## ⚠️ CRITICAL ISSUE
After completing Flutterwave payment, users are being redirected to the backend callback URL:
```
https://official-backend-cheetah-production-0cb4.up.railway.app/cheetah/api/v1/flutterwave/callback?status=completed&tx_ref=BOOKING-17-1767823994130&transaction_id=9918237
```

**This causes an error: "Missing or invalid Authorization header"** because the backend callback endpoint requires authentication. **Users cannot complete their payment flow and are stuck on an error page.**

## Impact
- ❌ Users cannot see payment confirmation
- ❌ Users cannot access their booking details
- ❌ Poor user experience
- ❌ Payment flow is broken

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

**File:** `src/payment/payment.controller.ts` (or wherever the Flutterwave callback is handled)

```typescript
import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
// DO NOT import AuthGuard or UseGuards for this endpoint!

@Controller('api/v1/flutterwave')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('callback')
  // ⚠️ CRITICAL: NO @UseGuards(AuthGuard('jwt')) - This endpoint MUST be public!
  // Flutterwave calls this directly, so authentication is not possible
  async handleCallback(
    @Query('status') status: string,
    @Query('tx_ref') txRef: string,
    @Query('transaction_id') transactionId: string,
    @Res() res: Response
  ) {
    try {
      // 1. Process the callback (verify payment, update booking status, etc.)
      await this.paymentService.verifyAndUpdatePayment(txRef, transactionId, status);
      
      // 2. Redirect to frontend confirmation page
      const frontendUrl = process.env.FRONTEND_URL || 'https://cheetah-frontend-eta.vercel.app';
      const redirectUrl = `${frontendUrl}/payment/confirm?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`;
      
      // 3. Use HTTP 302 redirect (Found) - this tells the browser to go to the new URL
      return res.redirect(302, redirectUrl);
    } catch (error) {
      // Even on error, redirect to frontend so user sees an error message
      const frontendUrl = process.env.FRONTEND_URL || 'https://cheetah-frontend-eta.vercel.app';
      const redirectUrl = `${frontendUrl}/payment/confirm?status=failed&tx_ref=${txRef}&transaction_id=${transactionId}`;
      return res.redirect(302, redirectUrl);
    }
  }
}
```

### Key Points:
1. **Remove ALL authentication guards** from the callback endpoint
2. **Use `@Res() res: Response`** from Express to get the response object
3. **Call `res.redirect(302, url)`** to redirect the browser
4. **Do NOT return JSON** - the browser needs an HTTP redirect
5. **Always redirect**, even on errors (so user sees a message, not a blank page)

### Environment Variable
Add to backend `.env`:
```
FRONTEND_URL=https://cheetah-frontend-eta.vercel.app
```

For local development:
```
FRONTEND_URL=http://localhost:3000
```

### ⭐ RECOMMENDED SOLUTION: Configure Flutterwave Redirect URL Directly

**This is the BEST and EASIEST solution!** When creating the Flutterwave payment link, set the `redirect_url` parameter to point **directly to the frontend**, not the backend:

```typescript
// When creating booking and initializing Flutterwave payment
const paymentData = {
  tx_ref: bookingReference, // e.g., "BOOKING-18-1767824760351"
  amount: bookingAmount,
  currency: 'NGN',
  payment_options: 'card',
  customer: {
    email: userEmail,
    name: userName,
  },
  // ⚠️ CRITICAL: Redirect user to FRONTEND, not backend
  redirect_url: `${process.env.FRONTEND_URL}/payment/confirm`,
  // Backend should handle payment verification via webhook (separate endpoint)
  // webhook_url: `${process.env.BACKEND_URL}/api/v1/flutterwave/webhook`
};

// Initialize Flutterwave payment
const response = await flutterwaveService.initializePayment(paymentData);
```

**How this works:**
1. User completes payment on Flutterwave checkout page
2. Flutterwave redirects user **directly to frontend**: `https://cheetah-frontend-eta.vercel.app/payment/confirm?status=completed&tx_ref=BOOKING-18-1767824760351&transaction_id=9918247`
3. Frontend payment confirmation page displays the payment status
4. Backend processes payment verification via **webhook** (server-to-server, separate from user redirect)

**Benefits:**
- ✅ No backend callback endpoint changes needed
- ✅ User sees confirmation page immediately
- ✅ Better user experience
- ✅ Payment verification happens via webhook (more secure)

## Frontend Implementation

The frontend payment confirmation page (`/payment/confirm`) is already set up to:
- Accept `status`, `tx_ref`, and `transaction_id` query parameters
- Display payment status
- Fetch payment details using the transaction reference
- Provide navigation to dashboard

## Temporary Frontend Workaround (If Backend Can't Be Fixed Immediately)

If the backend cannot be fixed immediately, you can create a simple HTML redirect page that extracts parameters from the backend URL and redirects to the frontend. However, **this is NOT recommended** as it requires the backend to serve an HTML page instead of returning an error.

### Option 1: Backend Returns HTML Redirect Page (Temporary Fix)

The backend callback endpoint could return an HTML page that extracts the URL parameters and redirects:

```typescript
@Get('callback')
async handleCallback(
  @Query('status') status: string,
  @Query('tx_ref') txRef: string,
  @Query('transaction_id') transactionId: string,
  @Res() res: Response
) {
  // Process payment (verify, update booking, etc.)
  await this.paymentService.verifyAndUpdatePayment(txRef, transactionId, status);
  
  // Return HTML page that redirects to frontend
  const frontendUrl = process.env.FRONTEND_URL || 'https://cheetah-frontend-eta.vercel.app';
  const redirectUrl = `${frontendUrl}/payment/confirm?status=${status}&tx_ref=${txRef}&transaction_id=${transactionId}`;
  
  res.setHeader('Content-Type', 'text/html');
  return res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        <script>window.location.href = "${redirectUrl}";</script>
      </head>
      <body>
        <p>Redirecting to payment confirmation...</p>
        <p>If you are not redirected, <a href="${redirectUrl}">click here</a>.</p>
      </body>
    </html>
  `);
}
```

### Option 2: Configure Flutterwave Redirect URL Directly (BEST SOLUTION)

**The best solution is to configure Flutterwave to redirect directly to the frontend** when creating the payment link:

```typescript
// When creating the Flutterwave payment link
const paymentData = {
  tx_ref: bookingReference,
  amount: amount,
  currency: 'NGN',
  payment_options: 'card',
  customer: {
    email: userEmail,
  },
  // ⚠️ IMPORTANT: Set redirect_url to frontend, NOT backend
  redirect_url: `${process.env.FRONTEND_URL}/payment/confirm`,
  // Backend callback should be handled via webhook, not redirect
  // webhook_url: `${process.env.BACKEND_URL}/api/v1/flutterwave/webhook`
};
```

This way:
- User completes payment on Flutterwave
- Flutterwave redirects user directly to frontend: `https://cheetah-frontend-eta.vercel.app/payment/confirm?status=completed&tx_ref=...&transaction_id=...`
- Backend processes payment via webhook (separate from user redirect)

## Testing

After the backend fix:
1. Complete a payment on Flutterwave
2. User should be redirected to: `https://cheetah-frontend-eta.vercel.app/payment/confirm?status=completed&tx_ref=...&transaction_id=...`
3. Payment confirmation page should display successfully

