import { MapPin, Phone, Mail, Leaf, MessageCircle,Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-forest-900 text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* About Us */}
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
            <p className="text-forest-300 text-sm leading-relaxed">
              Sri Sai Natural Foods has been serving the families of Kukatpally and Hyderabad for over 6 years. We believe in traditional, chemical-free methods of food processing - because nature knows best.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', page: 'home' },
                { label: 'Shop', page: 'shop' },
                { label: 'Categories', page: 'categories' },
                { label: 'About Us', page: 'about' },
                { label: 'Contact', page: 'contact' },
                { label: 'Privacy Policy', page: 'privacy' },
{ label: 'Refund Policy', page: 'refund' },
              ].map(l => (
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
              {[
                { label: 'Cold Pressed Oils', slug: 'cold-pressed-oils' },
                { label: 'Millets', slug: 'millets' },
                { label: 'Dry Fruits', slug: 'dry-fruits' },
                { label: 'Spices', slug: 'spices' },
                { label: 'Organic Grocery', slug: 'organic-grocery' },
              ].map(c => (
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

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-forest-300 text-sm">
                <MapPin className="w-4 h-4 text-forest-400 mt-0.5 shrink-0" />
                <span>KPHB Colony, Kukatpally, Hyderabad, Telangana - 500072</span>
              </li>
             
             <li className="flex items-center gap-3 text-forest-300 text-sm">
  <Clock className="w-4 h-4 text-forest-400 shrink-0" />
  <span>Mon - Sun: 8:00 AM - 9:00 PM</span>
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
            </ul>
          </div>
        </div>
      </div>



          {/* Bottom bar - Copyright */}

          <div className="border-t border-forest-800">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="text-forest-300 text-sm font-medium hover:text-white transition-colors">
        🌿 100% Natural
      </div>

      <div className="text-forest-300 text-sm font-medium hover:text-white transition-colors">
        🛡️ FSSAI Licensed
      </div>

      <div className="text-forest-300 text-sm font-medium hover:text-white transition-colors">
        🚚 Fast Delivery
      </div>

      <div className="text-forest-300 text-sm font-medium hover:text-white transition-colors">
        ⭐ Trusted by 2000+ Families
      </div>
    </div>
  </div>
</div>


      {/* Bottom bar - Copyright */}
      <div className="border-t border-forest-800 py-4 px-4 text-center">
        <p className="text-forest-400 text-xs">
          &copy; {new Date().getFullYear()} Sri Sai Natural Foods, Kukatpally, Hyderabad. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
