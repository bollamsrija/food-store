import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types';

interface CategoriesPageProps {
  onNavigate: (page: string) => void;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order').then(({ data }) => {
      setCategories((data || []) as Category[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="section-title mb-2">All Categories</h1>
          <p className="section-subtitle">Explore our full range of natural and organic products</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`shop?category=${cat.slug}`)}
                className="card overflow-hidden group text-left hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-36 overflow-hidden bg-warm-50">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-3xl">{categoryIcons[cat.slug] || '🌿'}</div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-semibold text-gray-800 group-hover:text-forest-700 transition-colors">{cat.name}</h3>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-forest-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {categoryDescriptions[cat.slug] || cat.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
