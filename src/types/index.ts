export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_id: string;
  category?: Category;
  price: number;
  original_price: number | null;
  unit: string;
  stock: number;
  image_url: string;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  quantity: number;
}

export interface LocalCartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: 'cod' | 'upi' | 'razorpay';
  payment_status: 'pending' | 'paid' | 'failed';
  subtotal: number;
  discount: number;
  delivery_charge: number;
  total: number;
  coupon_code: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_address: string;
  delivery_city: string;
  delivery_pincode: string;
  notes: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  role: 'customer' | 'admin';
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  review: string;
  image_url: string;
}

export interface OfferBanner {
  id: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
  bg_color: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_value: number;
}
