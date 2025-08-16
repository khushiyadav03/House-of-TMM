# Environment Setup Guide - Fix Payment Errors

## 🚨 **Quick Fix for "Payment system error"**

The most common cause is missing environment variables. Follow these steps:

### Step 1: Create Environment File

Create a `.env.local` file in your project root:

```bash
# Copy the example file
cp .env.local.example .env.local
```

### Step 2: Add Required Variables

Add these variables to your `.env.local` file:

```env
# Razorpay Configuration (REQUIRED)
RAZORPAY_KEY_ID=rzp_test_your_key_id_here
RAZORPAY_KEY_SECRET=your_razorpay_secret_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 3: Get Your Keys

#### Razorpay Keys:
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/app/keys)
2. Sign up/Login to your account
3. Go to Settings → API Keys
4. Generate Test Keys (for development)
5. Copy both Key ID and Key Secret

#### Supabase Keys:
1. Go to [Supabase](https://supabase.com)
2. Create a new project or select existing
3. Go to Settings → API
4. Copy the Project URL and anon/public key
5. Copy the service_role key (keep this secret!)

### Step 4: Restart Server

```bash
# Stop your development server (Ctrl+C)
# Then restart it
npm run dev
# or
yarn dev
```

### Step 5: Test the Fix

1. Go to `/test-razorpay`
2. Click "Quick Fix" tab
3. Check if all issues are resolved
4. Try the payment modal

## 🔍 **Detailed Troubleshooting**

### Issue 1: "Payment system not configured"
**Cause**: Missing Razorpay keys
**Fix**: Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`

### Issue 2: "Magazine not found"
**Cause**: No test data in database
**Fix**: Add some magazines to your database or check database connection

### Issue 3: "Database error"
**Cause**: Supabase connection issues
**Fix**: Check `SUPABASE_SERVICE_ROLE_KEY` and database permissions

### Issue 4: "Invalid email format"
**Cause**: Email validation failing
**Fix**: Use a valid email format like `test@example.com`

### Issue 5: "Amount mismatch"
**Cause**: Price calculation error
**Fix**: Ensure magazine price is set correctly in database

## 📋 **Environment Variables Checklist**

- [ ] `RAZORPAY_KEY_ID` - Your Razorpay Key ID (starts with `rzp_test_` or `rzp_live_`)
- [ ] `RAZORPAY_KEY_SECRET` - Your Razorpay Secret Key
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY_ID` - Same as RAZORPAY_KEY_ID (for frontend)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

## 🧪 **Test Your Setup**

### Quick Test:
```bash
# Check if environment variables are loaded
node -e "console.log('Razorpay Key:', process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)"
```

### Full Test:
1. Go to `/test-razorpay`
2. Use the "Quick Fix" tab to identify issues
3. Use the "Debugger" tab for detailed analysis
4. Test payment modal with test credentials

## 🔐 **Security Notes**

### For Development:
- Use `rzp_test_` keys (test mode)
- Test cards won't charge real money
- Keep `.env.local` in `.gitignore`

### For Production:
- Use `rzp_live_` keys (live mode)
- Enable webhooks for better security
- Use environment variables in deployment platform

## 📞 **Still Having Issues?**

1. **Check the Quick Fix tab** - Automatically identifies common issues
2. **Run the Debugger** - Provides detailed error information
3. **Check browser console** - Look for JavaScript errors
4. **Check server logs** - Look for API errors
5. **Verify database** - Ensure tables exist and have data

## 🎯 **Common Solutions**

### "Cannot read properties of undefined"
- Restart your development server
- Clear browser cache
- Check if all environment variables are set

### "Network Error" or "Failed to fetch"
- Check if your development server is running
- Verify API routes are accessible
- Check for CORS issues

### "Invalid signature" errors
- Ensure RAZORPAY_KEY_SECRET matches your dashboard
- Check if you're using test vs live keys consistently

## ✅ **Success Indicators**

You'll know it's working when:
- Quick Fix shows no errors
- Debugger shows all green checkmarks
- Payment modal opens without errors
- Test payment completes successfully

## 📝 **Example .env.local File**

```env
# Razorpay Test Keys (replace with your actual keys)
RAZORPAY_KEY_ID=rzp_test_1234567890abcdef
RAZORPAY_KEY_SECRET=your_secret_key_here_32_chars_long
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_1234567890abcdef

# Supabase Configuration (replace with your actual values)
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Remember: Never commit your `.env.local` file to version control!