#!/usr/bin/env node

/**
 * Simple test script for the URL Shortener API
 * Run with: node test.js
 */

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testing URL Shortener API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    console.log('');

    // Test 2: Create short URL
    console.log('2. Testing URL shortening...');
    const shortenResponse = await fetch(`${BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.github.com' })
    });
    const shortenData = await shortenResponse.json();
    console.log('✅ URL shortened:', shortenData);
    const shortCode = shortenData.shortCode;
    console.log('');

    // Test 3: Get analytics
    console.log('3. Testing analytics...');
    const analyticsResponse = await fetch(`${BASE_URL}/api/analytics/${shortCode}`);
    const analyticsData = await analyticsResponse.json();
    console.log('✅ Analytics:', analyticsData);
    console.log('');

    // Test 4: Test redirection (simulate visit)
    console.log('4. Testing redirection...');
    const redirectResponse = await fetch(`${BASE_URL}/${shortCode}`, {
      redirect: 'manual' // Don't follow redirects automatically
    });
    console.log('✅ Redirect status:', redirectResponse.status);
    console.log('✅ Redirect location:', redirectResponse.headers.get('location'));
    console.log('');

    // Test 5: Check analytics after visit
    console.log('5. Testing analytics after visit...');
    const analyticsAfterResponse = await fetch(`${BASE_URL}/api/analytics/${shortCode}`);
    const analyticsAfterData = await analyticsAfterResponse.json();
    console.log('✅ Analytics after visit:', analyticsAfterData);
    console.log('');

    // Test 6: Test deduplication
    console.log('6. Testing deduplication...');
    const dedupResponse = await fetch(`${BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://www.github.com' })
    });
    const dedupData = await dedupResponse.json();
    console.log('✅ Deduplication test:', dedupData);
    console.log('');

    // Test 7: Test error handling
    console.log('7. Testing error handling...');
    const errorResponse = await fetch(`${BASE_URL}/api/shorten`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'invalid-url' })
    });
    const errorData = await errorResponse.json();
    console.log('✅ Error handling:', errorData);
    console.log('');

    // Test 8: Get all URLs
    console.log('8. Testing get all URLs...');
    const allUrlsResponse = await fetch(`${BASE_URL}/api/urls`);
    const allUrlsData = await allUrlsResponse.json();
    console.log('✅ All URLs:', allUrlsData);
    console.log('');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm start');
  }
}

// Run tests
testAPI();
