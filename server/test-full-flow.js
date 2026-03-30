const axios = require('axios');

async function testRegister() {
  const email = `test_${Date.now()}@example.com`;
  try {
    console.log('📝 Testing User Registration...');
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Testy McTestface',
      email: email,
      password: 'Password123!',
      role: 'patient'
    });
    console.log('✅ Registration SUCCESS!');
    console.log('👤 User:', res.data.user.name);
    console.log('🎫 Token exists:', !!res.data.token);
    
    console.log('\n🔑 Testing Login with new user...');
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: email,
      password: 'Password123!'
    });
    console.log('✅ Login SUCCESS!');
    console.log('🏁 Registration & Login flow verified!');
  } catch (err) {
    console.error('❌ Test FAILED:', err.response?.data?.message || err.message);
    process.exit(1);
  }
}

testRegister();
