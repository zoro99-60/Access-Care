const dns = require('dns').promises;

async function checkDNS() {
  const srvDomain = '_mongodb._tcp.cluster0.jordlwz.mongodb.net';
  console.log(`🔍 Checking DNS for: ${srvDomain}`);

  try {
    const addresses = await dns.resolveSrv(srvDomain);
    console.log('✅ SRV Records found:');
    console.log(JSON.stringify(addresses, null, 2));
  } catch (err) {
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED' || err.code === 'ESERVFAIL') {
      console.error('❌ DNS Resolution Failed!');
      console.error(`Error Code: ${err.code}`);
      console.error('Message:', err.message);
      console.log('\n💡 Recommendation:');
      console.log('1. Try switching your DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1).');
      console.log('2. Check if a VPN or Firewall is blocking SRV queries.');
      console.log('3. Use the "Standard Connection String" (mongodb://...) if the issue persists.');
    } else {
      console.error('An unexpected error occurred:', err);
    }
  }
}

checkDNS();
