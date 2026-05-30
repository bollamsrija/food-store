export default function PrivacyPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-forest-700">
        Privacy Policy
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          At Sri Sai Natural Foods, we value your privacy and are committed
          to protecting your personal information.
        </p>

        <h2 className="text-lg md:text-xl font-semibold">
          Information We Collect
        </h2>
        <p>
          We may collect your name, phone number, email address,
          delivery address and order details when you place an order.
        </p>

        <h2 className="text-lg md:text-xl font-semibold">
          How We Use Your Information
        </h2>
        <ul className="list-disc ml-6">
          <li>To process your orders</li>
          <li>To provide customer support</li>
          <li>To improve our services</li>
          <li>To communicate order updates</li>
        </ul>

        <h2 className="text-lg md:text-xl font-semibold">
          Data Protection
        </h2>
        <p>
          We do not sell, trade or share your personal information
          with third parties except when required for order delivery.
        </p>

        <h2 className="text-lg md:text-xl font-semibold">
          Contact Us
        </h2>
        <p>
          For any privacy-related concerns, contact us at:
          info@srisainatural.com
        </p>
      </div>
    </div>
  );
}