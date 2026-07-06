import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Leaf, Heart, ShoppingBag, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const isLandingPage = location.pathname === '/';
  const showMarketingNav = isLandingPage || !isAuthenticated;

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

  // Logged-in users: logo always targets /dashboard. If already there,
  // skip navigation and just reset the page (scroll to top + clear filters)
  // instead of forcing a full reload.
  const logoTarget = isAuthenticated ? '/dashboard' : '/';

  const handleLogoClick = (e) => {
    if (isAuthenticated && location.pathname === '/dashboard') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('freshcart:reset-dashboard'));
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6">
        <div className={`flex items-center h-16 gap-6 ${isLandingPage ? 'justify-start' : 'justify-between'}`}>
          <Link to={logoTarget} onClick={handleLogoClick} className="flex items-center gap-2 flex-shrink-0">
            <span className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2} />
            </span>
            <span className="text-xl font-display font-semibold text-ink hidden sm:inline">
              FreshCart
            </span>
          </Link>

          {showMarketingNav ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-[15px] text-ink/70 hover:text-primary-700 font-medium transition">
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-primary-600 hover:bg-primary-700 text-white text-sm px-5 py-2 rounded-full font-medium transition"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-5">
              <Link to="/dashboard" className="text-[15px] text-ink/70 hover:text-primary-700 font-medium transition hidden sm:inline">
                Shop
              </Link>

              <Link to="/wishlist" className="relative text-ink/70 hover:text-deal-500 transition" title="Wishlist">
                <Heart className="w-6 h-6" strokeWidth={1.75} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-deal-500 text-white text-[11px] font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-cream">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <Link to="/cart" className="relative text-ink/70 hover:text-primary-700 transition" title="Cart">
                <ShoppingBag className="w-6 h-6" strokeWidth={1.75} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary-600 text-white text-[11px] font-semibold rounded-full min-w-[20px] h-[20px] flex items-center justify-center border-2 border-cream animate-pop">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 text-ink/70 hover:text-primary-700 transition"
                >
                  <span className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-base font-semibold overflow-hidden border border-primary-200">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || 'U'
                    )}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-card border border-stone-200 py-1 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-stone-100 bg-primary-50/60">
                      <p className="text-sm font-semibold text-ink truncate">{user?.name}</p>
                      <p className="text-xs text-ink/50 truncate">{user?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-ink/70 hover:bg-primary-50">
                      My profile
                    </Link>
                    <Link to="/orders" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-ink/70 hover:bg-primary-50">
                      My orders
                    </Link>
                    <Link to="/wishlist" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-ink/70 hover:bg-primary-50 sm:hidden">
                      Wishlist
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-700 hover:bg-primary-50">
                        <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.75} /> Admin dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-deal-600 hover:bg-deal-50 border-t border-stone-100"
                    >
                      <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
