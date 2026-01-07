-- Fix RLS policies for orders table
-- Run this in your Supabase SQL Editor if you're getting "Could not load orders" error

-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON orders;

-- Recreate policies with proper permissions
CREATE POLICY "Allow public insert on orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select on orders"
  ON orders FOR SELECT
  TO public
  USING (true);

-- Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Check if policies are working
SELECT * FROM orders LIMIT 1;
