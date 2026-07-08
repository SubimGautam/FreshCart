import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    q: 'How do I place an order?',
    a: 'Simply browse products, add items to your cart, and proceed to checkout. You’ll need to create an account or log in first.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept Cash on Delivery, eSewa, and Mobile Banking. Online payments are coming soon.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Typically 30–60 minutes within Kathmandu Valley. For other areas, delivery may take 1–2 business days.',
  },
  {
    q: 'Can I change or cancel my order?',
    a: 'You can cancel or modify your order within 5 minutes of placing it. Contact our support team for assistance.',
  },
  {
    q: 'Do you deliver outside Kathmandu?',
    a: 'Yes, we deliver to major cities across Nepal. Delivery times may vary.',
  },
  {
    q: 'What if I receive a damaged product?',
    a: 'We offer a 100% satisfaction guarantee. Please contact us within 24 hours and we\'ll replace or refund it.',
  },
  {
    q: 'How do I track my order?',
    a: 'You can track your order in the "My Orders" section after logging in. We also send SMS updates.',
  },
  {
    q: 'Are your products organic?',
    a: 'We prioritize fresh, locally sourced produce. Many items are organic, but we recommend checking individual product descriptions.',
  },
];

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-semibold text-ink mb-2">❓ Frequently Asked Questions</h1>
      <p className="text-ink/55 mb-8">Find answers to the most common questions about FreshCart.</p>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-stone-50 transition text-left"
            >
              <span className="font-display font-medium text-ink">{faq.q}</span>
              {openIndex === idx ? (
                <ChevronUp className="w-5 h-5 text-ink/40 flex-shrink-0" strokeWidth={1.75} />
              ) : (
                <ChevronDown className="w-5 h-5 text-ink/40 flex-shrink-0" strokeWidth={1.75} />
              )}
            </button>
            {openIndex === idx && (
              <div className="px-5 pb-5 bg-white">
                <p className="text-ink/60">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;