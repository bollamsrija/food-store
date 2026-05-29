import { Heart, ShoppingCart, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onNavigate: (page: string) => void;
}

export default function ProductCard({ product, onNavigate }: ProductCardProps) {
  const { addToCart, toggleWishlist, wishlist, showToast } = useApp();
  const [qty, setQty] = useState(1);
  const isWished = wishlist.includes(product.id);
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, qty);
    showToast(`${product.name} added to cart!`);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, qty);
    onNavigate('checkout');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
    showToast(isWished ? 'Removed from wishlist' : 'Added to wishlist', isWished ? 'info' : 'success');
  };

  return (
    <div
      className="card overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
      onClick={() => onNavigate(`product:${product.slug}`)}
    >
      {/* Image - Compact on mobile */}
      <div className="product-img-wrapper relative h-32 sm:h-48 bg-warm-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-earth-500 text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg">
            -{discount}%
          </span>
        )}
        {product.is_featured && (
          <span className="absolute top-1.5 right-8 sm:top-2 sm:right-10 bg-forest-600 text-white text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg flex items-center gap-0.5 sm:gap-1">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" /> Featured
          </span>
        )}
        <button
          onClick={handleWishlist}
          className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
            isWished ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWished ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content - Compact on mobile */}
      <div className="p-2 sm:p-4">
        <div className="text-[10px] sm:text-xs text-forest-600 font-medium mb-0.5 sm:mb-1 uppercase tracking-wide">{product.unit}</div>
        <h3 className="font-semibold text-gray-800 text-xs sm:text-sm leading-snug mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2 group-hover:text-forest-700 transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <span className="text-forest-700 font-bold text-sm sm:text-lg">₹{product.price}</span>
          {product.original_price && (
            <span className="text-gray-400 text-[10px] sm:text-sm line-through">₹{product.original_price}</span>
          )}
        </div>

        {/* Qty selector - Hidden on mobile, visible on sm+ */}
        <div className="hidden sm:flex items-center gap-2 mb-3">
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={e => { e.stopPropagation(); setQty(q => Math.max(1, q - 1)); }}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-base transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium">{qty}</span>
            <button
              onClick={e => { e.stopPropagation(); setQty(q => Math.min(20, q + 1)); }}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 font-bold text-base transition-colors"
            >
              +
            </button>
          </div>
          {product.stock < 10 && (
            <span className="text-xs text-orange-600 font-medium">Only {product.stock} left</span>
          )}
        </div>

        {/* Actions - Compact on mobile */}
        <div className="flex gap-1.5 sm:gap-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-forest-600 hover:bg-forest-700 text-white text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all duration-200 hover:shadow-green"
          >
            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Add to Cart</span>
            <span className="sm:hidden">Add</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-earth-500 hover:bg-earth-600 text-white text-[10px] sm:text-xs font-semibold py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl transition-all"
          >
            <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Buy Now</span>
            <span className="sm:hidden">Buy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
