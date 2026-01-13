## Order Deletion Troubleshooting Guide

If orders are not being deleted, follow these steps:

### Step 1: Verify RLS Policies
Run `fix-orders-delete.sql` in your Supabase SQL Editor to ensure all RLS policies are in place:
- INSERT policy ✓
- SELECT policy ✓
- DELETE policy ✓
- UPDATE policy ✓

### Step 2: Check Browser Console
1. Open admin dashboard
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Try to delete an order
5. Look for error messages that appear

### Step 3: Verify Column Existence
Run `add-delivery-payment-columns.sql` to ensure the database has the new columns.

### Step 4: Check Order ID Format
The order ID must be an integer or UUID. Verify in your database that IDs are stored correctly:
```sql
SELECT id, customer_name, created_at FROM orders LIMIT 5;
```

### Step 5: Manual Delete Test
Test if delete works directly in Supabase:
1. Go to Supabase → Table Editor
2. Find the orders table
3. Try to delete a test order manually
4. If this works, the app issue is code-related
5. If this fails, the issue is RLS-related

### Step 6: Check Order ID Type
If order IDs are UUIDs, ensure the delete code uses string comparison correctly.

### Error Messages to Look For:
- "Supabase not initialized" → Need to refresh page
- "RLS policy violation" → Need to run fix-orders-delete.sql
- "Column not found" → Need to run add-delivery-payment-columns.sql
- "No rows affected" → Order ID might not exist

### Console Logging
When you click Delete, look for these console messages:
1. "Attempting to delete order: [ID]" - delete started
2. "Delete error: ..." - if there's an error
3. "Order deleted from database" - if successful
4. "deleteOrder error: ..." - catch block error

### Quick Fix Checklist:
- [ ] Run fix-orders-delete.sql
- [ ] Run add-delivery-payment-columns.sql
- [ ] Refresh admin page (F5)
- [ ] Check browser console (F12)
- [ ] Try deleting a test order
- [ ] Check server logs if running locally
