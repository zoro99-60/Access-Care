require('dotenv').config();
const { supabase } = require('./db');

async function seed() {
  console.log('🌱 Seeding Supabase...');

  // 1. Seed Categories
  const categories = [
    { id: 'hospitals', label: 'Hospitals', icon: 'Hospital', color: 'blue' },
    { id: 'clinics', label: 'Clinics', icon: 'Stethoscope', color: 'green' },
    { id: 'pharmacies', label: 'Pharmacies', icon: 'Pill', color: 'purple' },
    { id: 'diagnostic-centers', label: 'Diagnostic Centers', icon: 'Activity', color: 'red' }
  ];

  const { error: catError } = await supabase.from('categories').upsert(categories);
  if (catError) console.error('Error seeding categories:', catError.message);
  else console.log('✅ Categories seeded');

  // 2. Seed Sample Facility
  const facilities = [
    {
      name: 'City Care Hospital',
      address: '123 Health Ave, Downtown',
      phone: '555-0199',
      hours: '24/7',
      verified: true,
      score: 9.2,
      categories: ['hospitals'],
      images: ['https://images.unsplash.com/photo-1587350859728-117622bc7576?auto=format&fit=crop&q=80&w=800'],
      coords: { lat: 18.5204, lng: 73.8567 },
      features: {
        wheelchair: { label: 'Wheelchair Access', items: [{ name: 'Ramp Entrance', available: true }] }
      },
      reviews: [
        { author: 'Jane Doe', rating: 9, text: 'Very accessible and clean.', date: '2026-03-20' }
      ]
    }
  ];

  const { error: facError } = await supabase.from('facilities').upsert(facilities);
  if (facError) console.error('Error seeding facilities:', facError.message);
  else console.log('✅ Facilities seeded');

  console.log('🏁 Seeding complete!');
  process.exit(0);
}

seed();
