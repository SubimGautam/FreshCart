const PrivacyPolicyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-semibold text-ink mb-2">🔒 Privacy Policy</h1>
      <p className="text-ink/55 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

      <div className="prose prose-stone max-w-none">
        <p className="text-ink/70">
          At FreshCart, we take your privacy seriously. This policy describes how we collect, use, and protect your personal information.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">Information We Collect</h2>
        <p className="text-ink/70">
          We collect information you provide directly, such as your name, email address, phone number, and delivery address. We also automatically collect usage data to improve our service.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">How We Use Your Information</h2>
        <ul className="list-disc pl-6 text-ink/70 space-y-1">
          <li>To process orders and deliver products</li>
          <li>To communicate with you about your orders</li>
          <li>To send promotional offers (you may opt out)</li>
          <li>To improve our website and customer experience</li>
        </ul>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">Sharing Your Information</h2>
        <p className="text-ink/70">
          We do not sell, trade, or rent your personal information to third parties. We may share data with trusted service providers (e.g., delivery partners) solely to fulfill orders.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">Your Rights</h2>
        <p className="text-ink/70">
          You may access, update, or delete your account information at any time by visiting your profile page. You may also contact us to request data removal.
        </p>

        <h2 className="font-display font-semibold text-ink text-xl mt-6">Contact Us</h2>
        <p className="text-ink/70">
          If you have any questions about this policy, please <a href="/contact" className="text-primary-600 hover:underline">contact us</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;