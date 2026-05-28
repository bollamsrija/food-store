import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { LocalCartItem, Product, Profile } from '../types';
import type { User } from '@supabase/supabase-js';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextValue {
  user: User | null;
  profile: Profile | null;
  cart: LocalCartItem[];
  wishlist: string[];
  toasts: Toast[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toggleWishlist: (productId: string) => void;
  showToast: (message: string, type?: Toast['type']) => void;
  isAdmin: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cart, setCart] = useState<LocalCartItem[]>(() => {
    try {
      const saved = localStorage.getItem('srisai_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('srisai_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
    if (data) setProfile(data as Profile);
  }

  useEffect(() => {
    localStorage.setItem('srisai_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('srisai_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + quantity, 20) }
            : i
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(i => i.product.id === productId ? { ...i, quantity: Math.min(quantity, 20) } : i)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const isAdmin = profile?.role === 'admin';

  return (
    <AppContext.Provider value={{
      user, profile, cart, wishlist, toasts,
      addToCart, removeFromCart, updateQuantity, clearCart,
      cartTotal, cartCount, toggleWishlist, showToast, isAdmin,
    }}>
      {children}
      <ToastContainer toasts={toasts} />
    </AppContext.Provider>
  );
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  if (!toasts.length) return null;
  return (
    <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast-enter px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium max-w-xs pointer-events-auto ${
            t.type === 'success' ? 'bg-forest-600' :
            t.type === 'error' ? 'bg-red-500' : 'bg-earth-600'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
