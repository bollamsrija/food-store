import { useEffect, useState } from 'react';
import { ArrowRight, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
}

interface CategoryWithCount extends Category {
  product_count?: number;
}

const categoryIcons: Record<string, string> = {
  'cold-pressed-oils': '🫒',
  'millets': '🌾',
  'dry-fruits': '🥜',
  'spices': '🌶️',
  'organic-grocery': '🌿',
  'healthy-snacks': '🍃',
};

const categoryDescriptions: Record<string, string> = {
  'cold-pressed-oils': 'Pure wood-churned oils preserving maximum nutrition and traditional goodness',
  'millets': 'Ancient grains for modern health – high fiber, iron-rich, gluten-free staples',
  'dry-fruits': 'Premium quality nuts and dried fruits for daily nutrition and energy',
  'spices': 'Freshly ground aromatic spices for authentic South Indian and North Indian cuisine',
  'organic-grocery': 'Certified organic staples – rice, dal, jaggery and more for your pantry',
  'healthy-snacks': 'Guilt-free natural snacks made from wholesome ingredients',
};

export default function CategoriesPage({ onNavigate }: CategoriesPageProps) {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('category_id'),
      ]);

      const categoriesData = (catRes.data || []) as Category[];
      const productsData = prodRes.data || [];

      // Count products per category
      const productCounts: Record<string, number> = {};
      productsData.forEach((p: { category_id: string }) => {
        productCounts[p.category_id] = (productCounts[p.category_id] || 0) + 1;
      });

      const categoriesWithCount = categoriesData.map(cat => ({
        ...cat,
        product_count: productCounts[cat.id] || 0,
      }));

      setCategories(categoriesWithCount);
      setLoading(false);
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-3">Shop by Category</h1>
          <p className="text-gray-500 max-w-xl mx-auto">Explore our full range of natural and organic products, carefully sourced for your healthy lifestyle</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`shop?category=${cat.slug}`)}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 text-left"
              >
                {/* Image */}
                <div className="relative h-44 md:h-52 overflow-hidden bg-warm-50">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Icon Badge */}
                  <div className="absolute top-3 left-3 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">{categoryIcons[cat.slug] || '🌿'}</span>
                  </div>

                  {/* Product Count Badge */}
                  <div className="absolute top-3 right-3 bg-forest-700/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5" />
                    {cat.product_count} products
                  </div>

                  {/* Category Name on Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-1">{cat.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {categoryDescriptions[cat.slug] || cat.description || 'Explore our premium quality products'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-forest-600 font-semibold text-sm group-hover:text-forest-700 transition-colors">
                      View Products
                    </span>
                    <div className="w-8 h-8 bg-forest-100 rounded-full flex items-center justify-center group-hover:bg-forest-200 transition-colors">
                      <ArrowRight className="w-4 h-4 text-forest-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">Can't find what you're looking for?</p>
          <a
            href="https://wa.me/919876543210?text=Hi%20Sri%20Sai%20Natural%20Foods%2C%20I%20have%20a%20product%20request"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            Contact us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
