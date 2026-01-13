-- Add delivery_method and payment_method columns to orders table
-- Run this in your Supabase SQL Editor if you get "Could not save order" error

-- Add the columns if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS delivery_method TEXT DEFAULT 'pickup',
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'bank';

-- Verify the columns exist
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'orders'
ORDER BY ordinal_position;
