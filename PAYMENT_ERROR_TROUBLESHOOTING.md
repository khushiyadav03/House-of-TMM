# Payment Error Troubleshooting Guide

## Error: "Payment system error"

This error typically occurs when there's an issue with the Razorpay configuration or API call. Here's how to troubleshoot:

### 🔍 **Step 1: Check Environment Variables**

Make sure these environment variables are set in your `.env.local` file:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 🧪 **Step 2: Use the Debugger**

1. Go to `/test-razorpay`
2. Click on the "Debugger" tab
3. Click "Debug Payment System"
4. Check the results for any missing configuration

### 🔧 **Step 3: Common Issues & Solutions**

#### Issue 1: Missing Razorpay Keys
**Symptoms**: "Payment system not configured" error
**Solution**: 
- Get your keys from [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
- Add them to `.env.local`
- Restart your development server

#### Issue 2: Magazine Not Found
**Symptoms**: "Magazine not found" error
**Solution**:
- Ensure you have magazines in your database
- Check the magazine ID being used
- Verify the magazines table exists

#### Issue 3: Database Connection Issues
**Symptoms**: "Database error" messages
**Solution**:
- Check Supabase URL and service role key
- Verify the `magazine_purchases` table exists
- Check database permissions

#### Issue 4: Amount Mismatch
**Symptoms**: "Amount mismatch" error
**Solution**:
- Ensure the amount sent matches the magazine price
- Check that price is stored correctly in database
- Verify amount calculation (price * 100 for paise)

### 🏥 **Step 4: Quick Fixes**

#### Fix 1: Restart Development Server
```bash
npm run dev
# or
yarn dev
```

#### Fix 2: Clear Browser Cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Clear localStorage
- Open in incognito/private mode

#### Fix 3: Check Network Tab
- Open browser DevTools
- Go to Network tab
- Try the payment again
- Look for failed API calls

### 📋 **Step 5: Diagnostic Checklist**

Run through this checklist:

- [ ] Environment variables are set correctly
- [ ] Razorpay keys are valid (test mode for development)
- [ ] Database connection is working
- [ ] Magazine data exists in database
- [ ] Supabase service role key has proper permissions
- [ ] No console errors in browser
- [ ] API endpoints are accessible

### 🔍 **Step 6: Debug API Endpoints**

Test each endpoint individually:

1. **Configuration Test**: `GET /api/test-razorpay-config`
2. **Magazine Data**: `GET /api/magazines/1`
3. **Order Creation**: `POST /api/razorpay/order`
4. **Payment Verification**: `POST /api/razorpay/verify`

### 📞 **Step 7: Get Help**

If the issue persists:

1. Run the debugger and copy the results
2. Check browser console for errors
3. Check server logs for detailed error messages
4. Verify all environment variables are correctly set

### 🚀 **Common Solutions**

#### For "Payment system error":
```javascript
// Check if this returns the correct key
console.log('Razorpay Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
```

#### For "Magazine not found":
```sql
-- Check if magazines exist
SELECT * FROM magazines LIMIT 5;
```

#### For "Database error":
```sql
-- Check if table exists
SELECT * FROM magazine_purchases LIMIT 1;
```

### ✅ **Success Indicators**

You'll know it's working when:
- Debugger shows all green checkmarks
- Payment modal opens without errors
- Test payment completes successfully
- Database records are created properly

### 🔄 **Testing Flow**

1. Use the debugger first
2. Fix any red errors
3. Test with the payment modal
4. Verify database records
5. Test the complete user flow

Remember: Always use test credentials in development mode!