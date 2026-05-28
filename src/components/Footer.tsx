import { MapPin, Phone, Clock, Mail, Instagram, Leaf, MessageCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const quickLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
    { label: 'Track Order', page: 'track-order' },
  ];

  const categories = [
    { label: 'Cold Pressed Oils', slug: 'cold-pressed-oils' },
    { label: 'Millets', slug: 'millets' },
    { label: 'Dry Fruits', slug: 'dry-fruits' },
    { label: 'Spices', slug: 'spices' },
    { label: 'Organic Grocery', slug: 'organic-grocery' },
    { label: 'Healthy Snacks', slug: 'healthy-snacks' },
  ];

  return (
    <footer className="bg-forest-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-forest-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-lg leading-tight">Sri Sai Natural Foods</div>
                <div className="text-[10px] text-forest-300 uppercase tracking-widest">Pure. Natural. Healthy.</div>
              </div>
            </div>
            <p className="text-forest-300 text-sm leading-relaxed mb-5">
              Bringing you the finest natural and organic products directly from nature. 6+ years of trust in Kukatpally, Hyderabad.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-forest-700 hover:bg-forest-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map(l => (
                <li key={l.page}>
                  <button
                    onClick={() => onNavigate(l.page)}
                    className="text-forest-300 hover:text-white text-sm transition-colors"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <ul className="space-y-2.5">
              {categories.map(c => (
                <li key={c.slug}>
                  <button
                    onClick={() => onNavigate(`shop?category=${c.slug}`)}
                    className="text-forest-300 hover:text-white text-sm transition-colors text-left"
                  >
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-forest-300 text-sm">
                <MapPin className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                <span>Shop No. 12, KPHB Colony, Kukatpally, Hyderabad, Telangana - 500072</span>
              </li>
              <li className="flex items-center gap-3 text-forest-300 text-sm">
                <Phone className="w-4 h-4 text-forest-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 text-forest-300 text-sm">
                <MessageCircle className="w-4 h-4 text-green-400 shrink-0" />
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Order
                </a>
              </li>
              <li className="flex items-center gap-3 text-forest-300 text-sm">
                <Mail className="w-4 h-4 text-forest-400 shrink-0" />
                <a href="mailto:info@srisainatural.com" className="hover:text-white transition-colors">info@srisainatural.com</a>
              </li>
              <li className="flex items-start gap-3 text-forest-300 text-sm">
                <Clock className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                <div>
                  <div>Mon - Sat: 8:00 AM - 9:00 PM</div>
                  <div>Sunday: 9:00 AM - 7:00 PM</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-forest-800 py-4 px-4 text-center">
        <p className="text-forest-400 text-xs">
          © 2024 Sri Sai Natural Foods, Kukatpally, Hyderabad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
