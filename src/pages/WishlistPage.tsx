import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useApp } from '../context/AppContext';
import type { Product } from '../types';
import ProductCard from '../components/ProductCard';

interface WishlistPageProps {
  onNavigate: (page: string) => void;
}

export default function WishlistPage({ onNavigate }: WishlistPageProps) {
  const { wishlist } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wishlist.length === 0) { setProducts([]); return; }
    setLoading(true);
    supabase
      .from('products')
      .select('*, category:categories(*)')
      .in('id', wishlist)
      .then(({ data }) => {
        setProducts((data || []) as unknown as Product[]);
        setLoading(false);
      });
  }, [wishlist]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="section-title mb-2">Wishlist</h1>
        <p className="section-subtitle mb-8">{wishlist.length} saved items</p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />)}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="w-10 h-10 text-red-200" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Save products you love and come back to them anytime</p>
            <button onClick={() => onNavigate('shop')} className="btn-primary">Browse Products</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} onNavigate={onNavigate} />)}
          </div>
        )}
      </div>
    </div>
  );
}
