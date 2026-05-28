import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi Sri Sai Natural Foods, I want to place an order.");
  const href = `https://wa.me/919876543210?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Order on WhatsApp"
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30" />
        <MessageCircle className="w-7 h-7 relative z-10" />
      </div>
      <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Order on WhatsApp
      </span>
    </a>
  );
}
