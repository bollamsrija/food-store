import { Leaf, Shield, Award, Users, Heart, Star, MapPin, Phone, MessageCircle } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const milestones = [
    { year: '2018', text: 'Sri Sai Natural Foods founded in Kukatpally with a small selection of cold-pressed oils' },
    { year: '2019', text: 'Expanded to millets and traditional grains, partnering with local farmers' },
    { year: '2021', text: 'Launched online ordering and home delivery across Hyderabad' },
    { year: '2022', text: 'Added 100+ organic products including dry fruits, spices and healthy snacks' },
    { year: '2024', text: 'Serving 2000+ happy families with 6+ years of trusted service' },
  ];

  const values = [
    { icon: <Leaf className="w-6 h-6 text-forest-600" />, title: 'Natural & Pure', desc: 'Every product is free from chemicals, preservatives and artificial additives. Nature at its best.' },
    { icon: <Shield className="w-6 h-6 text-forest-600" />, title: 'Quality Assured', desc: 'Each batch undergoes rigorous quality checks before reaching your table. No compromise on quality.' },
    { icon: <Heart className="w-6 h-6 text-red-500" />, title: 'Health First', desc: 'We believe food is medicine. Our products nourish your body and support healthy living.' },
    { icon: <Users className="w-6 h-6 text-earth-600" />, title: 'Community Driven', desc: 'We source from local farmers and support traditional food processing methods.' },
    { icon: <Award className="w-6 h-6 text-gold-600" />, title: 'Trusted Since 2018', desc: '6+ years of serving families in Kukatpally with consistent quality and honest pricing.' },
    { icon: <Star className="w-6 h-6 text-gold-500 fill-current" />, title: 'Customer Loved', desc: '4.9/5 rating from 2000+ customers who trust us for their daily nutrition needs.' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="bg-hero py-16 mb-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Leaf className="w-4 h-4 text-green-300" />
            <span className="text-white/90 text-sm">Our Story</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Bringing Nature's Best<br />to Your Kitchen
          </h1>
          <p className="text-forest-100 text-lg max-w-2xl mx-auto">
            Founded in Kukatpally, Hyderabad, Sri Sai Natural Foods has been a trusted name in natural, chemical-free foods since 2018. We believe in going back to basics — traditional methods, natural ingredients, honest products.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story */}
        <section className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="section-title mb-4">A Store Born from Conviction</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Sri Sai Natural Foods was born out of a deep belief that the food we eat shapes our health, happiness and lives. In a world full of processed, chemically-treated products, we wanted to offer a pure alternative.
              </p>
              <p>
                Starting with a small selection of cold-pressed oils in our Kukatpally store, we saw an immediate response from health-conscious families who were searching for exactly what we offered — traditional, natural, honest food.
              </p>
              <p>
                Today, we stock 100+ natural products including cold-pressed oils, ancient millets, premium dry fruits, aromatic spices, and organic groceries — all carefully sourced, quality-checked and delivered fresh.
              </p>
            </div>
            <button onClick={() => onNavigate('shop')} className="btn-primary mt-6">
              Explore Our Products
            </button>
          </div>
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
              alt="Natural products"
              className="rounded-3xl object-cover w-full h-80 shadow-warm"
            />
            <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-4 shadow-xl hidden sm:block">
              <div className="text-3xl font-display font-bold text-forest-700">6+</div>
              <div className="text-sm text-gray-500">Years of serving</div>
              <div className="text-sm text-gray-500">Kukatpally families</div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">The principles that guide everything we do</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(v => (
              <div key={v.title} className="card p-6 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-forest-50 rounded-2xl flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">From a small store to a trusted brand</p>
          </div>
          <div className="relative">
            <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-0.5 bg-forest-200" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={m.year} className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                  <div className={`hidden sm:block sm:w-1/2 ${i % 2 === 0 ? 'sm:pr-12 text-right' : 'sm:pl-12'}`}>
                    <div className="card p-4 inline-block text-left">
                      <p className="text-gray-600 text-sm leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                  <div className="relative z-10 w-16 sm:w-0 flex items-start justify-center sm:justify-center shrink-0">
                    <div className="w-10 h-10 bg-forest-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-green">
                      {m.year.slice(2)}
                    </div>
                  </div>
                  <div className={`flex-1 sm:w-1/2 ${i % 2 === 0 ? 'sm:pl-12 sm:hidden' : 'sm:pr-12 sm:text-right sm:block'}`}>
                    <div className="sm:hidden">
                      <div className="font-bold text-forest-700 mb-1">{m.year}</div>
                      <div className="card p-3 text-sm text-gray-600">{m.text}</div>
                    </div>
                    <div className={`hidden sm:block ${i % 2 !== 0 ? 'text-right' : ''}`}>
                      <div className="card p-4 inline-block text-left">
                        <p className="text-gray-600 text-sm leading-relaxed">{m.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact card */}
        <section className="bg-forest-800 rounded-3xl p-8 text-white text-center">
          <h2 className="font-display text-2xl font-bold mb-3">Visit Us or Get in Touch</h2>
          <p className="text-forest-300 mb-6 max-w-lg mx-auto">
            We'd love to hear from you. Visit our store in Kukatpally or reach us through any of the channels below.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 text-forest-200 text-sm">
              <MapPin className="w-4 h-4 text-forest-400" />
              KPHB Colony, Kukatpally, Hyderabad
            </div>
            <a href="tel:+919876543210" className="flex items-center gap-2 text-forest-200 hover:text-white text-sm transition-colors">
              <Phone className="w-4 h-4 text-forest-400" />
              +91 98765 43210
            </a>
          </div>
          <div className="flex justify-center gap-3 mt-6">
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
