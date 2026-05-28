import { useState } from 'react';
import { Package, Search, CheckCircle, Truck, Clock, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

export default function TrackOrderPage() {
  const [orderNum, setOrderNum] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNum.trim()) return;
    setLoading(true);
    setNotFound(false);
    setOrder(null);

    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', orderNum.toUpperCase())
      .maybeSingle();

    if (!data || (phone && data.customer_phone !== phone)) {
      setNotFound(true);
    } else {
      setOrder(data as Order);
    }
    setLoading(false);
  };

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: <Package className="w-5 h-5" /> },
    { key: 'confirmed', label: 'Confirmed', icon: <CheckCircle className="w-5 h-5" /> },
    { key: 'processing', label: 'Processing', icon: <Clock className="w-5 h-5" /> },
    { key: 'shipped', label: 'Shipped', icon: <Truck className="w-5 h-5" /> },
    { key: 'delivered', label: 'Delivered', icon: <MapPin className="w-5 h-5" /> },
  ];

  const statusIndex = order ? steps.findIndex(s => s.key === order.status) : -1;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="section-title mb-2">Track Your Order</h1>
          <p className="section-subtitle">Enter your order number to track status</p>
        </div>

        <div className="card p-6 mb-8">
          <form onSubmit={search} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Number *</label>
              <input
                type="text"
                value={orderNum}
                onChange={e => setOrderNum(e.target.value.toUpperCase())}
                placeholder="e.g. SSNF12345678"
                className="input font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number (optional, for verification)</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="input"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
              <Search className="w-4 h-4" />
              {loading ? 'Searching...' : 'Track Order'}
            </button>
          </form>
        </div>

        {notFound && (
          <div className="card p-6 text-center animate-fade-in">
            <div className="text-4xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-700 mb-1">Order Not Found</h3>
            <p className="text-gray-500 text-sm">Please check your order number and try again</p>
          </div>
        )}

        {order && (
          <div className="animate-fade-in space-y-6">
            {/* Status timeline */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="font-mono font-bold text-forest-700">#{order.order_number}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <span className={`badge text-sm px-3 py-1 capitalize ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-forest-100 text-forest-700'
                }`}>
                  {order.status}
                </span>
              </div>

              {order.status !== 'cancelled' && (
                <div className="relative flex justify-between mb-2">
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-forest-600 transition-all duration-500"
                    style={{ width: `${Math.max(0, statusIndex / (steps.length - 1)) * 100}%` }}
                  />
                  {steps.map((step, i) => (
                    <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        i <= statusIndex ? 'bg-forest-600 text-white shadow-green' : 'bg-white border-2 border-gray-200 text-gray-400'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-xs font-medium hidden sm:block ${i <= statusIndex ? 'text-forest-700' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order details */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>
              <div className="space-y-3 mb-5">
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex items-center gap-3">
                    {item.product_image && (
                      <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700">{item.product_name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</div>
                    </div>
                    <div className="text-sm font-semibold text-forest-700">₹{item.subtotal}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span></div>
                <div className="flex justify-between font-bold text-gray-800 pt-1 border-t border-gray-100">
                  <span>Total</span><span className="text-forest-700">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
