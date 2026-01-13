-- Fix RLS policies for orders table - COMPLETE POLICY SET
-- Run this in your Supabase SQL Editor if delete is not working

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Allow public insert on orders" ON orders;
DROP POLICY IF EXISTS "Allow public select on orders" ON orders;
DROP POLICY IF EXISTS "Allow public delete on orders" ON orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON orders;

-- Step 2: Recreate policies with proper permissions (INSERT, SELECT, DELETE, UPDATE)
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

CREATE POLICY "Allow public update on orders"
  ON orders FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Step 3: Verify RLS is enabled
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Step 4: Verify all policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- Step 5: Verify table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
