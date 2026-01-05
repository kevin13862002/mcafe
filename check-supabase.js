// Quick check - can we connect to Supabase?
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function checkTables() {
  console.log('Checking Supabase connection...');
  console.log('URL:', process.env.SUPABASE_URL);
  
  // Try to fetch from products table
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(5);
  
  if (error) {
    console.log('ERROR fetching products:', error.message);
    console.log('Error details:', JSON.stringify(error, null, 2));
  } else {
    console.log('SUCCESS: Connected to products table');
    console.log('Current products:', data);
  }
}

checkTables();
