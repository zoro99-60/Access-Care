const axios = require('axios');

async function testData() {
  try {
    console.log('🏥 Fetching Facilities...');
    const facRes = await axios.get('http://localhost:5000/api/facilities');
    console.log(`✅ Facilities SUCCESS: ${facRes.data.length} found.`);

    console.log('📂 Fetching Categories...');
    const catRes = await axios.get('http://localhost:5000/api/categories');
    console.log(`✅ Categories SUCCESS: ${catRes.data.length} found.`);

    console.log('🏁 Data tests PASSED!');
  } catch (err) {
    console.error('❌ Data tests FAILED:', err.message);
  }
}

testData();
