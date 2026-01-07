require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function testInsert() {
  console.log('Testing with OLD schema (requests, location as text)...');
  
  const order = {
    items: JSON.stringify([{ id: 1, name: 'Test Cake', price: 10, qty: 1 }]),
    total: 10,
    customer_name: 'Test Customer',
    requests: 'Delivery: 123 Test St | Special: Test request',
    location: 'https://maps.google.com'
  };
  
  console.log('Inserting order:', order);
  
  const { data, error } = await client
    .from('orders')
    .insert([order])
    .select();
  
  if (error) {
    console.error('ERROR:', error);
  } else {
    console.log('SUCCESS:', data);
  }
  
  process.exit(0);
}

testInsert();
