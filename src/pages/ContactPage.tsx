import { useState } from 'react';
import { MapPin, Phone, Clock, Mail, MessageCircle, Send, Instagram, CheckCircle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hi Sri Sai Natural Foods!\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Email:* ${form.email}\n\n*Message:*\n${form.message}`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="bg-forest-800 py-12 mb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">Get in Touch</h1>
          <p className="text-forest-300 text-lg">We're here to help. Reach us any time!</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Store Information</h2>
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: <MapPin className="w-5 h-5 text-forest-600" />,
                  title: 'Address',
                  lines: ['Shop No. 12, KPHB Colony,', 'Kukatpally, Hyderabad,', 'Telangana - 500072'],
                },
                {
                  icon: <Phone className="w-5 h-5 text-earth-600" />,
                  title: 'Phone',
                  lines: ['+91 98765 43210', '+91 98765 43211'],
                  link: 'tel:+919876543210',
                },
                {
                  icon: <MessageCircle className="w-5 h-5 text-green-600" />,
                  title: 'WhatsApp',
                  lines: ['+91 98765 43210'],
                  link: 'https://wa.me/919876543210',
                },
                {
                  icon: <Mail className="w-5 h-5 text-forest-600" />,
                  title: 'Email',
                  lines: ['info@srisainatural.com'],
                  link: 'mailto:info@srisainatural.com',
                },
                {
                  icon: <Clock className="w-5 h-5 text-earth-600" />,
                  title: 'Store Hours',
                  lines: ['Mon – Sat: 8:00 AM – 9:00 PM', 'Sunday: 9:00 AM – 7:00 PM'],
                },
              ].map(info => (
                <div key={info.title} className="card p-4 flex items-start gap-4 hover:-translate-y-0.5 transition-transform">
                  <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm mb-1">{info.title}</div>
                    {info.link ? (
                      <a href={info.link} target={info.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-forest-700 transition-colors">
                        {info.lines[0]}
                      </a>
                    ) : (
                      info.lines.map((l, i) => <div key={i} className="text-sm text-gray-600">{l}</div>)
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social */}
            <div className="card p-5">
              <h3 className="font-semibold text-gray-800 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-2 rounded-xl transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-medium px-4 py-2 rounded-xl transition-all text-sm"
                >
                  <Instagram className="w-4 h-4" /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">Send a Message</h2>
            <div className="card p-6">
              {sent && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 mb-5 animate-scale-in">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                  <div className="text-green-800 text-sm font-medium">Message sent to WhatsApp!</div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Full name"
                    className="input"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 ..."
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com"
                      className="input"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="How can we help you?"
                    rows={5}
                    className="input resize-none"
                    required
                  />
                </div>
                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-12 rounded-2xl overflow-hidden shadow-warm h-72 sm:h-96">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.4!2d78.3909!3d17.4944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb918c5ebcb505%3A0x9e6dbef10cae2c06!2sKukatpally%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Store Location"
          />
        </div>
      </div>
    </div>
  );
}
