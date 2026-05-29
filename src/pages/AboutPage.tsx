import { Leaf, Shield, Award, Users, Heart, Star, MapPin, Phone, MessageCircle, CheckCircle2, Sprout, Droplet, Sun } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const whyChooseUs = [
    { icon: <Shield className="w-6 h-6" />, title: 'FSSAI Licensed', desc: 'All products meet strict food safety standards' },
    { icon: <Leaf className="w-6 h-6" />, title: '100% Natural', desc: 'No chemicals, preservatives or artificial additives' },
    { icon: <Sprout className="w-6 h-6" />, title: 'Traditional Methods', desc: 'Cold-pressed oils, stone-ground flours' },
    { icon: <Heart className="w-6 h-6" />, title: 'Health Focused', desc: 'Products that nourish your body' },
  ];

  const values = [
    { icon: <Leaf className="w-6 h-6 text-forest-600" />, title: 'Purity Above All', desc: 'Every product is free from chemicals, preservatives and artificial additives. Nature at its best.' },
    { icon: <Shield className="w-6 h-6 text-forest-600" />, title: 'Quality Assured', desc: 'Each batch undergoes rigorous quality checks before reaching your table. No compromise.' },
    { icon: <Users className="w-6 h-6 text-earth-600" />, title: 'Community First', desc: 'We source from local farmers and support traditional food processing methods.' },
    { icon: <Heart className="w-6 h-6 text-red-500" />, title: 'Customer Trust', desc: '6+ years of serving families in Kukatpally with consistent quality and honest pricing.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50">
      {/* Hero */}
      <section className="bg-hero py-14 md:py-20 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Leaf className="w-4 h-4 text-green-300" />
            <span className="text-white/90 text-sm font-medium">Established 2018</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Bringing Nature's Best<br />to Your Kitchen
          </h1>
          <p className="text-forest-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Sri Sai Natural Foods - trusted name in natural, chemical-free foods in Kukatpally, Hyderabad. Traditional methods, natural ingredients, honest products for healthy living.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Our Story Section */}
        <section className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center mb-16">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
              <Leaf className="w-4 h-4" /> Our Story
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-5">
              A Store Born from Conviction
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Sri Sai Natural Foods was born from a deep belief that the food we eat shapes our health, happiness and lives. In a world full of processed, chemically-treated products, we wanted to offer a pure alternative.
              </p>
              <p>
                Starting with a small selection of cold-pressed oils in our Kukatpally store, we saw an immediate response from health-conscious families searching for traditional, natural, honest food.
              </p>
              <p>
                Today, we stock 100+ natural products including cold-pressed oils, ancient millets, premium dry fruits, aromatic spices, and organic groceries — all carefully sourced, quality-checked and delivered fresh.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 mt-6">
              <button onClick={() => onNavigate('shop')} className="btn-primary">
                Explore Our Products
              </button>
              <button onClick={() => onNavigate('contact')} className="btn-ghost border border-gray-200">
                Visit Our Store
              </button>
            </div>
          </div>
          <div className="relative order-1 lg:order-2">
            <img
              src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
              alt="Natural products"
              className="rounded-3xl object-cover w-full h-72 md:h-80 shadow-warm"
            />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl hidden sm:block">
              <div className="text-3xl font-display font-bold text-forest-700">6+</div>
              <div className="text-sm text-gray-500">Years of trust</div>
            </div>
            <div className="absolute -top-3 -right-3 bg-forest-700 text-white rounded-2xl px-4 py-3 shadow-xl hidden sm:block">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-gold-400 fill-current" />
                <span className="font-bold">4.9/5</span>
              </div>
              <div className="text-xs text-forest-200">Customer rating</div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-3xl p-6 md:p-10 mb-16 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-3">Why Choose Us</h2>
            <p className="text-gray-500 max-w-xl mx-auto">We're committed to bringing you the finest natural products with complete transparency</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="text-center p-5 rounded-2xl hover:bg-forest-50 transition-colors group">
                <div className="w-14 h-14 bg-forest-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-forest-200 transition-colors text-forest-700">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-3">Our Values</h2>
            <p className="text-gray-500">The principles that guide everything we do</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 hover:-translate-y-1 transition-all shadow-sm hover:shadow-md border border-gray-100">
                <div className="w-12 h-12 bg-forest-50 rounded-xl flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team / Founder Section */}
        <section className="bg-warm-50 rounded-3xl p-6 md:p-10 mb-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt="Sri Sai Natural Foods Team"
                className="rounded-2xl object-cover w-full h-64 md:h-80 shadow-md"
              />
              <div className="absolute -bottom-4 -right-4 bg-forest-700 text-white rounded-xl px-5 py-3 shadow-lg">
                <div className="font-bold text-lg">Since 2018</div>
                <div className="text-forest-200 text-sm">Serving Kukatpally</div>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 bg-forest-100 text-forest-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Users className="w-4 h-4" /> Our Team
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-5">
                Passionate About Natural Foods
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our team at Sri Sai Natural Foods is driven by a shared passion for healthy, natural living. We personally visit farms, select the best produce, and ensure every product meets our quality standards.
                </p>
                <p>
                  From sourcing organic ingredients to maintaining traditional cold-pressing methods, we're committed to preserving the nutritional integrity of every product we sell.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: <CheckCircle2 className="w-4 h-4 text-forest-600" />, text: 'FSSAI Licensed' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-forest-600" />, text: 'Quality Tested' },
                  { icon: <CheckCircle2 className="w-4 h-4 text-forest-600" />, text: 'Transparent Sourcing' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 text-sm font-medium text-gray-700 shadow-sm">
                    {item.icon}
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Store Features */}
        <section className="bg-white rounded-3xl p-6 md:p-10 mb-16 shadow-sm">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-800 mb-3">What We Offer</h2>
            <p className="text-gray-500">Complete range of natural and organic products</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Droplet className="w-8 h-8 text-forest-600" />, title: 'Cold-Pressed Oils', items: ['Groundnut Oil', 'Coconut Oil', 'Sesame Oil', 'Mustard Oil'] },
              { icon: <Sprout className="w-8 h-8 text-earth-600" />, title: 'Ancient Millets', items: ['Foxtail Millet', 'Little Millet', 'Barnyard Millet', 'Ragi'] },
              { icon: <Sun className="w-8 h-8 text-gold-600" />, title: 'Natural Groceries', items: ['Dry Fruits', 'Organic Spices', 'Jaggery & Honey', 'Healthy Snacks'] },
            ].map((cat, i) => (
              <div key={i} className="text-center p-5 rounded-2xl bg-gray-50 hover:bg-forest-50 transition-colors">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  {cat.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-3">{cat.title}</h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item, j) => (
                    <li key={j} className="text-gray-600 text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-forest-800 rounded-3xl p-8 md:p-10 text-white text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Visit Us or Get in Touch</h2>
          <p className="text-forest-300 mb-6 max-w-lg mx-auto">
            We'd love to hear from you. Visit our store in Kukatpally or reach us through any of the channels below.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-forest-200 text-sm">
              <MapPin className="w-4 h-4 text-forest-400" />
              KPHB Colony, Kukatpally, Hyderabad
            </div>
            <a href="tel:+919876543210" className="flex items-center gap-2 text-forest-200 hover:text-white text-sm transition-colors">
              <Phone className="w-4 h-4 text-forest-400" />
              +91 98765 43210
            </a>
          </div>
          <div className="flex justify-center gap-3">
            <a
              href="https://wa.me/919876543210?text=Hi%20Sri%20Sai%20Natural%20Foods!"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
            <button onClick={() => onNavigate('contact')} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm border border-white/20">
              Contact Us
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
