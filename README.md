# M Cafe - Cake Sale

A complete mobile-responsive cake ordering platform with Tailwind CSS, React, Supabase backend, and a Node.js admin proxy server.

## Features

- **Landing Page** (`index.html`) — Browse cakes, search, add to cart (persists via localStorage)
- **Checkout** — Enter name, special requests, share geolocation, place orders via WhatsApp
- **Admin Dashboard** (`admin.html`) — Manage products and view order history (server-authenticated)
- **Node.js Backend** (`server.js`) — Secure admin authentication, product/order management

## Setup

### 1. Supabase Configuration

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, create two tables:
   - **products**: id (pk), name (text), price (numeric), image (text), created_at (timestamp)
   - **orders**: id (pk), items (text/json), total (numeric), customer_name (text), requests (text), location (text), created_at (timestamp)
3. Copy your project URL and anon key

### 2. Node.js Server Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   ADMIN_PASSWORD=your-secure-password
   PORT=3000
   ```

3. Install dependencies and start:
   ```bash
   npm install
   npm start
   ```

### 3. Configure Client (index.html & admin.html)

Before opening the pages, add this `<script>` to the `<head>` (or set these before loading):

```html
<script>
  window.SUPABASE_URL = 'https://your-project.supabase.co';
  window.SUPABASE_ANON_KEY = 'your-anon-key';
  window.API_URL = 'http://localhost:3000'; // or your server URL
</script>
```

## Usage

- **Landing Page**: Open `index.html` in your browser
  - Add cakes to cart → Checkout → Share Location → Place Order via WhatsApp

- **Admin Dashboard**: Open `admin.html` → Enter admin password → Manage products & view orders

## Files

- `index.html` — Main landing page (React + Tailwind)
- `admin.html` — Admin dashboard (React + Tailwind)
- `server.js` — Node.js backend (Express + Supabase)
- `supabase-init.js` — Supabase client initialization
- `package.json` — Node dependencies
- `.env.example` — Environment variables template
