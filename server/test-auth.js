const axios = require('axios');

async function testAuth() {
  const baseURL = 'http://localhost:5000/api/auth';
  const testUser = {
    name: 'Test User',
    email: `tester_${Math.floor(Math.random() * 1000)}@gmail.com`,
    password: 'Password123!'
  };

  console.log('🧪 Testing Auth Flow...');

  try {
    // 1. Test Register
    console.log('📝 Registering...');
    const regRes = await axios.post(`${baseURL}/register`, testUser);
    console.log('✅ Register SUCCESS:', regRes.data.user.email);

    // 2. Test Login
    console.log('🔑 Logging in...');
    const loginRes = await axios.post(`${baseURL}/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Login SUCCESS. Token received.');

    // 3. Test /me
    console.log('👤 Checking /me...');
    const meRes = await axios.get(`${baseURL}/me`, {
      headers: { Authorization: `Bearer ${loginRes.data.token}` }
    });
    console.log('✅ /me SUCCESS. User:', meRes.data.user.name);

    // 4. Test Data Fetching
    console.log('🏥 Fetching Facilities...');
    const facRes = await axios.get('http://localhost:5000/api/facilities');
    console.log(`✅ Facilities SUCCESS: ${facRes.data.length} found.`);

    console.log('📂 Fetching Categories...');
    const catRes = await axios.get('http://localhost:5000/api/categories');
    console.log(`✅ Categories SUCCESS: ${catRes.data.length} found.`);

    console.log('🏁 All tests PASSED!');
  } catch (err) {
    console.error('❌ Test FAILED:', err.response?.data?.message || err.message);
  }
}

testAuth();
