#!/usr/bin/env node

/**
 * Environment Validation Script
 * Run this to check if your environment is properly configured for Razorpay payments
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Environment Configuration...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.local.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found');
  if (fs.existsSync(envExamplePath)) {
    console.log('💡 Found .env.local.example - copy it to .env.local and fill in your values');
    console.log('   cp .env.local.example .env.local\n');
  }
  process.exit(1);
} else {
  console.log('✅ .env.local file found');
}

// Load environment variables
require('dotenv').config({ path: envPath });

// Required environment variables
const requiredVars = [
  'RAZORPAY_KEY_ID',
  'RAZORPAY_KEY_SECRET', 
  'NEXT_PUBLIC_RAZORPAY_KEY_ID',
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const optionalVars = [
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_BASE_URL'
];

let allGood = true;

console.log('\n📋 Checking Required Variables:');
requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName} - Missing`);
    allGood = false;
  } else if (value.length < 10) {
    console.log(`⚠️  ${varName} - Too short (${value.length} chars)`);
    allGood = false;
  } else {
    console.log(`✅ ${varName} - Set (${value.length} chars)`);
  }
});

console.log('\n📋 Checking Optional Variables:');
optionalVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`⚠️  ${varName} - Not set (optional)`);
  } else {
    console.log(`✅ ${varName} - Set (${value.length} chars)`);
  }
});

// Validate Razorpay key format
console.log('\n🔐 Validating Key Formats:');
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const publicRazorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

if (razorpayKeyId) {
  if (razorpayKeyId.startsWith('rzp_test_') || razorpayKeyId.startsWith('rzp_live_')) {
    console.log(`✅ RAZORPAY_KEY_ID format is valid (${razorpayKeyId.startsWith('rzp_test_') ? 'TEST' : 'LIVE'} mode)`);
  } else {
    console.log('❌ RAZORPAY_KEY_ID format is invalid (should start with rzp_test_ or rzp_live_)');
    allGood = false;
  }
}

if (publicRazorpayKeyId) {
  if (razorpayKeyId === publicRazorpayKeyId) {
    console.log('✅ NEXT_PUBLIC_RAZORPAY_KEY_ID matches RAZORPAY_KEY_ID');
  } else {
    console.log('❌ NEXT_PUBLIC_RAZORPAY_KEY_ID does not match RAZORPAY_KEY_ID');
    allGood = false;
  }
}

// Validate Supabase URL format
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
if (supabaseUrl) {
  if (supabaseUrl.includes('supabase.co') && supabaseUrl.startsWith('https://')) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL format is valid');
  } else {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL format is invalid (should be https://your-project.supabase.co)');
    allGood = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allGood) {
  console.log('🎉 Environment configuration looks good!');
  console.log('\n📝 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Go to /test-razorpay to test the payment system');
  console.log('3. Use the Quick Fix tab to verify everything works');
} else {
  console.log('❌ Environment configuration has issues!');
  console.log('\n🔧 To fix:');
  console.log('1. Update your .env.local file with the missing/invalid values');
  console.log('2. Get your keys from:');
  console.log('   - Razorpay: https://dashboard.razorpay.com/app/keys');
  console.log('   - Supabase: https://supabase.com (Settings → API)');
  console.log('3. Restart your development server after making changes');
  console.log('4. Run this script again to verify: node scripts/validate-environment.js');
}

console.log('\n💡 For detailed setup instructions, see ENVIRONMENT_SETUP_GUIDE.md');