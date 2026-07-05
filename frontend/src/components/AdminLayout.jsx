import { NavLink, Outlet, Link } from 'react-router-dom';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '🛒' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
];

const AdminLayout = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex">
      <aside className="w-60 bg-ink text-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <span className="font-display font-extrabold text-white text-lg">FreshCart</span>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link to="/dashboard" className="text-sm text-gray-400 hover:text-white transition flex items-center gap-2">
            ← Back to Shop
          </Link>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ink z-40 flex justify-around py-2 border-t border-white/10">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `text-xl px-2 ${isActive ? 'text-flash-400' : 'text-gray-400'}`}
            title={item.label}
          >
            {item.icon}
          </NavLink>
        ))}
      </div>

      <main className="flex-1 overflow-x-hidden pb-16 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
