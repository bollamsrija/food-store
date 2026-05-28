import { useState } from 'react';
import { CreditCard, Smartphone, Truck, CheckCircle, MessageCircle, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

interface CheckoutPageProps {
  onNavigate: (page: string) => void;
}

type PaymentMethod = 'cod' | 'upi';

export default function CheckoutPage({ onNavigate }: CheckoutPageProps) {
  const { cart, cartTotal, clearCart, user, profile, showToast } = useApp();
  const deliveryCharge = cartTotal >= 999 ? 0 : 60;
  const finalTotal = cartTotal + deliveryCharge;

  const [form, setForm] = useState({
    name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
    address: profile?.address || '',
    city: profile?.city || 'Hyderabad',
    pincode: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    if (!form.name.trim()) { showToast('Please enter your name', 'error'); return false; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { showToast('Enter a valid 10-digit phone number', 'error'); return false; }
    if (!form.address.trim()) { showToast('Please enter delivery address', 'error'); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) { showToast('Your cart is empty', 'error'); return; }
    setSubmitting(true);

    const num = `SSNF${Date.now().toString().slice(-8)}`;

    const { data: order, error } = await supabase.from('orders').insert({
      user_id: user?.id || null,
      order_number: num,
      status: 'pending',
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: cartTotal,
      discount: 0,
      delivery_charge: deliveryCharge,
      total: finalTotal,
      customer_name: form.name,
      customer_phone: form.phone,
      customer_email: form.email,
      delivery_address: form.address,
      delivery_city: form.city,
      delivery_pincode: form.pincode,
      notes: form.notes,
    }).select().maybeSingle();

    if (error || !order) {
      showToast('Order failed. Please try again.', 'error');
      setSubmitting(false);
      return;
    }

    await supabase.from('order_items').insert(
      cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.image_url,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }))
    );

    setOrderNumber(num);
    clearCart();
    setSuccess(true);
    setSubmitting(false);
  };

  if (success) {
    const waMsg = encodeURIComponent(`Hi Sri Sai Natural Foods! I just placed an order.\n\n*Order #${orderNumber}*\n\nItems:\n${cart.map(i => `• ${i.product.name} x${i.quantity} = ₹${i.product.price * i.quantity}`).join('\n')}\n\n*Total: ₹${finalTotal}*\n*Payment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}*\n*Address: ${form.address}, ${form.city}*`);

    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Order Placed!</h1>
          <p className="text-gray-500 mb-2">Your order has been successfully placed.</p>
          <div className="bg-forest-50 border border-forest-200 rounded-xl px-6 py-3 mb-6 inline-block">
            <div className="text-sm text-gray-500">Order Number</div>
            <div className="font-mono font-bold text-forest-700 text-xl">{orderNumber}</div>
          </div>

          <div className="card p-5 text-left mb-6 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span><span className={deliveryCharge === 0 ? 'text-green-600' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-2">
                <span>Total Paid</span><span className="text-forest-700">₹{finalTotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment</span><span>{paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Deliver to</span><span className="text-right max-w-xs">{form.address}, {form.city}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`https://wa.me/919876543210?text=${waMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Confirm on WhatsApp
            </a>
            {user && (
              <button onClick={() => onNavigate('orders')} className="btn-outline">
                Track My Orders
              </button>
            )}
            <button onClick={() => onNavigate('home')} className="btn-ghost text-sm">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery info */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-forest-600" /> Delivery Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="input" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit mobile number" className="input" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (optional)</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="email@example.com" className="input" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address *</label>
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="House/Flat no., Street, Area" rows={2} className="input resize-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <input name="city" value={form.city} onChange={handleChange} className="input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Pincode</label>
                    <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="500072" className="input" maxLength={6} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Special Instructions (optional)</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Any special instructions for delivery..." rows={2} className="input resize-none" />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-forest-600" /> Payment Method
                </h2>
                <div className="space-y-3">
                  {([
                    { value: 'cod', icon: <Truck className="w-5 h-5 text-earth-600" />, label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'upi', icon: <Smartphone className="w-5 h-5 text-forest-600" />, label: 'UPI / QR Code', desc: 'Pay via PhonePe, GPay, Paytm' },
                  ] as const).map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === opt.value ? 'border-forest-500 bg-forest-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="accent-forest-600"
                      />
                      <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                        {opt.icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{opt.label}</div>
                        <div className="text-xs text-gray-500">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="card p-5 sticky top-24">
                <h2 className="font-semibold text-gray-800 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-hide">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex gap-3">
                      <img src={item.product.image_url} alt={item.product.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-700 line-clamp-2">{item.product.name}</div>
                        <div className="text-xs text-gray-500">×{item.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold text-forest-700 shrink-0">₹{(item.product.price * item.quantity).toFixed(0)}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span><span>₹{cartTotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                    <span>Total</span><span className="text-forest-700">₹{finalTotal.toFixed(0)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary mt-5 flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader className="w-4 h-4 animate-spin" /> Placing Order...</> : 'Place Order'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
