import { useEffect, useState } from 'react';
import { Package, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import type { Order } from '../types';

interface OrdersPageProps {
  onNavigate: (page: string) => void;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  shipped: 'bg-forest-100 text-forest-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage({ onNavigate }: OrdersPageProps) {
  const { user } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { onNavigate('login'); return; }
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      setOrders((data || []) as Order[]);
      setLoading(false);
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-forest-600 animate-spin">
          <Package className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Package className="w-10 h-10 text-forest-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button onClick={() => onNavigate('shop')} className="btn-primary">Shop Now</button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="card overflow-hidden">
                <div
                  className="p-5 flex flex-wrap items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-mono font-bold text-sm text-forest-700">#{order.order_number}</span>
                      <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'} capitalize`}>
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {order.delivery_city}
                      </span>
                      <span>{order.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-forest-700 text-lg">₹{order.total}</span>
                    {expanded === order.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>

                {expanded === order.id && (
                  <div className="border-t border-gray-100 p-5 animate-slide-down">
                    <div className="space-y-3 mb-4">
                      {order.order_items?.map(item => (
                        <div key={item.id} className="flex items-center gap-3">
                          {item.product_image && (
                            <img src={item.product_image} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover" />
                          )}
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-700">{item.product_name}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</div>
                          </div>
                          <div className="text-sm font-semibold text-forest-700">₹{item.subtotal}</div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-3 grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                      <div>
                        <div className="font-medium text-gray-700 mb-1">Delivery Address</div>
                        <div>{order.delivery_address}</div>
                        <div>{order.delivery_city} {order.delivery_pincode}</div>
                      </div>
                      <div className="text-right sm:text-left">
                        <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
                        <div className="flex justify-between"><span>Delivery</span><span>{order.delivery_charge === 0 ? 'FREE' : `₹${order.delivery_charge}`}</span></div>
                        <div className="flex justify-between font-bold text-gray-800 mt-1 pt-1 border-t border-gray-100">
                          <span>Total</span><span className="text-forest-700">₹{order.total}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
