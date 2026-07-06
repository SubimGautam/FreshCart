import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cream border-t border-stone-200 mt-16">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-full bg-primary-600 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </span>
            <span className="text-lg font-display font-semibold text-ink">FreshCart</span>
          </div>
          <p className="text-sm text-ink/50">
            Fresh groceries, delivered with care, every single day.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-ink/40 uppercase tracking-wider mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/about" className="hover:text-primary-700 transition">About us</Link></li>
            <li><Link to="/contact" className="hover:text-primary-700 transition">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-primary-700 transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-ink/40 uppercase tracking-wider mb-3">Legal</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/privacy-policy" className="hover:text-primary-700 transition">Privacy policy</Link></li>
            <li><Link to="/terms" className="hover:text-primary-700 transition">Terms &amp; conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-ink/40 uppercase tracking-wider mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-ink/60">
            <li><Link to="/dashboard" className="hover:text-primary-700 transition">Shop</Link></li>
            <li><Link to="/orders" className="hover:text-primary-700 transition">My orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-primary-700 transition">Wishlist</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-200 py-4">
        <p className="text-center text-xs text-ink/40">
          © {new Date().getFullYear()} FreshCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
