// Supabase initialization utility
// Set window.SUPABASE_URL and window.SUPABASE_ANON_KEY before loading this file,
// or replace the placeholders below.
(function(){
  const URL = window.SUPABASE_URL || 'https://your-project.supabase.co';
  const KEY = window.SUPABASE_ANON_KEY || 'your-anon-key';

  if(!window.supabase || !window.supabase.createClient){
    console.warn('Supabase library not found. Make sure to include @supabase/supabase-js UMD script before this file.');
    return;
  }

  window.supabaseClient = window.supabase.createClient(URL, KEY);

  // Save order to 'orders' table. Order should be an object with fields:
  // items (JSON), total (number), customer_name, requests, location (string)
  window.saveOrderToDatabase = async function(order){
    try{
      const { data, error } = await window.supabaseClient
        .from('orders')
        .insert([order])
        .select();
      if(error) throw error;
      return { data };
    }catch(err){
      console.error('saveOrderToDatabase failed', err);
      throw err;
    }
  }
})();
