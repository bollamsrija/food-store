import { Trash2, ShoppingBag, ArrowRight, Plus, Minus, Tag } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { Coupon } from '../types';

interface CartPageProps {
  onNavigate: (page: string) => void;
}

export default function CartPage({ onNavigate }: CartPageProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, showToast } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const discount = appliedCoupon
    ? appliedCoupon.discount_type === 'percentage'
      ? (cartTotal * appliedCoupon.discount_value) / 100
      : appliedCoupon.discount_value
    : 0;
  const deliveryCharge = cartTotal >= 999 ? 0 : 60;
  const finalTotal = cartTotal - discount + deliveryCharge;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    const { data } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .maybeSingle();

    if (!data) {
      showToast('Invalid or expired coupon code', 'error');
    } else if (cartTotal < data.min_order_value) {
      showToast(`Minimum order of ₹${data.min_order_value} required`, 'error');
    } else {
      setAppliedCoupon(data as Coupon);
      showToast(`Coupon applied! You save ₹${data.discount_type === 'percentage' ? Math.round(cartTotal * data.discount_value / 100) : data.discount_value}`);
    }
    setCouponLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-24 h-24 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-forest-300" />
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Add some natural goodness to your cart!</p>
          <button onClick={() => onNavigate('shop')} className="btn-primary">
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">Shopping Cart ({cart.length} items)</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="card p-4 flex gap-4 animate-fade-in">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onNavigate(`product:${item.product.slug}`)}
                />
                <div className="flex-1 min-w-0">
                  <div
                    className="font-semibold text-gray-800 text-sm leading-snug mb-0.5 cursor-pointer hover:text-forest-700 line-clamp-2"
                    onClick={() => onNavigate(`product:${item.product.slug}`)}
                  >
                    {item.product.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{item.product.unit}</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-bold text-forest-700">₹{(item.product.price * item.quantity).toFixed(0)}</span>
                    <button
                      onClick={() => { removeFromCart(item.product.id); showToast('Item removed', 'info'); }}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div>
            <div className="card p-5 sticky top-24">
              <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>-₹{discount.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                  </span>
                </div>
                {deliveryCharge > 0 && (
                  <div className="text-xs text-forest-600 bg-forest-50 p-2 rounded-lg">
                    Add ₹{(999 - cartTotal).toFixed(0)} more for free delivery
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 text-base border-t border-gray-100 pt-2 mt-2">
                  <span>Total</span>
                  <span className="text-forest-700">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>

              {/* Coupon */}
              {!appliedCoupon ? (
                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                      className="input pl-9 py-2 text-sm"
                    />
                  </div>
                  <button
                    onClick={applyCoupon}
                    disabled={couponLoading}
                    className="btn-outline py-2 px-4 text-sm"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <Tag className="w-4 h-4" />
                    <span className="font-semibold">{appliedCoupon.code}</span>
                  </div>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }} className="text-gray-400 hover:text-red-500">
                    ×
                  </button>
                </div>
              )}

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full btn-ghost mt-2 text-sm text-center"
              >
                Continue Shopping
              </button>

              {/* Sample coupons hint */}
              <div className="mt-4 p-3 bg-warm-50 rounded-xl text-xs text-gray-500">
                <div className="font-medium text-gray-600 mb-1.5">Available Coupons:</div>
                <div className="space-y-1">
                  <div><code className="bg-white px-1 rounded text-forest-700 font-mono">WELCOME10</code> — 10% off on ₹500+</div>
                  <div><code className="bg-white px-1 rounded text-forest-700 font-mono">FIRST50</code> — ₹50 off on ₹800+</div>
                  <div><code className="bg-white px-1 rounded text-forest-700 font-mono">HEALTH20</code> — 20% off on ₹1500+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
