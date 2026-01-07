-- Setup Supabase Storage for product images
-- Run this in your Supabase SQL Editor to configure storage policies

-- IMPORTANT: Make sure your 'products' bucket exists first!
-- Go to Storage > Create bucket named 'products' and make it PUBLIC

-- Allow public read access to product images
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'products' );

-- Allow public uploads (so admin can upload without auth)
CREATE POLICY IF NOT EXISTS "Public Upload"
ON storage.objects FOR INSERT
TO public
WITH CHECK ( bucket_id = 'products' );

-- Allow public updates
CREATE POLICY IF NOT EXISTS "Public Update"
ON storage.objects FOR UPDATE
TO public
USING ( bucket_id = 'products' );

-- Allow public deletes
CREATE POLICY IF NOT EXISTS "Public Delete"
ON storage.objects FOR DELETE
TO public
USING ( bucket_id = 'products' );
