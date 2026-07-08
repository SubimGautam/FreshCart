const TermsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-semibold text-ink mb-2">📜 Terms & Conditions</h1>
      <p className="text-ink/55 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-stone max-w-none">
        <p className="text-ink/70">
          Welcome to FreshCart. By using our website and services, you agree to the following terms and conditions.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">1. Acceptance of Terms</h2>
        <p className="text-ink/70">
          By creating an account or placing an order, you accept these terms. If you do not agree, please do not use our services.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">2. User Accounts</h2>
        <ul className="list-disc pl-6 text-ink/70 space-y-1">
          <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
          <li>You must provide accurate and current information.</li>
          <li>We reserve the right to suspend or terminate accounts that violate our policies.</li>
        </ul>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">3. Orders and Payment</h2>
        <p className="text-ink/70">
          All orders are subject to product availability. Prices are subject to change without notice. Payment must be completed at the time of checkout.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">4. Delivery and Pickup</h2>
        <p className="text-ink/70">
          Delivery times are estimates and may vary. We are not liable for delays beyond our control. For pickup orders, please arrive within the designated window.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">5. Returns and Refunds</h2>
        <p className="text-ink/70">
          If you receive a damaged or incorrect item, please contact us within 24 hours. We will arrange a replacement or refund at our discretion.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">6. Limitation of Liability</h2>
        <p className="text-ink/70">
          FreshCart is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">7. Changes to Terms</h2>
        <p className="text-ink/70">
          We may update these terms from time to time. Continued use of our services constitutes acceptance of the updated terms.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">Contact</h2>
        <p className="text-ink/70">
          Questions about these terms? Reach out via our <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsPage;