/*
  # Sri Sai Natural Foods - Full Schema

  ## New Tables
  - `profiles` - Customer accounts linked to auth.users
  - `categories` - Product categories (Oils, Millets, etc.)
  - `products` - Product catalog with images, prices
  - `cart_items` - Shopping cart (guest + user)
  - `wishlist_items` - Customer wishlist
  - `orders` - Order records
  - `order_items` - Individual line items per order
  - `coupons` - Discount coupon codes
  - `testimonials` - Customer reviews
  - `offer_banners` - Promotional banners

  ## Security
  - RLS enabled on all tables
  - Customers can only access their own data
  - Admin role check via profiles.role
*/

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  phone text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  role text DEFAULT 'customer',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are public"
  ON categories FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  category_id uuid REFERENCES categories(id),
  price numeric(10,2) NOT NULL DEFAULT 0,
  original_price numeric(10,2),
  unit text DEFAULT '500g',
  stock int DEFAULT 100,
  image_url text DEFAULT '',
  images text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are public"
  ON products FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  quantity int DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wishlist"
  ON wishlist_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own wishlist"
  ON wishlist_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own wishlist"
  ON wishlist_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  order_number text UNIQUE NOT NULL,
  status text DEFAULT 'pending',
  payment_method text DEFAULT 'cod',
  payment_status text DEFAULT 'pending',
  subtotal numeric(10,2) DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  delivery_charge numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  coupon_code text DEFAULT '',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text DEFAULT '',
  delivery_address text NOT NULL,
  delivery_city text DEFAULT 'Hyderabad',
  delivery_pincode text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id),
  product_name text NOT NULL,
  product_image text DEFAULT '',
  price numeric(10,2) NOT NULL,
  quantity int NOT NULL,
  subtotal numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can insert order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
    )
  );

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_type text DEFAULT 'percentage',
  discount_value numeric(10,2) NOT NULL,
  min_order_value numeric(10,2) DEFAULT 0,
  max_uses int DEFAULT 100,
  used_count int DEFAULT 0,
  is_active boolean DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage coupons"
  ON coupons FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update coupons"
  ON coupons FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text DEFAULT '',
  rating int DEFAULT 5,
  review text NOT NULL,
  image_url text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active testimonials are public"
  ON testimonials FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage testimonials"
  ON testimonials FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update testimonials"
  ON testimonials FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Offer Banners
CREATE TABLE IF NOT EXISTS offer_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text DEFAULT '',
  cta_text text DEFAULT 'Shop Now',
  cta_link text DEFAULT '/shop',
  image_url text DEFAULT '',
  bg_color text DEFAULT '#2d6a4f',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE offer_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active banners are public"
  ON offer_banners FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage banners"
  ON offer_banners FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update banners"
  ON offer_banners FOR UPDATE TO authenticated
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
