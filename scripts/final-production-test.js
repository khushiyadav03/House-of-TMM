/**
 * Final Production Readiness Test
 * Tests all API endpoints and database connectivity
 */

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

class ProductionTest {
  constructor() {
    this.results = {
      database: false,
      articles: false,
      magazines: false,
      categories: false,
      brandImages: false,
      youtubeVideos: false,
      coverPhotos: false,
      payment: false,
      admin: false
    };
    this.errors = [];
  }

  async runAllTests() {
    console.log('🚀 Starting Production Readiness Tests...\n');

    try {
      await this.testDatabaseConnection();
      await this.testArticlesAPI();
      await this.testMagazinesAPI();
      await this.testCategoriesAPI();
      await this.testBrandImagesAPI();
      await this.testYouTubeVideosAPI();
      await this.testCoverPhotosAPI();
      await this.testPaymentFlow();
      await this.testAdminAccess();

      this.printResults();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testDatabaseConnection() {
    console.log('📊 Testing Database Connection...');
    try {
      const response = await fetch(`${BASE_URL}/api/test-db`);
      const data = await response.json();
      this.results.database = response.ok && data.message;
      console.log(this.results.database ? '✅ Database connected' : '❌ Database connection failed');
    } catch (error) {
      this.errors.push(`Database: ${error.message}`);
      console.log('❌ Database connection failed');
    }
  }

  async testArticlesAPI() {
    console.log('📝 Testing Articles API...');
    try {
      const response = await fetch(`${BASE_URL}/api/articles?limit=5`);
      const data = await response.json();
      this.results.articles = response.ok && Array.isArray(data.articles);
      console.log(this.results.articles ? '✅ Articles API working' : '❌ Articles API failed');
    } catch (error) {
      this.errors.push(`Articles: ${error.message}`);
      console.log('❌ Articles API failed');
    }
  }

  async testMagazinesAPI() {
    console.log('📖 Testing Magazines API...');
    try {
      const response = await fetch(`${BASE_URL}/api/magazines`);
      const data = await response.json();
      this.results.magazines = response.ok && Array.isArray(data);
      console.log(this.results.magazines ? '✅ Magazines API working' : '❌ Magazines API failed');
    } catch (error) {
      this.errors.push(`Magazines: ${error.message}`);
      console.log('❌ Magazines API failed');
    }
  }

  async testCategoriesAPI() {
    console.log('🏷️ Testing Categories API...');
    try {
      const response = await fetch(`${BASE_URL}/api/categories`);
      const data = await response.json();
      this.results.categories = response.ok && Array.isArray(data);
      console.log(this.results.categories ? '✅ Categories API working' : '❌ Categories API failed');
    } catch (error) {
      this.errors.push(`Categories: ${error.message}`);
      console.log('❌ Categories API failed');
    }
  }

  async testBrandImagesAPI() {
    console.log('🏢 Testing Brand Images API...');
    try {
      const response = await fetch(`${BASE_URL}/api/brand-images`);
      const data = await response.json();
      this.results.brandImages = response.ok && Array.isArray(data);
      console.log(this.results.brandImages ? '✅ Brand Images API working' : '❌ Brand Images API failed');
    } catch (error) {
      this.errors.push(`Brand Images: ${error.message}`);
      console.log('❌ Brand Images API failed');
    }
  }

  async testYouTubeVideosAPI() {
    console.log('📺 Testing YouTube Videos API...');
    try {
      const response = await fetch(`${BASE_URL}/api/youtube-videos`);
      const data = await response.json();
      this.results.youtubeVideos = response.ok && Array.isArray(data);
      console.log(this.results.youtubeVideos ? '✅ YouTube Videos API working' : '❌ YouTube Videos API failed');
    } catch (error) {
      this.errors.push(`YouTube Videos: ${error.message}`);
      console.log('❌ YouTube Videos API failed');
    }
  }

  async testCoverPhotosAPI() {
    console.log('📸 Testing Cover Photos API...');
    try {
      const response = await fetch(`${BASE_URL}/api/cover-photos`);
      const data = await response.json();
      this.results.coverPhotos = response.ok && Array.isArray(data);
      console.log(this.results.coverPhotos ? '✅ Cover Photos API working' : '❌ Cover Photos API failed');
    } catch (error) {
      this.errors.push(`Cover Photos: ${error.message}`);
      console.log('❌ Cover Photos API failed');
    }
  }

  async testPaymentFlow() {
    console.log('💳 Testing Payment Integration...');
    try {
      // Test Razorpay configuration
      const hasRazorpayConfig = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;
      this.results.payment = hasRazorpayConfig;
      console.log(this.results.payment ? '✅ Payment configuration ready' : '❌ Payment configuration missing');
    } catch (error) {
      this.errors.push(`Payment: ${error.message}`);
      console.log('❌ Payment configuration failed');
    }
  }

  async testAdminAccess() {
    console.log('👨‍💼 Testing Admin Access...');
    try {
      const response = await fetch(`${BASE_URL}/admin/login`);
      this.results.admin = response.status === 200;
      console.log(this.results.admin ? '✅ Admin panel accessible' : '❌ Admin panel not accessible');
    } catch (error) {
      this.errors.push(`Admin: ${error.message}`);
      console.log('❌ Admin panel test failed');
    }
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 PRODUCTION READINESS REPORT');
    console.log('='.repeat(50));

    const totalTests = Object.keys(this.results).length;
    const passedTests = Object.values(this.results).filter(Boolean).length;
    const successRate = Math.round((passedTests / totalTests) * 100);

    console.log(`\n📈 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`);

    console.log('\n📋 Detailed Results:');
    Object.entries(this.results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      const testName = test.charAt(0).toUpperCase() + test.slice(1);
      console.log(`  ${status} ${testName}`);
    });

    if (this.errors.length > 0) {
      console.log('\n🚨 Errors Found:');
      this.errors.forEach(error => console.log(`  ❌ ${error}`));
    }

    console.log('\n' + '='.repeat(50));
    
    if (successRate >= 90) {
      console.log('🎉 PRODUCTION READY! Your website is ready for deployment.');
    } else if (successRate >= 70) {
      console.log('⚠️  MOSTLY READY - Fix the failing tests before deployment.');
    } else {
      console.log('🚨 NOT READY - Multiple issues need to be resolved.');
    }
    
    console.log('='.repeat(50));
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ProductionTest();
  tester.runAllTests();
}

module.exports = ProductionTest;