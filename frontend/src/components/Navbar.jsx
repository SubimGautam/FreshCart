import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="sticky top-0 z-50">
      <div className="bg-ink text-flash-400 text-xs font-bold py-1.5 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="px-8 flex-shrink-0">
              🔥 FREE DELIVERY ON ORDERS OVER $50 &nbsp;•&nbsp; 🎉 UP TO 30% OFF TODAY ONLY &nbsp;•&nbsp; 🍓 FRESH PICKS DAILY &nbsp;•&nbsp; 🚀 30-MIN DELIVERY
            </span>
          ))}
        </div>
      </div>

      <nav className="bg-white border-b-4 border-primary-600 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 gap-4">
            <Link to="/" className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-3xl">🛒</span>
              <span className="text-2xl font-display font-extrabold text-primary-600 hidden sm:inline">
                Fresh<span className="text-deal-500">Cart</span>
              </span>
            </Link>

            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for fresh deals..."
                className="w-full px-4 py-2 border-2 border-primary-200 rounded-l-full focus:ring-2 focus:ring-primary-400 focus:border-primary-400 outline-none transition text-sm font-medium"
              />
              <button
                type="submit"
                className="bg-deal-500 hover:bg-deal-600 text-white px-5 rounded-r-full transition font-bold"
              >
                🔍
              </button>
            </form>

            <div className="flex items-center gap-3 sm:gap-4">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-ink hover:text-primary-600 font-bold transition hidden sm:inline">
                    Shop
                  </Link>

                  <Link to="/wishlist" className="relative text-ink hover:text-deal-500 transition" title="Wishlist">
                    <span className="text-2xl">♡</span>
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-deal-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  <Link to="/cart" className="relative text-ink hover:text-primary-600 transition" title="Cart">
                    <span className="text-2xl">🛒</span>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-flash-500 text-ink text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white animate-pop">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>

                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="flex items-center gap-2 text-gray-700 hover:text-primary-700 transition"
                    >
                      <span className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-bold overflow-hidden border-2 border-primary-300">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user?.name?.[0]?.toUpperCase() || 'U'
                        )}
                      </span>
                    </button>

                    {profileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-gray-100 py-1 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-50 bg-primary-50">
                          <p className="text-sm font-bold text-ink truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50">
                          My Profile
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50">
                          My Orders
                        </Link>
                        <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-primary-50 sm:hidden">
                          Wishlist
                        </Link>
                        {user?.role === 'admin' && (
                          <Link to="/admin" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm font-bold text-deal-600 hover:bg-deal-50">
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 border-t border-gray-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-ink hover:text-primary-600 font-bold transition">
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-deal-500 hover:bg-deal-600 text-white px-5 py-2 rounded-full font-bold transition shadow-pop"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
