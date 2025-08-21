/**
 * Comprehensive Admin Panel Database Operations Test
 * Tests all CRUD operations through the admin panel APIs
 */

const BASE_URL = 'http://localhost:3001';

// Mock admin token (in real scenario, get from login)
const ADMIN_TOKEN = btoa(JSON.stringify({
  admin: true,
  username: 'admin',
  timestamp: Date.now(),
  expires: Date.now() + (24 * 60 * 60 * 1000)
}));

const headers = {
  'Content-Type': 'application/json',
  'x-admin-token': ADMIN_TOKEN
};

class AdminDatabaseTester {
  constructor() {
    this.testResults = {};
    this.createdItems = {};
  }

  async runAllTests() {
    console.log('🚀 Starting Admin Panel Database Operations Test\n');
    
    try {
      // Test Categories
      await this.testCategories();
      
      // Test Articles (depends on categories)
      await this.testArticles();
      
      // Test Magazines
      await this.testMagazines();
      
      // Test Brand Images
      await this.testBrandImages();
      
      // Test YouTube Videos
      await this.testYouTubeVideos();
      
      // Test Cover Photos
      await this.testCoverPhotos();
      
      // Test Statistics
      await this.testStatistics();
      
      // Cleanup created items
      await this.cleanup();
      
      // Print final results
      this.printResults();
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
  }

  async testCategories() {
    console.log('📁 Testing Categories CRUD Operations...');
    
    try {
      // 1. CREATE Category
      const createResponse = await fetch(`${BASE_URL}/api/categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: 'Test Category',
          slug: 'test-category',
          description: 'This is a test category for database operations'
        })
      });
      
      const createdCategory = await createResponse.json();
      this.createdItems.categoryId = createdCategory.id;
      this.testResults.categoryCreate = createResponse.ok;
      console.log(`✅ Category CREATE: ${createResponse.ok ? 'PASS' : 'FAIL'}`);
      
      // 2. READ Categories
      const readResponse = await fetch(`${BASE_URL}/api/categories`, { headers });
      const categories = await readResponse.json();
      this.testResults.categoryRead = readResponse.ok && Array.isArray(categories);
      console.log(`✅ Category READ: ${this.testResults.categoryRead ? 'PASS' : 'FAIL'}`);
      
      // 3. UPDATE Category
      const updateResponse = await fetch(`${BASE_URL}/api/categories/${this.createdItems.categoryId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          name: 'Updated Test Category',
          slug: 'test-category',
          description: 'Updated description'
        })
      });
      
      this.testResults.categoryUpdate = updateResponse.ok;
      console.log(`✅ Category UPDATE: ${updateResponse.ok ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ Category tests failed: ${error.message}`);
      this.testResults.categoryCreate = false;
      this.testResults.categoryRead = false;
      this.testResults.categoryUpdate = false;
    }
  }

  async testArticles() {
    console.log('\n📰 Testing Articles CRUD Operations...');
    
    try {
      // 1. CREATE Article
      const createResponse = await fetch(`${BASE_URL}/api/articles`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Test Article for Database Operations',
          slug: 'test-article-database-ops',
          content: '<h1>Test Article Content</h1><p>This is a test article created by the database test suite.</p>',
          excerpt: 'Test article excerpt for database operations',
          author: 'Test Author',
          publish_date: new Date().toISOString().split('T')[0],
          categories: this.createdItems.categoryId ? [this.createdItems.categoryId] : [],
          status: 'draft',
          featured: false,
          seo_title: 'Test Article SEO Title',
          seo_description: 'Test article SEO description',
          seo_keywords: ['test', 'database', 'operations'],
          alt_text: 'Test article image alt text'
        })
      });
      
      const createdArticle = await createResponse.json();
      this.createdItems.articleId = createdArticle.id;
      this.testResults.articleCreate = createResponse.ok;
      console.log(`✅ Article CREATE: ${createResponse.ok ? 'PASS' : 'FAIL'}`);
      
      // 2. READ Articles
      const readResponse = await fetch(`${BASE_URL}/api/articles?limit=10`, { headers });
      const articlesData = await readResponse.json();
      this.testResults.articleRead = readResponse.ok && articlesData.articles;
      console.log(`✅ Article READ: ${this.testResults.articleRead ? 'PASS' : 'FAIL'}`);
      
      // 3. UPDATE Article (change status to published)
      const updateResponse = await fetch(`${BASE_URL}/api/articles`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: this.createdItems.articleId,
          title: 'Updated Test Article',
          slug: 'test-article-database-ops',
          content: '<h1>Updated Content</h1><p>This article has been updated.</p>',
          excerpt: 'Updated excerpt',
          author: 'Updated Author',
          publish_date: new Date().toISOString().split('T')[0],
          categories: this.createdItems.categoryId ? [this.createdItems.categoryId] : [],
          status: 'published',
          featured: true
        })
      });
      
      this.testResults.articleUpdate = updateResponse.ok;
      console.log(`✅ Article UPDATE: ${updateResponse.ok ? 'PASS' : 'FAIL'}`);
      
      // 4. Test Article Statistics
      const statsResponse = await fetch(`${BASE_URL}/api/articles/stats`, { headers });
      const stats = await statsResponse.json();
      this.testResults.articleStats = statsResponse.ok && stats.totalArticles !== undefined;
      console.log(`✅ Article STATS: ${this.testResults.articleStats ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ Article tests failed: ${error.message}`);
      this.testResults.articleCreate = false;
      this.testResults.articleRead = false;
      this.testResults.articleUpdate = false;
      this.testResults.articleStats = false;
    }
  }

  async testMagazines() {
    console.log('\n📚 Testing Magazines CRUD Operations...');
    
    try {
      // 1. CREATE Magazine
      const createResponse = await fetch(`${BASE_URL}/api/magazines`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Test Magazine Issue',
          description: 'Test magazine for database operations',
          cover_image_url: 'https://example.com/test-cover.jpg',
          price: 99.99,
          issue_date: new Date().toISOString().split('T')[0],
          status: 'draft',
          is_paid: true,
          seo_title: 'Test Magazine SEO',
          seo_description: 'Test magazine SEO description',
          seo_keywords: ['test', 'magazine']
        })
      });
      
      const createdMagazine = await createResponse.json();
      this.createdItems.magazineId = createdMagazine.id;
      this.testResults.magazineCreate = createResponse.ok;
      console.log(`✅ Magazine CREATE: ${createResponse.ok ? 'PASS' : 'FAIL'}`);
      
      // 2. READ Magazines
      const readResponse = await fetch(`${BASE_URL}/api/magazines`, { headers });
      const magazines = await readResponse.json();
      this.testResults.magazineRead = readResponse.ok && Array.isArray(magazines);
      console.log(`✅ Magazine READ: ${this.testResults.magazineRead ? 'PASS' : 'FAIL'}`);
      
      // 3. UPDATE Magazine
      const updateResponse = await fetch(`${BASE_URL}/api/magazines/${this.createdItems.magazineId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          title: 'Updated Test Magazine',
          description: 'Updated magazine description',
          price: 149.99,
          status: 'published'
        })
      });
      
      this.testResults.magazineUpdate = updateResponse.ok;
      console.log(`✅ Magazine UPDATE: ${updateResponse.ok ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ Magazine tests failed: ${error.message}`);
      this.testResults.magazineCreate = false;
      this.testResults.magazineRead = false;
      this.testResults.magazineUpdate = false;
    }
  }

  async testBrandImages() {
    console.log('\n🏢 Testing Brand Images Operations...');
    
    try {
      // 1. READ Brand Images
      const readResponse = await fetch(`${BASE_URL}/api/brand-images`, { headers });
      const brandImages = await readResponse.json();
      this.testResults.brandImagesRead = readResponse.ok && Array.isArray(brandImages);
      console.log(`✅ Brand Images READ: ${this.testResults.brandImagesRead ? 'PASS' : 'FAIL'}`);
      
      // 2. CREATE Brand Image
      const createResponse = await fetch(`${BASE_URL}/api/brand-images`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Test Brand',
          image_url: 'https://example.com/test-brand.jpg',
          display_order: 1,
          is_active: true
        })
      });
      
      const createdBrand = await createResponse.json();
      this.createdItems.brandImageId = createdBrand.id;
      this.testResults.brandImagesCreate = createResponse.ok;
      console.log(`✅ Brand Images CREATE: ${createResponse.ok ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ Brand Images tests failed: ${error.message}`);
      this.testResults.brandImagesRead = false;
      this.testResults.brandImagesCreate = false;
    }
  }

  async testYouTubeVideos() {
    console.log('\n🎥 Testing YouTube Videos Operations...');
    
    try {
      // 1. READ YouTube Videos
      const readResponse = await fetch(`${BASE_URL}/api/youtube-videos`, { headers });
      const videos = await readResponse.json();
      this.testResults.youtubeRead = readResponse.ok && Array.isArray(videos);
      console.log(`✅ YouTube Videos READ: ${this.testResults.youtubeRead ? 'PASS' : 'FAIL'}`);
      
      // 2. CREATE YouTube Video
      const createResponse = await fetch(`${BASE_URL}/api/youtube-videos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Test Video',
          video_url: 'https://youtube.com/watch?v=test123',
          thumbnail_url: 'https://img.youtube.com/vi/test123/maxresdefault.jpg',
          is_main_video: false,
          display_order: 1,
          is_active: true
        })
      });
      
      const createdVideo = await createResponse.json();
      this.createdItems.videoId = createdVideo.id;
      this.testResults.youtubeCreate = createResponse.ok;
      console.log(`✅ YouTube Videos CREATE: ${createResponse.ok ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ YouTube Videos tests failed: ${error.message}`);
      this.testResults.youtubeRead = false;
      this.testResults.youtubeCreate = false;
    }
  }

  async testCoverPhotos() {
    console.log('\n📸 Testing Cover Photos Operations...');
    
    try {
      // 1. READ Cover Photos
      const readResponse = await fetch(`${BASE_URL}/api/cover-photos`, { headers });
      const coverPhotos = await readResponse.json();
      this.testResults.coverPhotosRead = readResponse.ok && Array.isArray(coverPhotos);
      console.log(`✅ Cover Photos READ: ${this.testResults.coverPhotosRead ? 'PASS' : 'FAIL'}`);
      
      // 2. CREATE Cover Photo
      const createResponse = await fetch(`${BASE_URL}/api/cover-photos`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          title: 'Test Cover Photo',
          image_url: 'https://example.com/test-cover-photo.jpg',
          description: 'Test cover photo description',
          category: 'fashion',
          status: 'draft',
          is_active: true,
          display_order: 1
        })
      });
      
      const createdCoverPhoto = await createResponse.json();
      this.createdItems.coverPhotoId = createdCoverPhoto.id;
      this.testResults.coverPhotosCreate = createResponse.ok;
      console.log(`✅ Cover Photos CREATE: ${createResponse.ok ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ Cover Photos tests failed: ${error.message}`);
      this.testResults.coverPhotosRead = false;
      this.testResults.coverPhotosCreate = false;
    }
  }

  async testStatistics() {
    console.log('\n📊 Testing Dashboard Statistics...');
    
    try {
      // Test article statistics
      const articleStatsResponse = await fetch(`${BASE_URL}/api/articles/stats`, { headers });
      const articleStats = await articleStatsResponse.json();
      this.testResults.dashboardStats = articleStatsResponse.ok && articleStats.totalArticles !== undefined;
      console.log(`✅ Dashboard Statistics: ${this.testResults.dashboardStats ? 'PASS' : 'FAIL'}`);
      
    } catch (error) {
      console.log(`❌ Statistics tests failed: ${error.message}`);
      this.testResults.dashboardStats = false;
    }
  }

  async cleanup() {
    console.log('\n🧹 Cleaning up test data...');
    
    const cleanupPromises = [];
    
    // Delete test article
    if (this.createdItems.articleId) {
      cleanupPromises.push(
        fetch(`${BASE_URL}/api/articles`, {
          method: 'DELETE',
          headers,
          body: JSON.stringify({ id: this.createdItems.articleId })
        })
      );
    }
    
    // Delete test magazine
    if (this.createdItems.magazineId) {
      cleanupPromises.push(
        fetch(`${BASE_URL}/api/magazines/${this.createdItems.magazineId}`, {
          method: 'DELETE',
          headers
        })
      );
    }
    
    // Delete test category
    if (this.createdItems.categoryId) {
      cleanupPromises.push(
        fetch(`${BASE_URL}/api/categories/${this.createdItems.categoryId}`, {
          method: 'DELETE',
          headers
        })
      );
    }
    
    // Delete test brand image
    if (this.createdItems.brandImageId) {
      cleanupPromises.push(
        fetch(`${BASE_URL}/api/brand-images/${this.createdItems.brandImageId}`, {
          method: 'DELETE',
          headers
        })
      );
    }
    
    // Delete test video
    if (this.createdItems.videoId) {
      cleanupPromises.push(
        fetch(`${BASE_URL}/api/youtube-videos/${this.createdItems.videoId}`, {
          method: 'DELETE',
          headers
        })
      );
    }
    
    // Delete test cover photo
    if (this.createdItems.coverPhotoId) {
      cleanupPromises.push(
        fetch(`${BASE_URL}/api/cover-photos/${this.createdItems.coverPhotoId}`, {
          method: 'DELETE',
          headers
        })
      );
    }
    
    try {
      await Promise.all(cleanupPromises);
      console.log('✅ Cleanup completed');
    } catch (error) {
      console.log('⚠️  Some cleanup operations failed');
    }
  }

  printResults() {
    console.log('\n📋 TEST RESULTS SUMMARY');
    console.log('========================');
    
    const testCategories = {
      'Categories': ['categoryCreate', 'categoryRead', 'categoryUpdate'],
      'Articles': ['articleCreate', 'articleRead', 'articleUpdate', 'articleStats'],
      'Magazines': ['magazineCreate', 'magazineRead', 'magazineUpdate'],
      'Brand Images': ['brandImagesCreate', 'brandImagesRead'],
      'YouTube Videos': ['youtubeCreate', 'youtubeRead'],
      'Cover Photos': ['coverPhotosCreate', 'coverPhotosRead'],
      'Statistics': ['dashboardStats']
    };
    
    let totalTests = 0;
    let passedTests = 0;
    
    for (const [category, tests] of Object.entries(testCategories)) {
      console.log(`\n${category}:`);
      for (const test of tests) {
        const result = this.testResults[test];
        const status = result ? '✅ PASS' : '❌ FAIL';
        const operation = test.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        console.log(`  ${operation}: ${status}`);
        totalTests++;
        if (result) passedTests++;
      }
    }
    
    console.log('\n========================');
    console.log(`Overall Results: ${passedTests}/${totalTests} tests passed`);
    console.log(`Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL TESTS PASSED - Database operations are working perfectly!');
    } else {
      console.log('⚠️  Some tests failed - Please check the errors above');
    }
  }
}

// Run the test suite
const tester = new AdminDatabaseTester();
tester.runAllTests().catch(console.error);
