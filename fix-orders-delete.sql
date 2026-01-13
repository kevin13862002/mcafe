-- Fix RLS policies for orders table - ADD DELETE POLICY
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON orders;
DROP POLICY IF EXISTS "Allow public delete on orders" ON orders;

-- Recreate policies with proper permissions including DELETE
CREATE POLICY "Allow public insert on orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public select on orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public delete on orders"
  ON orders FOR DELETE
  TO public
  USING (true);

-- Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'orders';
