import { useEffect, useState } from 'react';
import { Heart, ShoppingCart, Zap, ArrowLeft, Star, Shield, Truck, Leaf, MessageCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';
import ProductCard from '../components/ProductCard';

interface ProductPageProps {
  slug: string;
  onNavigate: (page: string) => void;
}

export default function ProductPage({ slug, onNavigate }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart, toggleWishlist, wishlist, showToast } = useApp();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (data) {
        setProduct(data as unknown as Product);
        const { data: rel } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('category_id', data.category_id)
          .neq('id', data.id)
          .limit(4);
        setRelated((rel || []) as unknown as Product[]);
      }
      setLoading(false);
    }
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 animate-pulse">
            <div className="bg-gray-200 rounded-2xl h-96" />
            <div className="space-y-4">
              <div className="bg-gray-200 h-6 rounded w-1/3" />
              <div className="bg-gray-200 h-8 rounded w-3/4" />
              <div className="bg-gray-200 h-6 rounded w-1/4" />
              <div className="bg-gray-200 h-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
          <button onClick={() => onNavigate('shop')} className="btn-primary mt-4">Back to Shop</button>
        </div>
      </div>
    );
  }

  const isWished = wishlist.includes(product.id);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const whatsappMsg = encodeURIComponent(`Hi Sri Sai Natural Foods, I want to order:\n*${product.name}*\nQty: ${qty}\nPrice: ₹${product.price} x ${qty} = ₹${product.price * qty}`);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => onNavigate('shop')}
          className="flex items-center gap-2 text-forest-700 hover:text-forest-800 mb-6 text-sm font-medium group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Shop
        </button>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          {/* Image */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-warm-50 h-80 sm:h-96">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-earth-500 text-white text-sm font-bold px-3 py-1 rounded-lg">
                  -{discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div>
            {product.category && (
              <div className="text-xs font-semibold text-forest-600 uppercase tracking-wide mb-2">
                {(product.category as unknown as { name: string }).name}
              </div>
            )}
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-forest-700">₹{product.price}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.original_price}</span>
                  <span className="badge bg-green-100 text-green-700">Save ₹{product.original_price - product.price}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
                ))}
              </div>
              <span className="text-sm text-gray-500">4.9 (120+ reviews)</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-5 text-sm">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { icon: <Shield className="w-4 h-4 text-forest-600" />, text: '100% Natural' },
                { icon: <Leaf className="w-4 h-4 text-forest-600" />, text: 'Chemical Free' },
                { icon: <Truck className="w-4 h-4 text-earth-600" />, text: 'Fast Delivery' },
                { icon: <Star className="w-4 h-4 text-gold-500 fill-current" />, text: 'Premium Quality' },
              ].map(b => (
                <div key={b.text} className="flex items-center gap-2 p-2.5 bg-forest-50 rounded-xl text-sm text-forest-700">
                  {b.icon} {b.text}
                </div>
              ))}
            </div>

            {/* Unit */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-500">Unit:</span>
              <span className="px-3 py-1 bg-forest-100 text-forest-700 rounded-lg text-sm font-medium">{product.unit}</span>
            </div>

            {/* Qty selector */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm text-gray-500">Quantity:</span>
              <div className="flex items-center border-2 border-forest-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-forest-700 hover:bg-forest-50 font-bold text-lg transition-colors"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(20, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-forest-700 hover:bg-forest-50 font-bold text-lg transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-forest-700 font-semibold">= ₹{(product.price * qty).toFixed(0)}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-4">
              <button
                onClick={() => { addToCart(product, qty); showToast(`${product.name} added to cart!`); }}
                className="flex-1 flex items-center justify-center gap-2 btn-primary"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
              <button
                onClick={() => { addToCart(product, qty); onNavigate('checkout'); }}
                className="flex-1 flex items-center justify-center gap-2 btn-secondary"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>
              <button
                onClick={() => { toggleWishlist(product.id); showToast(isWished ? 'Removed from wishlist' : 'Added to wishlist', isWished ? 'info' : 'success'); }}
                className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 transition-all ${isWished ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 hover:border-red-300 text-gray-400 hover:text-red-500'}`}
              >
                <Heart className={`w-5 h-5 ${isWished ? 'fill-current' : ''}`} />
              </button>
            </div>

            <a
              href={`https://wa.me/919876543210?text=${whatsappMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <MessageCircle className="w-5 h-5" /> Order on WhatsApp
            </a>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
