/*
SQL to create the required tables in Supabase

Run this in your Supabase SQL Editor:
1. Go to https://app.supabase.com
2. Navigate to your project (dqxgxjyliirsldztyelq)
3. Go to SQL Editor
4. Create a new query
5. Paste and run the SQL below
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  delivery_address TEXT,
  special_requests TEXT,
  location JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS if needed (optional)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies to allow public access (adjust based on your security needs)
CREATE POLICY "Allow public select on products"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated insert on products"
  ON products FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on products"
  ON products FOR UPDATE
  USING (true);

CREATE POLICY "Allow authenticated delete on products"
  ON products FOR DELETE
  USING (true);

CREATE POLICY "Allow public insert on orders"
  ON orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select on orders"
  ON orders FOR SELECT
  USING (true);
