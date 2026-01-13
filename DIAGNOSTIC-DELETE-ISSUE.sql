-- DIAGNOSTIC SCRIPT: Debug order deletion issues
-- Run this in Supabase SQL Editor to check all prerequisites

-- 1. Check if orders table exists and has the right structure
SELECT 'TABLE STRUCTURE' as check;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;

-- 2. Check RLS status
SELECT 'RLS POLICIES' as check;
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'orders'
ORDER BY policyname;

-- 3. Check if RLS is actually enabled
SELECT 'RLS ENABLED STATUS' as check;
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'orders';

-- 4. Sample data to verify table has content
SELECT 'SAMPLE ORDERS DATA' as check;
SELECT id, customer_name, created_at, delivery_method, payment_method
FROM orders
LIMIT 3;

-- 5. Try a test delete (DELETE THE FIRST ORDER AS A TEST)
-- UNCOMMENT THE LINE BELOW TO TEST - it will actually delete the first order!
-- DELETE FROM orders WHERE id = (SELECT id FROM orders LIMIT 1);

-- 6. Check if any triggers might be blocking deletes
SELECT 'TRIGGERS' as check;
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE event_object_table = 'orders';

-- 7. Check column defaults
SELECT 'COLUMN DEFAULTS' as check;
SELECT column_name, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
AND column_default IS NOT NULL;
