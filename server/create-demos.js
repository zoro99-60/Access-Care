require('dotenv').config();
const { supabase } = require('./db');

const DEMO_USERS = [
  { name: 'Patient User',  email: 'patient@demo.com',  password: 'demo1234', role: 'patient'  },
  { name: 'Dr. Doctor',    email: 'doctor@demo.com',   password: 'demo1234', role: 'doctor'   },
  { name: 'City Hospital', email: 'hospital@demo.com', password: 'demo1234', role: 'hospital' },
  { name: 'System Admin',  email: 'admin@demo.com',    password: 'demo1234', role: 'admin'    },
];

async function createDemos() {
  console.log('🚀 Creating demo users in Supabase Auth...');

  for (const user of DEMO_USERS) {
    console.log(`👤 Creating ${user.email}...`);
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: { name: user.name, role: user.role }
      }
    });

    if (error) {
      if (error.message.includes('already registered')) {
        console.log(`✅ ${user.email} already exists.`);
      } else {
        console.error(`❌ Failed ${user.email}:`, error.message);
      }
    } else {
      console.log(`✅ ${user.email} created.`);
    }
  }

  console.log('🏁 Demo creation complete!');
  process.exit(0);
}

createDemos();
