# Complete Razorpay Payment Integration Guide

This guide provides comprehensive instructions for implementing Razorpay payment integration based on the reference implementation from Sheryians.com.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Payment Flow Overview](#payment-flow-overview)
4. [Implementation Details](#implementation-details)
5. [Security Best Practices](#security-best-practices)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Accounts & Keys
- Razorpay account with API keys
- Supabase project with database access
- Next.js 13+ application

### Required Packages
```bash
npm install razorpay
npm install @supabase/supabase-js
npm install crypto
```

## Environment Setup

### Environment Variables
Create `.env.local` with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Database Schema
Ensure your database has the following tables:

```sql
-- Magazine purchases table
CREATE TABLE magazine_purchases (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    magazine_id INTEGER NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_status VARCHAR(20) DEFAULT 'pending',
    payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    purchase_date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Magazines table
CREATE TABLE magazines (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    cover_image_url TEXT,
    pdf_url TEXT,
    issue_date DATE,
    sales_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Payment Flow Overview

### Standard User Payment Flow
1. User selects magazine to purchase
2. User enters email address
3. Frontend calls `/api/razorpay/order` to create order
4. Backend creates Razorpay order and database record
5. Frontend opens Razorpay payment modal
6. User completes payment
7. Razorpay calls success handler
8. Frontend calls `/api/razorpay/verify` to verify payment
9. Backend verifies signature and updates database
10. User gets access to purchased content

### Guest User Payment Flow
1. Guest user selects magazine
2. Guest enters personal details (name, email, phone, password)
3. Frontend calls `/api/razorpay/guest-order`
4. Backend creates Razorpay order (no database record yet)
5. User completes payment
6. Frontend calls `/api/razorpay/guest-verify`
7. Backend verifies payment, creates user account, and purchase record

## Implementation Details

### Key Features Implemented

#### 1. Enhanced Payment Modal
- **Loading States**: Shows loading indicators during script loading and payment processing
- **Validation**: Email validation and form validation
- **Error Handling**: Comprehensive error messages and retry mechanisms
- **UI/UX**: Modern design with security indicators and payment features

#### 2. Robust API Endpoints

**Order Creation (`/api/razorpay/order/route.ts`)**
- Input validation (email format, amount limits)
- Magazine existence verification
- Price matching validation
- Comprehensive error handling
- Detailed logging

**Payment Verification (`/api/razorpay/verify/route.ts`)**
- Signature verification using HMAC-SHA256
- Purchase record validation
- Database transaction handling
- Sales count updates

**Guest Payment Support**
- Guest order creation without authentication
- Account creation after successful payment
- User data validation and sanitization

#### 3. Advanced Diagnostics
- Environment variable validation
- Script loading verification
- API endpoint testing
- Database connectivity checks
- End-to-end payment flow testing

### Security Features

#### 1. Payment Signature Verification
```javascript
const generated_signature = crypto
  .createHmac('sha256', secret)
  .update(`${razorpay_order_id}|${razorpay_payment_id}`)
  .digest('hex');

const isSignatureValid = generated_signature === razorpay_signature;
```

#### 2. Input Validation
- Email format validation
- Amount range validation
- Magazine existence verification
- User data sanitization

#### 3. Error Handling
- Graceful error recovery
- Detailed error logging
- User-friendly error messages
- Payment status tracking

## Testing Guide

### Test Credentials
Use Razorpay test credentials:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3-digit number
- **OTP**: 123456

### Testing Checklist

#### Environment Setup
- [ ] All environment variables configured
- [ ] Database tables created
- [ ] Razorpay script loading correctly

#### Payment Flow
- [ ] Order creation works
- [ ] Payment modal opens
- [ ] Payment completion works
- [ ] Payment verification works
- [ ] Database updates correctly

#### Error Scenarios
- [ ] Invalid email handling
- [ ] Network error handling
- [ ] Payment failure handling
- [ ] Signature verification failure

#### Guest Flow
- [ ] Guest order creation
- [ ] Account creation after payment
- [ ] Email validation
- [ ] Password requirements

### Using the Diagnostic Tool
Run the payment diagnostic component to automatically test:
```javascript
// Access via /admin/test-payments or integrate into your admin panel
<PaymentDiagnostic />
```

## Security Best Practices

### 1. Environment Variables
- Never expose secret keys in frontend code
- Use different keys for development and production
- Regularly rotate API keys

### 2. Payment Verification
- Always verify payment signatures on the server
- Never trust payment data from the frontend
- Log all payment attempts for audit

### 3. User Data Protection
- Validate all user inputs
- Sanitize data before database storage
- Use HTTPS for all payment-related requests

### 4. Error Handling
- Don't expose sensitive error details to users
- Log detailed errors for debugging
- Implement proper retry mechanisms

## Troubleshooting

### Common Issues

#### 1. Razorpay Script Not Loading
**Symptoms**: Payment modal doesn't open
**Solutions**:
- Check network connectivity
- Verify CSP headers allow Razorpay domain
- Ensure script loading timeout is sufficient

#### 2. Payment Verification Fails
**Symptoms**: Payment completes but verification fails
**Solutions**:
- Verify Razorpay secret key is correct
- Check signature generation algorithm
- Ensure order ID matches exactly

#### 3. Database Connection Issues
**Symptoms**: Order creation fails
**Solutions**:
- Verify Supabase credentials
- Check database table structure
- Ensure service role key has proper permissions

#### 4. Guest Account Creation Fails
**Symptoms**: Payment succeeds but account not created
**Solutions**:
- Check Supabase admin API permissions
- Verify email uniqueness constraints
- Review user metadata structure

### Debug Tools

#### 1. Payment Diagnostic Component
Use the enhanced diagnostic tool to test all payment components:
- Environment variables
- Script loading
- API endpoints
- Database connectivity

#### 2. Browser Developer Tools
- Check Network tab for API call failures
- Monitor Console for JavaScript errors
- Verify payment data in request/response

#### 3. Server Logs
- Monitor API route logs
- Check Razorpay webhook logs
- Review database query logs

## Production Deployment

### Pre-deployment Checklist
- [ ] Switch to live Razorpay keys
- [ ] Update webhook URLs
- [ ] Test with real payment methods
- [ ] Verify SSL certificate
- [ ] Enable production logging
- [ ] Set up monitoring alerts

### Monitoring
- Track payment success rates
- Monitor API response times
- Set up alerts for payment failures
- Regular security audits

## Support and Resources

### Razorpay Resources
- [Official Documentation](https://razorpay.com/docs/)
- [API Reference](https://razorpay.com/docs/api/)
- [Test Cards](https://razorpay.com/docs/payments/payments/test-card-details/)

### Implementation Support
- Check diagnostic tool results
- Review server logs
- Test with provided test components
- Verify against reference implementation

---

This implementation provides a production-ready Razorpay integration with comprehensive error handling, security features, and testing tools based on proven patterns from successful implementations.