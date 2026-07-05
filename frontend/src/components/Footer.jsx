import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-ink text-gray-300 mt-16 border-t-4 border-flash-400">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-2xl">🛒</span>
            <span className="text-xl font-display font-extrabold text-white">
              Fresh<span className="text-deal-400">Cart</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Fresh groceries, delivered fast, every single day.
          </p>
        </div>

        <div>
          <h4 className="text-flash-400 font-display font-bold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-white transition">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-flash-400 font-display font-bold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-flash-400 font-display font-bold mb-3">Account</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/dashboard" className="hover:text-white transition">Shop</Link></li>
            <li><Link to="/orders" className="hover:text-white transition">My Orders</Link></li>
            <li><Link to="/wishlist" className="hover:text-white transition">Wishlist</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-4">
        <p className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} FreshCart. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
