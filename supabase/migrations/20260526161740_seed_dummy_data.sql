/*
  # Seed Dummy Data

  Inserts:
  - 6 product categories
  - 24 products across all categories
  - 4 testimonials
  - 2 offer banners
  - 3 sample coupons
*/

-- Categories
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
  ('Cold Pressed Oils', 'cold-pressed-oils', 'Pure cold-pressed oils extracted without heat for maximum nutrition', 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg', 1),
  ('Millets', 'millets', 'Ancient grains packed with nutrition and fiber', 'https://images.pexels.com/photos/7421245/pexels-photo-7421245.jpeg', 2),
  ('Dry Fruits', 'dry-fruits', 'Premium quality dry fruits and nuts', 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', 3),
  ('Spices', 'spices', 'Fresh ground and whole spices for authentic flavors', 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg', 4),
  ('Organic Grocery', 'organic-grocery', 'Certified organic grocery staples', 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', 5),
  ('Healthy Snacks', 'healthy-snacks', 'Guilt-free natural snacks for every craving', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', 6)
ON CONFLICT (slug) DO NOTHING;

-- Products (Cold Pressed Oils)
INSERT INTO products (name, slug, description, category_id, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Cold Pressed Groundnut Oil', 'cold-pressed-groundnut-oil', 'Pure wood-churned groundnut oil. Rich in vitamin E and monounsaturated fats. Zero chemicals, zero heat treatment.', (SELECT id FROM categories WHERE slug='cold-pressed-oils'), 320, 380, '1 Litre', 150, 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg', true, ARRAY['oil','groundnut','cold-pressed']),
  ('Cold Pressed Sesame Oil', 'cold-pressed-sesame-oil', 'Traditional gingelly oil cold pressed to retain all natural goodness. Perfect for cooking and skin care.', (SELECT id FROM categories WHERE slug='cold-pressed-oils'), 350, 420, '500 ml', 120, 'https://images.pexels.com/photos/4110226/pexels-photo-4110226.jpeg', true, ARRAY['oil','sesame','cold-pressed']),
  ('Cold Pressed Coconut Oil', 'cold-pressed-coconut-oil', 'Virgin coconut oil extracted from fresh coconut milk. Ideal for cooking, hair and skin.', (SELECT id FROM categories WHERE slug='cold-pressed-oils'), 380, 450, '500 ml', 100, 'https://images.pexels.com/photos/1556706/pexels-photo-1556706.jpeg', true, ARRAY['oil','coconut','virgin']),
  ('Cold Pressed Mustard Oil', 'cold-pressed-mustard-oil', 'Pungent and flavourful kachi ghani mustard oil. Traditional recipe for authentic taste.', (SELECT id FROM categories WHERE slug='cold-pressed-oils'), 280, 320, '1 Litre', 80, 'https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg', false, ARRAY['oil','mustard','kachi-ghani'])
ON CONFLICT (slug) DO NOTHING;

-- Products (Millets)
INSERT INTO products (name, slug, description, category_id, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Foxtail Millet (Korralu)', 'foxtail-millet', 'Rich in iron and fiber. Great substitute for rice. Supports weight management.', (SELECT id FROM categories WHERE slug='millets'), 120, 150, '1 kg', 200, 'https://images.pexels.com/photos/7421245/pexels-photo-7421245.jpeg', true, ARRAY['millet','korralu','gluten-free']),
  ('Pearl Millet (Sajja)', 'pearl-millet', 'High protein and iron content. Traditional Telangana staple grain.', (SELECT id FROM categories WHERE slug='millets'), 90, 110, '1 kg', 180, 'https://images.pexels.com/photos/7421245/pexels-photo-7421245.jpeg', false, ARRAY['millet','sajja','iron-rich']),
  ('Finger Millet (Ragi)', 'finger-millet-ragi', 'Excellent calcium source. Perfect for porridge, roti and health drinks.', (SELECT id FROM categories WHERE slug='millets'), 110, 135, '1 kg', 220, 'https://images.pexels.com/photos/7421245/pexels-photo-7421245.jpeg', true, ARRAY['millet','ragi','calcium']),
  ('Little Millet (Samai)', 'little-millet-samai', 'Tiny but mighty - rich in B vitamins and antioxidants. Great for diabetes management.', (SELECT id FROM categories WHERE slug='millets'), 130, 160, '1 kg', 140, 'https://images.pexels.com/photos/7421245/pexels-photo-7421245.jpeg', false, ARRAY['millet','samai','diabetic-friendly'])
ON CONFLICT (slug) DO NOTHING;

-- Products (Dry Fruits)
INSERT INTO products (name, slug, description, category_id, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Premium Cashews', 'premium-cashews', 'Whole W320 grade cashews. Crunchy, creamy and full of healthy fats and protein.', (SELECT id FROM categories WHERE slug='dry-fruits'), 680, 780, '500 g', 100, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', true, ARRAY['cashews','dry-fruit','nuts']),
  ('Almonds (Badam)', 'almonds-badam', 'California almonds packed with vitamin E, magnesium and protein.', (SELECT id FROM categories WHERE slug='dry-fruits'), 720, 850, '500 g', 90, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', true, ARRAY['almonds','badam','vitamin-e']),
  ('Raisins (Kishmish)', 'raisins-kishmish', 'Seedless golden raisins - natural sweetener rich in iron and potassium.', (SELECT id FROM categories WHERE slug='dry-fruits'), 180, 220, '250 g', 200, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', false, ARRAY['raisins','kishmish','iron']),
  ('Walnuts', 'walnuts', 'Brain-boosting walnuts rich in omega-3 fatty acids. Great for heart health.', (SELECT id FROM categories WHERE slug='dry-fruits'), 480, 560, '250 g', 80, 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg', false, ARRAY['walnuts','omega3','brain-food'])
ON CONFLICT (slug) DO NOTHING;

-- Products (Spices)
INSERT INTO products (name, slug, description, category_id, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Red Chilli Powder', 'red-chilli-powder', 'Stone-ground Guntur red chilli powder. Authentic Andhra heat and color.', (SELECT id FROM categories WHERE slug='spices'), 95, 120, '250 g', 300, 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg', true, ARRAY['spice','chilli','guntur']),
  ('Turmeric Powder', 'turmeric-powder', 'Pure Erode turmeric - high curcumin content. Anti-inflammatory and medicinal.', (SELECT id FROM categories WHERE slug='spices'), 80, 100, '250 g', 250, 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg', false, ARRAY['spice','turmeric','curcumin']),
  ('Coriander Powder', 'coriander-powder', 'Freshly ground coriander seeds. Aromatic and flavorful for all curries.', (SELECT id FROM categories WHERE slug='spices'), 70, 90, '250 g', 200, 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg', false, ARRAY['spice','coriander','dhania']),
  ('Garam Masala', 'garam-masala', 'Premium blend of 11 whole spices ground to perfection. No artificial colors.', (SELECT id FROM categories WHERE slug='spices'), 120, 150, '100 g', 180, 'https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg', true, ARRAY['spice','masala','blend'])
ON CONFLICT (slug) DO NOTHING;

-- Products (Organic Grocery)
INSERT INTO products (name, slug, description, category_id, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Organic Brown Rice', 'organic-brown-rice', 'Unpolished whole grain brown rice. Higher fiber and nutrients than white rice.', (SELECT id FROM categories WHERE slug='organic-grocery'), 140, 170, '1 kg', 300, 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', true, ARRAY['rice','organic','whole-grain']),
  ('Organic Toor Dal', 'organic-toor-dal', 'Unpolished split pigeon peas. High protein organic dal with natural taste.', (SELECT id FROM categories WHERE slug='organic-grocery'), 165, 195, '1 kg', 250, 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', false, ARRAY['dal','toor','organic','protein']),
  ('Organic Jaggery', 'organic-jaggery', 'Chemical-free jaggery from organic sugarcane. Rich in iron and minerals.', (SELECT id FROM categories WHERE slug='organic-grocery'), 90, 110, '500 g', 200, 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', true, ARRAY['jaggery','organic','natural-sweetener']),
  ('Organic Chana Dal', 'organic-chana-dal', 'Split Bengal gram - versatile lentil for curries, snacks and sweets.', (SELECT id FROM categories WHERE slug='organic-grocery'), 145, 175, '1 kg', 180, 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg', false, ARRAY['dal','chana','organic'])
ON CONFLICT (slug) DO NOTHING;

-- Products (Healthy Snacks)
INSERT INTO products (name, slug, description, category_id, price, original_price, unit, stock, image_url, is_featured, tags) VALUES
  ('Roasted Mixed Nuts', 'roasted-mixed-nuts', 'A perfect blend of roasted cashews, almonds, peanuts and raisins. No added salt.', (SELECT id FROM categories WHERE slug='healthy-snacks'), 380, 450, '250 g', 150, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', true, ARRAY['snacks','nuts','roasted']),
  ('Millet Cookies', 'millet-cookies', 'Crispy cookies made with ragi and jowar flour. Sugar-free and guilt-free.', (SELECT id FROM categories WHERE slug='healthy-snacks'), 150, 180, '200 g', 120, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', false, ARRAY['snacks','cookies','millet','sugar-free']),
  ('Trail Mix', 'trail-mix', 'Energy-boosting trail mix with seeds, berries and nuts. Perfect for on-the-go.', (SELECT id FROM categories WHERE slug='healthy-snacks'), 220, 270, '200 g', 100, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', true, ARRAY['snacks','trail-mix','energy']),
  ('Flaxseed Chikki', 'flaxseed-chikki', 'Traditional jaggery chikki with omega-3 rich flaxseeds. Natural energy bar.', (SELECT id FROM categories WHERE slug='healthy-snacks'), 120, 150, '150 g', 180, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', false, ARRAY['snacks','chikki','flaxseed','jaggery'])
ON CONFLICT (slug) DO NOTHING;

-- Testimonials
INSERT INTO testimonials (name, location, rating, review, image_url, is_active) VALUES
  ('Priya Sharma', 'Kukatpally, Hyderabad', 5, 'Absolutely love the cold pressed oils from Sri Sai! The groundnut oil tastes exactly like what my grandmother used to make. Pure and unadulterated!', 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg', true),
  ('Ravi Kumar', 'KPHB Colony, Hyderabad', 5, 'Been buying millets and dry fruits for 2 years now. Quality is consistently excellent and prices are very reasonable. Highly recommend to everyone!', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg', true),
  ('Lakshmi Devi', 'Miyapur, Hyderabad', 5, 'The spices here are so fresh and aromatic! My cooking has transformed since I started using their red chilli powder and garam masala. Superb quality!', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg', true),
  ('Suresh Reddy', 'JNTU Area, Hyderabad', 5, 'Great organic store! Fast delivery and products are always fresh. The WhatsApp ordering is so convenient. Will keep ordering regularly.', 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg', true)
ON CONFLICT DO NOTHING;

-- Offer Banners
INSERT INTO offer_banners (title, subtitle, cta_text, cta_link, bg_color, is_active, sort_order) VALUES
  ('Festival Special Offer', 'Get 20% off on all Cold Pressed Oils this Diwali!', 'Shop Now', '/shop?category=cold-pressed-oils', '#2d6a4f', true, 1),
  ('New Millet Collection', 'Explore our premium range of ancient grains for healthy living', 'Discover Millets', '/shop?category=millets', '#a0522d', true, 2)
ON CONFLICT DO NOTHING;

-- Coupons
INSERT INTO coupons (code, discount_type, discount_value, min_order_value, max_uses, is_active) VALUES
  ('WELCOME10', 'percentage', 10, 500, 1000, true),
  ('FIRST50', 'flat', 50, 800, 500, true),
  ('HEALTH20', 'percentage', 20, 1500, 200, true)
ON CONFLICT (code) DO NOTHING;
