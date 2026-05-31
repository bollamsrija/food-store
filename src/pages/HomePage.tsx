import { useEffect, useState } from 'react';
import { ArrowRight, Phone, MessageCircle, Leaf, Shield, Truck, Award, Star, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category, Testimonial, OfferBanner } from '../types';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [banners, setBanners] = useState<OfferBanner[]>([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [catRes, prodRes, testRes, bannerRes] = await Promise.all([
        supabase.from('categories').select('*').order('sort_order'),
        supabase.from('products').select('*, category:categories(*)').eq('is_featured', true).limit(8),
        supabase.from('testimonials').select('*').eq('is_active', true),
        supabase.from('offer_banners').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setCategories((catRes.data || []) as Category[]);
      setFeatured((prodRes.data || []) as unknown as Product[]);
      setTestimonials((testRes.data || []) as Testimonial[]);
      setBanners((bannerRes.data || []) as OfferBanner[]);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setActiveBanner(p => (p + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  const categoryIcons: Record<string, string> = {
    'cold-pressed-oils': '🫒',
    'millets': '🌾',
    'dry-fruits': '🥜',
    'spices': '🌶️',
    'organic-grocery': '🌿',
    'healthy-snacks': '🍃',
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Compact on mobile */}
      <section className="relative bg-hero overflow-hidden pt-28 md:pt-24 pb-8 md:pb-16 lg:pb-24">
        <div className="absolute inset-0 overflow-hidden hidden lg:block">
          <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-forest-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-earth-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-warm-300/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left animate-slide-up">
            {/* Hide badge on mobile */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 mb-8 sm:mb-10  max-w-full">
             <Leaf className="w-4 h-4 text-green-300" />
              <span className="text-white/90 text-xs sm:text-sm font-medium text-center">100% Natural & Organic Products</span>
            </div>
            {/* Smaller heading on mobile */}
           <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-normal md:leading-tight mb-4 md:mb-4 break-words">
            Pure Natural Foods<br />
              <span className="text-warm-300">for a Healthy</span>{' '}
              <br/>
              <span className="hidden sm:block"></span>Lifestyle
            </h1>
            {/* Compact description on mobile */}
            <p className="text-forest-100 text-sm md:text-lg mb-4 md:mb-8 max-w-xl mx-auto lg:mx-0">
              Cold-pressed oils, millets, dry fruits & organic groceries. No chemicals, 100% natural.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3 justify-center lg:justify-start w-full sm:w-auto">
              <button
                onClick={() => onNavigate('shop')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-forest-800 font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-xl hover:bg-warm-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm md:text-base"
              >
                Shop Now <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="https://wa.me/919876543210?text=Hi%20Sri%20Sai%20Natural%20Foods%2C%20I%20want%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-xl transition-all duration-200 shadow-lg hover:-translate-y-0.5 text-sm md:text-base"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Order
              </a>
              <a
                href="tel:+919876543210"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold px-5 py-2.5 md:px-6 md:py-3 rounded-xl hover:bg-white/20 transition-all duration-200 shadow-lg hover:-translate-y-0.5 text-sm md:text-base w-full sm:w-auto"
               >
                <Phone className="w-4 h-4" /> Call Now
              </a>
            </div>

            {/* Stats - Hidden on mobile */}
            
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 lg:mt-10 text-center lg:text-left md:flex md:gap-8 justify-center lg:justify-start">
              {[
                { num: '6+', label: 'Years Trust' },
                { num: '2000+', label: 'Happy Customers' },
                { num: '100+', label: 'Products' },
              ].map(s => (
                <div key={s.label} className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-white font-display">{s.num}</div>
                  <div className="text-forest-200 text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-lg w-full">
            <div className="relative w-full">
              <div className="absolute inset-0 bg-forest-600/30 rounded-3xl blur-2xl scale-95" />
              <img
                src="https://images.pexels.com/photos/725998/pexels-photo-725998.jpeg"
                alt="Natural foods"
                className="relative rounded-3xl object-cover w-full h-72 xl:h-96 shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-forest-100 rounded-lg flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-forest-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Chemical Free</div>
                    <div className="text-sm font-bold text-forest-700">100% Natural</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-gold-500 fill-current" />
                  <div>
                    <div className="text-sm font-bold text-gray-800">4.9/5</div>
                    <div className="text-xs text-gray-500">Customer Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Strip - New section */}
      <section className="bg-forest-700 text-white py-4 md:py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 md:flex md:flex-wrap justify-center items-center  md:gap-6 lg:gap-8">
            {[
              { icon: '🛡️', text: 'FSSAI Licensed' },
              { icon: '🌿', text: '100% Natural' },
              { icon: '🚫', text: 'No Preservatives' },
              { icon: '🚚', text: 'Free Delivery above ₹999' },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-center text-[11px] sm:text-sm font-medium">
              <span className="text-base sm:text-lg">{badge.icon}</span>
                <span className="text-forest-100 leading-tight">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Offer Banners */}
      {banners.length > 0 && (
        <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div
            className="relative rounded-2xl overflow-hidden h-40 sm:h-40 flex items-center px-6 sm:px-8 cursor-pointer"
            style={{ backgroundColor: banners[activeBanner]?.bg_color || '#2d6a4f' }}
            onClick={() => onNavigate(banners[activeBanner]?.cta_link?.replace('/', '') || 'shop')}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white transform translate-x-24 -translate-y-12" />
              <div className="absolute bottom-0 right-1/4 w-40 h-40 rounded-full bg-white transform translate-y-12" />
            </div>
            <div className="relative z-10 pr-4 sm:pr-0">
              <div className="text-white font-display font-bold text-lg sm:text-2xl leading-tight break-words">{banners[activeBanner]?.title}</div>
              <div className="text-white/80 text-xs sm:text-sm mt-2 max-w-[160px] sm:max-w-[220px]">{banners[activeBanner]?.subtitle}</div>
            </div>
            <button className="relative z-10 ml-auto flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm border border-white/30">
              {banners[activeBanner]?.cta_text} <ArrowRight className="w-4 h-4" />
            </button>
            {banners.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setActiveBanner(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeBanner ? 'bg-white w-4' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Explore our wide range of natural products</p>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="hidden sm:flex items-center gap-1 text-forest-700 font-medium text-sm hover:gap-2 transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => onNavigate(`shop?category=${cat.slug}`)}
                className="group card p-4 flex flex-col items-center gap-3 hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-warm-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-center">
                  <div className="text-xl mb-1">{categoryIcons[cat.slug] || '🌿'}</div>
                  <div className="text-sm font-semibold text-gray-700 group-hover:text-forest-700 transition-colors leading-tight">
                    {cat.name}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

{/* <Why Choose Us> */}

<section className="py-14 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-10">
      <h2 className="section-title">Why Choose Sri Sai Natural Foods?</h2>
      <p className="section-subtitle">
        Pure products, traditional methods, trusted quality.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card p-6 text-center">
        <div className="text-4xl mb-3">🌱</div>
        <h3 className="font-bold text-lg mb-2">100% Natural</h3>
        <p className="text-gray-600">
          No chemicals, preservatives or artificial additives.
        </p>
      </div>

      <div className="card p-6 text-center">
        <div className="text-4xl mb-3">🏺</div>
        <h3 className="font-bold text-lg mb-2">Traditional Processing</h3>
        <p className="text-gray-600">
          Prepared using traditional and healthy methods.
        </p>
      </div>

      <div className="card p-6 text-center">
        <div className="text-4xl mb-3">🚚</div>
        <h3 className="font-bold text-lg mb-2">Fast Delivery</h3>
        <p className="text-gray-600">
          Quick and secure delivery across Hyderabad.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Featured Products */}
      <section className="py-12 bg-warm-50/60">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our bestsellers loved by customers</p>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="hidden sm:flex items-center gap-1 text-forest-700 font-medium text-sm hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-64 sm:h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {featured.map(p => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                
              ))}
            </div>
            
          )}


          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('shop')}
              className="btn-primary inline-flex items-center gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Trust Badges - Moved after products section */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Shield className="w-5 h-5 text-forest-600" />, title: '100% Natural', desc: 'No chemicals, no additives' },
              { icon: <Truck className="w-5 h-5 text-earth-600" />, title: 'Fast Delivery', desc: 'Same day in Kukatpally' },
              { icon: <Award className="w-5 h-5 text-gold-600" />, title: 'Premium Quality', desc: 'Hand-picked products' },
              { icon: <Leaf className="w-5 h-5 text-forest-600" />, title: 'Cold Pressed', desc: 'Traditional methods' },
            ].map(b => (
              <div key={b.title} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center shrink-0">
                  {b.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-800 truncate">{b.title}</div>
                  <div className="text-xs text-gray-500 truncate">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative order-2 lg:order-1">
            <img
              src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
              alt="About Sri Sai Natural Foods"
              className="rounded-3xl object-cover w-full h-80 shadow-warm"
            />
            <div className="absolute -bottom-6 -right-6 bg-forest-700 text-white p-5 rounded-2xl shadow-xl hidden sm:block">
              <div className="font-display text-3xl font-bold">6+</div>
              <div className="text-forest-200 text-sm">Years Serving</div>
              <div className="text-forest-200 text-sm">Kukatpally</div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-forest-50 text-forest-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Leaf className="w-4 h-4" /> Our Story
            </div>
            <h2 className="section-title mb-4">Trusted Natural Foods Store in Kukatpally</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Sri Sai Natural Foods has been serving the families of Kukatpally and Hyderabad for over 6 years. We believe in traditional, chemical-free methods of food processing — because nature knows best.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: '🌿', title: 'No Chemicals', desc: 'Zero artificial additives' },
                { icon: '❄️', title: 'Cold Pressed', desc: 'Traditional wood churning' },
                { icon: '✅', title: 'Quality Checked', desc: 'Each batch tested' },
                { icon: '🏠', title: 'Local Store', desc: 'Kukatpally, Hyderabad' },
              ].map(f => (
                <div key={f.title} className="flex items-start gap-3 p-3 bg-forest-50 rounded-xl">
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{f.title}</div>
                    <div className="text-xs text-gray-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('about')} className="btn-primary">
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 bg-forest-900">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-bold text-white mb-2">What Our Customers Say</h2>
            <p className="text-forest-300">Trusted by 2000+ happy families in Hyderabad</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map(t => (
              <div key={t.id} className="bg-forest-800/50 border border-forest-700 rounded-2xl p-5 hover:bg-forest-800 transition-colors">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-400 fill-current" />
                  ))}
                </div>
                <p className="text-forest-200 text-sm leading-relaxed mb-4">"{t.review}"</p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.image_url}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-forest-600"
                  />
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-forest-400 text-xs">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-warm-50">
  <div className="max-w-4xl mx-auto px-4">
    <h2 className="section-title text-center mb-8">
      Frequently Asked Questions
    </h2>

    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl">
        <h3 className="font-semibold">
          Are your products chemical free?
        </h3>
        <p className="text-gray-600 mt-2">
          Yes. Our products are carefully sourced and free from harmful chemicals.
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl">
        <h3 className="font-semibold">
          Do you provide home delivery?
        </h3>
        <p className="text-gray-600 mt-2">
          Yes, we provide delivery across Hyderabad.
        </p>
      </div>

      <div className="bg-white p-5 rounded-xl">
        <h3 className="font-semibold">
          How can I place an order?
        </h3>
        <p className="text-gray-600 mt-2">
          You can order directly from the website or through WhatsApp.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Google Maps */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="section-title">Find Us in Kukatpally</h2>
          <p className="section-subtitle">KPHB Colony, Kukatpally, Hyderabad, Telangana - 500072</p>
        </div>
        <div className="rounded-2xl overflow-hidden shadow-warm h-72 sm:h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.4!2d78.3909!3d17.4944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb918c5ebcb505%3A0x9e6dbef10cae2c06!2sKukatpally%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Sri Sai Natural Foods Location"
          />
        </div>
      </section>

      <section className="py-12 bg-white">
  <div className="max-w-7xl mx-auto px-4">
    <div className="grid md:grid-cols-4 gap-6 text-center">
      <div>
        <h3 className="text-3xl font-bold text-forest-700">2000+</h3>
        <p className="text-gray-600">Happy Customers</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-forest-700">100+</h3>
        <p className="text-gray-600">Natural Products</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-forest-700">6+</h3>
        <p className="text-gray-600">Years of Trust</p>
      </div>

      <div>
        <h3 className="text-3xl font-bold text-forest-700">4.9★</h3>
        <p className="text-gray-600">Customer Rating</p>
      </div>
    </div>
  </div>
</section>

      {/* WhatsApp CTA banner */}
      <section className="py-10 bg-green-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">Order via WhatsApp — Super Easy!</h2>
          <p className="text-green-100 mb-6">Just message us on WhatsApp and we'll handle the rest. Fast, simple, convenient.</p>
          <a
            href="https://wa.me/919876543210?text=Hi%20Sri%20Sai%20Natural%20Foods%2C%20I%20want%20to%20place%20an%20order."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-8 py-3.5 rounded-xl hover:bg-green-50 transition-colors shadow-lg text-lg"
          >
            <MessageCircle className="w-5 h-5" /> Order on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
