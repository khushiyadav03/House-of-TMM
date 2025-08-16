#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const testEndpoints = [
  // Core APIs
  { name: 'Articles API', url: '/api/articles?limit=5' },
  { name: 'Categories API', url: '/api/categories' },
  { name: 'Magazines API', url: '/api/magazines?limit=5' },
  { name: 'YouTube Videos API (with auto-thumbnails)', url: '/api/youtube-videos?limit=5' },
  { name: 'Brand Images API', url: '/api/brand-images?limit=5' },
  { name: 'Cover Photos API', url: '/api/cover-photos' },
  { name: 'Pep Talk API', url: '/api/pep-talk?limit=5' },
  
  // Category-specific APIs
  { name: 'Digital Cover API', url: '/api/cover-photos/by-category/digital-cover?limit=5' },
  { name: 'Editorial Shoot API', url: '/api/cover-photos/by-category/editorial-shoot?limit=5' },
  { name: 'Fashion Articles API', url: '/api/articles/by-category/fashion?limit=5' },
  { name: 'Technology Articles API', url: '/api/articles/by-category/technology?limit=5' },
  { name: 'Sports Articles API', url: '/api/articles/by-category/sports?limit=5' },
  { name: 'Finance Articles API', url: '/api/articles/by-category/finance?limit=5' },
  { name: 'Lifestyle Articles API', url: '/api/articles/by-category/lifestyle?limit=5' },
  { name: 'Entertainment Articles API', url: '/api/articles/by-category/entertainment?limit=5' },
];

async function testAPI(endpoint) {
  try {
    console.log(`\n🧪 Testing: ${endpoint.name}`);
    console.log(`📡 URL: ${BASE_URL}${endpoint.url}`);
    
    const response = await fetch(`${BASE_URL}${endpoint.url}`);
    const data = await response.json();
    
    if (!response.ok) {
      console.log(`❌ FAILED: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return { name: endpoint.name, status: 'FAILED', error: data.error || response.statusText };
    }
    
    // Check data structure
    let itemCount = 0;
    if (Array.isArray(data)) {
      itemCount = data.length;
    } else if (data.articles && Array.isArray(data.articles)) {
      itemCount = data.articles.length;
    } else if (typeof data === 'object') {
      itemCount = Object.keys(data).length;
    }
    
    console.log(`✅ SUCCESS: ${response.status} OK`);
    console.log(`   Items returned: ${itemCount}`);
    
    // Show sample data structure
    if (Array.isArray(data) && data.length > 0) {
      console.log(`   Sample item keys: ${Object.keys(data[0]).join(', ')}`);
    } else if (data.articles && data.articles.length > 0) {
      console.log(`   Sample article keys: ${Object.keys(data.articles[0]).join(', ')}`);
      if (data.category) {
        console.log(`   Category: ${data.category.name} (${data.category.slug})`);
      }
      if (data.total !== undefined) {
        console.log(`   Total available: ${data.total}`);
      }
    }
    
    return { name: endpoint.name, status: 'SUCCESS', itemCount };
    
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    return { name: endpoint.name, status: 'ERROR', error: error.message };
  }
}

async function runAllTests() {
  console.log('🚀 Starting API Tests...');
  console.log(`🌐 Base URL: ${BASE_URL}`);
  console.log('=' .repeat(60));
  
  const results = [];
  
  for (const endpoint of testEndpoints) {
    const result = await testAPI(endpoint);
    results.push(result);
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  const successful = results.filter(r => r.status === 'SUCCESS');
  const failed = results.filter(r => r.status === 'FAILED');
  const errors = results.filter(r => r.status === 'ERROR');
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`🚨 Errors: ${errors.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    failed.forEach(result => {
      console.log(`   - ${result.name}: ${result.error}`);
    });
  }
  
  if (errors.length > 0) {
    console.log('\n🚨 ERROR TESTS:');
    errors.forEach(result => {
      console.log(`   - ${result.name}: ${result.error}`);
    });
  }
  
  console.log('\n🏁 Testing complete!');
  
  // Exit with error code if any tests failed
  if (failed.length > 0 || errors.length > 0) {
    process.exit(1);
  }
}

// Run the tests
runAllTests().catch(console.error);