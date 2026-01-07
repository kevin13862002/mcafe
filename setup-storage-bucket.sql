-- Setup Supabase Storage for product images
-- Run this in your Supabase SQL Editor to configure storage policies

-- IMPORTANT: Make sure your 'products' bucket exists first!
-- Go to Storage > Create bucket named 'products' and make it PUBLIC

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Allow public read access to product images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'products' );

-- Allow public uploads (so admin can upload without auth)
CREATE POLICY "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'products' );

-- Allow public updates
CREATE POLICY "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'products' );

-- Allow public deletes
CREATE POLICY "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'products' );
