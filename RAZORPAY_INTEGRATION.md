# Razorpay Integration Guide

This document provides instructions on how to integrate Razorpay payment gateway with the TMM India website.

## Prerequisites

1. A Razorpay account (create one at [https://razorpay.com](https://razorpay.com) if you don't have one)
2. API keys from your Razorpay dashboard

## Setup Steps

### 1. Install Razorpay Package

The Razorpay Node.js SDK is required for server-side integration:

```bash
npm install razorpay
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (use the provided `.env.local.example` as a template) and add your Razorpay API keys:

```
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
```

You can find these keys in your Razorpay Dashboard under Settings > API Keys.

### 3. Understanding the Integration Flow

The Razorpay integration follows this flow:

1. User selects a magazine to purchase
2. Frontend calls `/api/razorpay/order` to create a payment order
3. Backend creates an order in Razorpay and stores a pending purchase record
4. Frontend displays the Razorpay payment modal
5. User completes payment in the Razorpay modal
6. Razorpay redirects back with payment details
7. Frontend calls `/api/razorpay/verify` to verify the payment
8. Backend verifies the signature and updates the purchase record

### 4. Key Components

#### Backend API Routes

- **`/api/razorpay/order/route.ts`**: Creates a Razorpay order and records a pending purchase
- **`/api/razorpay/verify/route.ts`**: Verifies the payment signature and updates the purchase status

#### Frontend Components

- **`components/RazorpayPaymentModal.tsx`**: Displays the payment form and initializes the Razorpay checkout

### 5. Testing the Integration

Razorpay provides test credentials for development:

- Test Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3-digit number
- OTP: 1234

### 6. Going Live

Before going live:

1. Complete the Razorpay KYC process
2. Test thoroughly with test credentials
3. Switch to live API keys in your production environment
4. Update webhook URLs if you're using webhooks

### 7. Troubleshooting

- Check browser console for JavaScript errors
- Verify that environment variables are correctly set
- Ensure the Razorpay script is loading properly
- Check server logs for API errors

## Additional Resources

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay API Reference](https://razorpay.com/docs/api/)
- [Razorpay Testing Guide](https://razorpay.com/docs/payments/payments/test-card-details/)