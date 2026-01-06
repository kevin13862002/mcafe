#!/usr/bin/env node
/**
 * M Cafe Admin Proxy Server
 * Provides server-side admin authentication and product/order management endpoints
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

if (!supabaseUrl || !supabaseKey) {
  console.warn('WARN: SUPABASE_URL and/or SUPABASE_ANON_KEY not set — running in local fallback mode');
}

let supabase;
let supabaseAdmin;
try {
  if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✓ Supabase client initialized');
  } else {
    supabase = null;
  }
  
  if (supabaseUrl && supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✓ Supabase admin client initialized (for bypassing RLS)');
  } else {
    supabaseAdmin = null;
    if (supabaseUrl && supabaseKey) {
      console.warn('WARN: SUPABASE_SERVICE_ROLE_KEY not set — admin operations will use anon key (may fail due to RLS)');
    }
  }
} catch (err) {
  console.error('✗ Error initializing Supabase:', err.message);
  process.exit(1);
}

// Local in-memory fallback for development when Supabase is unavailable
const localStore = {
  products: [],
  orders: [],
  _nextProductId: 1,
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Error handler for uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('✗ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('✗ Unhandled Rejection:', reason);
  process.exit(1);
});

// Simple session store (in production, use Redis or similar)
const sessions = new Map();

function generateSessionId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Admin sign-in endpoint
app.post('/api/admin/signin', async (req, res) => {
  const { password } = req.body;

  if (!password || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const sessionId = generateSessionId();
  sessions.set(sessionId, {
    createdAt: Date.now(),
    lastActivity: Date.now()
  });

  res.json({ success: true, sessionId });
});

// Verify session middleware
function authMiddleware(req, res, next) {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = sessions.get(sessionId);
  session.lastActivity = Date.now();
  next();
}

// Admin sign-out endpoint
app.post('/api/admin/signout', authMiddleware, (req, res) => {
  const sessionId = req.headers['x-session-id'];
  if (sessionId) sessions.delete(sessionId);
  res.json({ success: true });
});

// Products endpoints
app.get('/api/products', async (req, res) => {
  try {
    if (!supabase) {
      console.log('Products fetched from local store:', localStore.products.length);
      return res.json({ data: localStore.products });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error fetching products:', error);
      return res.status(400).json({ error: error.message });
    }

    console.log('Products fetched successfully:', data?.length || 0);
    res.json({ data: data || [] });
  } catch (err) {
    console.error('Error in GET /api/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/products', authMiddleware, async (req, res) => {
  try {
    const { name, price, image, description } = req.body;

    if (!name || !price || isNaN(parseFloat(price))) {
      return res.status(400).json({ error: 'Invalid product data' });
    }

    if (!supabase) {
      const newProduct = {
        id: localStore._nextProductId++,
        name,
        price: parseFloat(price),
        image: image || '',
        description: description || '',
      };
      localStore.products.push(newProduct);
      return res.json({ data: newProduct });
    }

    // Use admin client to bypass RLS if available
    const client = supabaseAdmin || supabase;
    const { data, error } = await client
      .from('products')
      .insert([{ name, price: parseFloat(price), image: image || '', description: description || '' }])
      .select();

    if (error) {
      console.error('Supabase error creating product:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ data: data[0] });
  } catch (err) {
    console.error('Error in POST /api/admin/products:', err);
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, image, description } = req.body;

    if (!name || !price || isNaN(parseFloat(price))) {
      return res.status(400).json({ error: 'Invalid product data' });
    }

    if (!supabase) {
      const pid = parseInt(id, 10);
      const product = localStore.products.find((p) => p.id === pid);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      product.name = name;
      product.price = parseFloat(price);
      product.image = image || '';
      product.description = description || '';
      return res.json({ data: product });
    }

    const { data, error } = await (supabaseAdmin || supabase)
      .from('products')
      .update({ name, price: parseFloat(price), image: image || '', description: description || '' })
      .eq('id', parseInt(id))
      .select();

    if (error) {
      console.error('Supabase error updating product:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ data: data[0] });
  } catch (err) {
    console.error('Error in PATCH /api/admin/products/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/products/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!supabase) {
      const pid = parseInt(id, 10);
      const initial = localStore.products.length;
      localStore.products = localStore.products.filter((p) => p.id !== pid);
      return res.json({ success: localStore.products.length !== initial });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      console.error('Supabase error deleting product:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error in DELETE /api/admin/products/:id:', err);
    res.status(500).json({ error: err.message });
  }
});

// Orders endpoint
app.get('/api/admin/orders', authMiddleware, async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ data: localStore.orders });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching orders:', error);
      return res.status(400).json({ error: error.message });
    }

    res.json({ data: data || [] });
  } catch (err) {
    console.error('Error in GET /api/admin/orders:', err);
    res.status(500).json({ error: err.message });
  }
});

console.log('About to start listening on port', PORT);
const server = app.listen(PORT, 'localhost', () => {
  console.log(`✓ M Cafe Admin Server running on http://localhost:${PORT}`);
  console.log('✓ Ready to accept connections');
});

server.on('error', (err) => {
  console.error('✗ Server error:', err);
});

server.on('listening', () => {
  console.log('✓ Server is listening on port', PORT);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('✓ SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✓ Server closed');
    process.exit(0);
  });
});
