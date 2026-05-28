import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingBag, Tag, Plus, Edit2, Trash2,
  ChevronDown, X, Save, Loader, TrendingUp, Users, DollarSign
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import type { Product, Category, Order } from '../types';

interface AdminPageProps {
  onNavigate: (page: string) => void;
}

type AdminTab = 'dashboard' | 'products' | 'orders' | 'categories';

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { isAdmin, user } = useApp();
  const [tab, setTab] = useState<AdminTab>('dashboard');

  useEffect(() => {
    if (!user) { onNavigate('login'); return; }
  }, [user]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Admin Access Required</h2>
          <p className="text-gray-500 mb-4">You don't have permission to access this page.</p>
          <button onClick={() => onNavigate('home')} className="btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { key: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { key: 'categories', label: 'Categories', icon: <Tag className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-forest-600" /> Admin Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.key ? 'bg-forest-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {tab === 'dashboard' && <AdminDashboard />}
        {tab === 'products' && <AdminProducts />}
        {tab === 'orders' && <AdminOrders />}
        {tab === 'categories' && <AdminCategories />}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0, customers: 0 });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const [orderRes, prodRes] = await Promise.all([
        supabase.from('orders').select('total, user_id'),
        supabase.from('products').select('id', { count: 'exact' }),
      ]);
      const orders = orderRes.data || [];
      const revenue = orders.reduce((s: number, o: { total: number }) => s + (o.total || 0), 0);
      const uniqueCustomers = new Set(orders.map((o: { user_id: string }) => o.user_id)).size;
      setStats({ orders: orders.length, revenue, products: prodRes.count || 0, customers: uniqueCustomers });

      const { data: recent } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5);
      setRecentOrders((recent || []) as Order[]);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: <ShoppingBag className="w-6 h-6 text-earth-600" />, color: 'bg-earth-50' },
    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <DollarSign className="w-6 h-6 text-forest-600" />, color: 'bg-forest-50' },
    { label: 'Products', value: stats.products, icon: <Package className="w-6 h-6 text-gold-600" />, color: 'bg-gold-50' },
    { label: 'Customers', value: stats.customers, icon: <Users className="w-6 h-6 text-blue-600" />, color: 'bg-blue-50' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    shipped: 'bg-forest-100 text-forest-700',
  };

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${s.color} rounded-xl flex items-center justify-center shrink-0`}>{s.icon}</div>
            <div>
              <div className="text-xl font-bold text-gray-800">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-forest-600" /> Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 text-gray-500 font-medium">Order #</th>
                <th className="text-left py-2 text-gray-500 font-medium">Customer</th>
                <th className="text-left py-2 text-gray-500 font-medium">Total</th>
                <th className="text-left py-2 text-gray-500 font-medium">Status</th>
                <th className="text-left py-2 text-gray-500 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 font-mono text-forest-700">{o.order_number}</td>
                  <td className="py-3 text-gray-700">{o.customer_name}</td>
                  <td className="py-3 font-semibold text-forest-700">₹{o.total}</td>
                  <td className="py-3">
                    <span className={`badge capitalize ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-gray-400">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);

  const emptyForm: Partial<Product> = {
    name: '', slug: '', description: '', category_id: '',
    price: 0, original_price: undefined, unit: '500g',
    stock: 100, image_url: '', is_featured: false, is_active: true,
  };

  const [form, setForm] = useState<Partial<Product>>(emptyForm);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    const [pRes, cRes] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    setProducts((pRes.data || []) as unknown as Product[]);
    setCategories((cRes.data || []) as Category[]);
  }

  const openEdit = (p: Product) => {
    setEditProduct(p);
    setForm({ ...p });
    setShowForm(true);
  };

  const openNew = () => {
    setEditProduct(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category_id) {
      alert('Please fill in all required fields: Name, Price, and Category');
      return;
    }
    setSaving(true);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const payload = {
      name: form.name,
      slug: form.slug || slug,
      description: form.description || '',
      category_id: form.category_id,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      unit: form.unit || '500g',
      stock: Number(form.stock) || 0,
      image_url: form.image_url || '',
      is_featured: form.is_featured || false,
      is_active: form.is_active !== false,
    };

    let error;
    if (editProduct?.id) {
      const result = await supabase.from('products').update(payload).eq('id', editProduct.id);
      error = result.error;
    } else {
      const result = await supabase.from('products').insert(payload);
      error = result.error;
    }

    if (error) {
      alert('Error saving product: ' + error.message);
      setSaving(false);
      return;
    }

    await loadAll();
    setShowForm(false);
    setSaving(false);
    alert('Product saved successfully!');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    await loadAll();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-semibold text-gray-800">Products ({products.length})</h2>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 text-sm py-2">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-semibold">{editProduct ? 'Edit Product' : 'New Product'}</h3>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select value={form.category_id || ''} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))} className="input text-sm">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm(p => ({ ...p, price: Number(e.target.value) }))} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                  <input type="number" value={form.original_price || ''} onChange={e => setForm(p => ({ ...p, original_price: Number(e.target.value) || undefined }))} className="input text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input value={form.unit || ''} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="input text-sm" placeholder="500g / 1 Litre" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input type="number" value={form.stock || ''} onChange={e => setForm(p => ({ ...p, stock: Number(e.target.value) }))} className="input text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input value={form.image_url || ''} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} className="input text-sm" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input text-sm resize-none" />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_featured || false} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="accent-forest-600 w-4 h-4" />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="accent-forest-600 w-4 h-4" />
                  Active
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="flex-1 btn-ghost border border-gray-200">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Product</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Price</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Stock</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image_url} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div className="font-medium text-gray-800 line-clamp-1">{p.name}</div>
                        <div className="text-xs text-gray-500">{p.unit}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{(p.category as unknown as { name: string })?.name}</td>
                  <td className="px-4 py-3 font-semibold text-forest-700">₹{p.price}</td>
                  <td className="px-4 py-3 text-gray-600">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-forest-600 hover:bg-forest-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-gray-400">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { loadOrders(); }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders((data || []) as Order[]);
  }

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    await loadOrders();
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-orange-100 text-orange-700',
    shipped: 'bg-forest-100 text-forest-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-5">All Orders ({orders.length})</h2>
      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="card overflow-hidden">
            <div
              className="flex flex-wrap gap-4 items-center px-5 py-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
            >
              <div className="font-mono font-bold text-forest-700 text-sm">{o.order_number}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800">{o.customer_name}</div>
                <div className="text-xs text-gray-500">{o.customer_phone}</div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-bold text-forest-700">₹{o.total}</span>
                <select
                  value={o.status}
                  onChange={e => { e.stopPropagation(); updateStatus(o.id, e.target.value); }}
                  onClick={e => e.stopPropagation()}
                  className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}
                >
                  {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${expandedId === o.id ? 'rotate-180' : ''}`} />
              </div>
            </div>
            {expandedId === o.id && (
              <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 animate-slide-down">
                <div className="grid sm:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Delivery Address</div>
                    <div className="text-gray-600">{o.delivery_address}</div>
                    <div className="text-gray-600">{o.delivery_city} {o.delivery_pincode}</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-700 mb-1">Payment</div>
                    <div className="text-gray-600">{o.payment_method === 'cod' ? 'Cash on Delivery' : 'UPI'}</div>
                    <div className={`text-xs mt-1 ${o.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                      {o.payment_status}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {o.order_items?.map(item => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      {item.product_image && <img src={item.product_image} alt={item.product_name} className="w-10 h-10 rounded-lg object-cover" />}
                      <div className="flex-1">{item.product_name} × {item.quantity}</div>
                      <div className="font-semibold text-forest-700">₹{item.subtotal}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        {orders.length === 0 && (
          <div className="card py-12 text-center text-gray-400">No orders yet</div>
        )}
      </div>
    </div>
  );
}

function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories((data || []) as Category[]);
    });
  }, []);

  return (
    <div>
      <h2 className="font-semibold text-gray-800 mb-5">Categories ({categories.length})</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(c => (
          <div key={c.id} className="card p-4 flex items-center gap-4">
            <img src={c.image_url} alt={c.name} className="w-14 h-14 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-800 truncate">{c.name}</div>
              <div className="text-xs text-gray-500 truncate">{c.slug}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
