export default function RefundPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-forest-700">
        Refund & Return Policy
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Customer satisfaction is our priority.
        </p>

        <h2 className="text-lg md:text-xl font-semibold">
          Returns
        </h2>

        <p>
          Products can be returned only if they are damaged,
          defective, or incorrect at the time of delivery.
        </p>

        <h2 className="text-lg md:text-xl font-semibold">
          Refunds
        </h2>

        <p>
          Approved refunds will be processed within 5-7 business days.
        </p>

        <h2 className="text-lg md:text-xl font-semibold">
          Non-Returnable Items
        </h2>

        <ul className="list-disc ml-6">
          <li>Opened food products</li>
          <li>Used products</li>
          <li>Products damaged after delivery</li>
        </ul>

        <h2 className="text-lg md:text-xl font-semibold">
          Contact
        </h2>

        <p>
          For refund requests, contact us via phone or WhatsApp.
        </p>
      </div>
    </div>
  );
}