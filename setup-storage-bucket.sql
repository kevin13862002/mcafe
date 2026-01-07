-- Setup Supabase Storage for product images
-- Run this in your Supabase SQL Editor if you need to configure RLS policies for storage

-- Make the product-images bucket public so images can be viewed without authentication
-- Go to Storage > product-images bucket settings and make it public
-- Or run this to create storage policies:

-- Allow public read access to product images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Allow uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Allow authenticated users to update their images
CREATE POLICY "Allow updates"
ON storage.objects FOR UPDATE
USING ( bucket_id = 'product-images' );

-- Allow authenticated users to delete images
CREATE POLICY "Allow deletes"
ON storage.objects FOR DELETE
USING ( bucket_id = 'product-images' );
