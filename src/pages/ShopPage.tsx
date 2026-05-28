import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import ProductCard from '../components/ProductCard';

interface ShopPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
  searchQuery?: string;
}

export default function ShopPage({ onNavigate, initialCategory, searchQuery: externalSearch }: ShopPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');
  const [search, setSearch] = useState(externalSearch || '');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function load() {
      const [catRes, prodRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*, category:categories(*)').eq('is_active', true),
      ]);
      setCategories((catRes.data || []) as Category[]);
      setProducts((prodRes.data || []) as unknown as Product[]);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (externalSearch !== undefined) setSearch(externalSearch);
  }, [externalSearch]);

  useEffect(() => {
    if (initialCategory !== undefined) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filtered = useMemo(() => {
    let list = [...products];
    if (selectedCategory) {
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat) list = list.filter(p => p.category_id === cat.id);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sortBy) {
      case 'price-low': list.sort((a, b) => a.price - b.price); break;
      case 'price-high': list.sort((a, b) => b.price - a.price); break;
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'featured': list.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)); break;
    }
    return list;
  }, [products, categories, selectedCategory, search, priceRange, sortBy]);

  const maxPrice = useMemo(() => Math.max(...products.map(p => p.price), 2000), [products]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Our Products</h1>
          <p className="section-subtitle">Fresh natural products delivered to your door</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filters - desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-gray-800 mb-4 text-sm uppercase tracking-wide">Filters</h3>

              {/* Categories */}
              <div className="mb-6">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Category</div>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${!selectedCategory ? 'bg-forest-100 text-forest-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All Products
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${selectedCategory === c.slug ? 'bg-forest-100 text-forest-700 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Price Range</div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-forest-600"
                />
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Search + sort bar */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="flex-1 relative min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="input pl-9 py-2.5 text-sm"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-forest-400 cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 hover:border-forest-400"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="lg:hidden card p-4 mb-4 animate-slide-down">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm">Filters</span>
                  <button onClick={() => setShowFilters(false)}><X className="w-4 h-4" /></button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => { setSelectedCategory(''); setShowFilters(false); }}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${!selectedCategory ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600'}`}
                  >
                    All
                  </button>
                  {categories.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSelectedCategory(c.slug); setShowFilters(false); }}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedCategory === c.slug ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category pills */}
            <div className="hidden lg:flex gap-2 mb-5 overflow-x-auto category-scroll pb-1">
              <button
                onClick={() => setSelectedCategory('')}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${!selectedCategory ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600 hover:border-forest-400'}`}
              >
                All
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${selectedCategory === c.slug ? 'bg-forest-600 text-white border-forest-600' : 'border-gray-200 text-gray-600 hover:border-forest-400'}`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* Results count */}
            <div className="text-sm text-gray-500 mb-4">
              {loading ? 'Loading...' : `Showing ${filtered.length} products`}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filters</p>
                <button onClick={() => { setSearch(''); setSelectedCategory(''); }} className="btn-primary text-sm px-5 py-2">
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
