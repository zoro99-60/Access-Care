const axios = require('axios');

async function testDemo() {
  try {
    console.log('🔑 Testing Demo Login Fallback...');
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'patient@demo.com',
      password: 'demo1234'
    });
    console.log('✅ Demo Login SUCCESS!');
    console.log('👤 User:', res.data.user.name);
    console.log('🎫 Token:', res.data.token);
    console.log('🏁 Verification complete!');
  } catch (err) {
    console.error('❌ Demo Login FAILED:', err.response?.data?.message || err.message);
  }
}

testDemo();
