import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.message || 'Could not send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-semibold text-ink mb-2">📬 Contact Us</h1>
      <p className="text-ink/55 mb-8">Have a question or suggestion? We’d love to hear from you.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Your Name</label>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={form.subject}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink/70 mb-1">Message</label>
          <textarea
            name="message"
            required
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-full transition"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      <div className="mt-12 grid sm:grid-cols-2 gap-6 border-t border-stone-200 pt-8">
        <div>
          <h3 className="font-display font-semibold text-ink">📍 Our Address</h3>
          <p className="text-ink/55 mt-1">123 FreshCart Lane, Kathmandu, Nepal</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink">📞 Phone</h3>
          <p className="text-ink/55 mt-1">+977 1 234 5678</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink">🕒 Working Hours</h3>
          <p className="text-ink/55 mt-1">Mon–Sat: 9:00 AM – 8:00 PM</p>
        </div>
        <div>
          <h3 className="font-display font-semibold text-ink">✉️ Email</h3>
          <p className="text-ink/55 mt-1">support@freshcart.com</p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;