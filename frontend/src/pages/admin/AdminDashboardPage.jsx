import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboardStatsRequest } from '../../services/adminService';
import api from '../../services/api';
import {
  DollarSign, ShoppingBag, Package, Users, TrendingUp, TrendingDown,
  Eye, PlusCircle, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle,
  Calendar, CreditCard, FileText, MoreHorizontal
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar
} from 'recharts';

// ---- Color palette ----
const COLORS = {
  primary: '#66804c',
  deal: '#e07c3c',
  flash: '#f5c542',
  ink: '#23271f',
  grey: '#8a8f87',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  orange: '#f97316',
  green: '#22c55e',
  red: '#ef4444',
  yellow: '#f59e0b',
};

// ---- Status colors ----
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusBadgeColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  out_for_delivery: '#f97316',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

// ---- Stat Card Component ----
const StatCard = ({ icon, label, value, change, changeType, color, subtitle }) => {
  const colorMap = {
    primary: 'from-primary-500 to-primary-700',
    deal: 'from-deal-500 to-deal-700',
    flash: 'from-flash-400 to-flash-600',
    ink: 'from-gray-700 to-gray-900',
    blue: 'from-blue-500 to-blue-700',
    purple: 'from-purple-500 to-purple-700',
    orange: 'from-orange-500 to-orange-700',
    green: 'from-green-500 to-green-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} rounded-2xl p-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{label}</p>
          <p className="text-3xl font-display font-extrabold mt-1">{value}</p>
          {subtitle && <p className="text-xs opacity-70 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white/20 rounded-xl p-2.5 backdrop-blur-sm">
          {icon}
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1 mt-3 text-sm font-medium">
          {changeType === 'up' ? (
            <TrendingUp size={16} className="text-green-300" />
          ) : (
            <TrendingDown size={16} className="text-red-300" />
          )}
          <span className={changeType === 'up' ? 'text-green-300' : 'text-red-300'}>
            {change}
          </span>
          <span className="opacity-70 text-xs ml-1">vs last month</span>
        </div>
      )}
    </div>
  );
};

// ---- Main Component ----
const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loadingLowStock, setLoadingLowStock] = useState(false);

  // ---- Fetch dashboard stats ----
  useEffect(() => {
    getDashboardStatsRequest()
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      })
      .catch((err) => toast.error(err.message || 'Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  // ---- Fetch low stock products ----
  useEffect(() => {
    const fetchLowStock = async () => {
      setLoadingLowStock(true);
      try {
        const res = await api.get('/products?limit=100');
        const products = res.data.products || [];
        const lowStock = products
          .filter(p => p.stock < 10 && p.isActive)
          .sort((a, b) => a.stock - b.stock)
          .slice(0, 5);
        setLowStockProducts(lowStock);
      } catch (err) {
        // silent fail – non‑critical
      } finally {
        setLoadingLowStock(false);
      }
    };
    fetchLowStock();
  }, []);

  // ---- Compute chart data ----
  const { revenueTrend, orderStatusData } = useMemo(() => {
    if (!recentOrders.length) {
      return {
        revenueTrend: [{ date: 'No orders', revenue: 0 }],
        orderStatusData: [{ name: 'No orders', value: 1 }],
      };
    }

    // Revenue trend
    const dateMap = {};
    recentOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      dateMap[date] = (dateMap[date] || 0) + order.totalAmount;
    });
    const trend = Object.keys(dateMap)
      .map((date) => ({ date, revenue: dateMap[date] }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Order status distribution
    const statusCount = {};
    recentOrders.forEach((order) => {
      const key = order.status;
      statusCount[key] = (statusCount[key] || 0) + 1;
    });
    const statusData = Object.keys(statusCount).map((key) => ({
      name: key.replace('_', ' ').charAt(0).toUpperCase() + key.replace('_', ' ').slice(1),
      value: statusCount[key],
    }));

    return { revenueTrend: trend, orderStatusData: statusData };
  }, [recentOrders]);

  // ---- Compute top products from recent orders ----
  const topProducts = useMemo(() => {
    const productMap = {};
    recentOrders.forEach(order => {
      order.items?.forEach(item => {
        if (!productMap[item.name]) {
          productMap[item.name] = { name: item.name, revenue: 0, quantity: 0 };
        }
        productMap[item.name].revenue += item.price * item.quantity;
        productMap[item.name].quantity += item.quantity;
      });
    });
    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [recentOrders]);

  // ---- Compute average order value ----
  const avgOrderValue = stats?.totalOrders > 0
    ? stats.totalRevenue / stats.totalOrders
    : 0;

  // ---- Status counts for mini cards ----
  const statusCounts = {};
  recentOrders.forEach(order => {
    statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
  });

  // ---- Filtered orders ----
  const filteredOrders = orderFilter === 'all'
    ? recentOrders
    : recentOrders.filter(o => o.status === orderFilter);

  // ---- Export CSV ----
  const exportCSV = () => {
    const headers = ['Order ID', 'Customer', 'Amount', 'Status', 'Date'];
    const rows = filteredOrders.map(order => [
      order._id.slice(-8),
      order.user?.name || 'Unknown',
      order.totalAmount.toFixed(2),
      order.status,
      new Date(order.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // ---- Loading state ----
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <AlertCircle className="w-12 h-12 text-stone-300" strokeWidth={1.25} />
        <p className="text-ink/50 mt-4">Could not load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-ink">📊 Dashboard</h1>
          <p className="text-ink/40 text-sm mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition shadow-lg shadow-primary-600/20">
            <PlusCircle size={16} /> New Order
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2.5 rounded-xl hover:bg-stone-100 transition text-ink/40 border border-stone-200"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={<DollarSign size={22} />}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          change="+12.5%"
          changeType="up"
          color="deal"
          subtitle={`${recentOrders.length} orders this period`}
        />
        <StatCard
          icon={<ShoppingBag size={22} />}
          label="Total Orders"
          value={stats.totalOrders}
          change="+8.2%"
          changeType="up"
          color="blue"
          subtitle={`${recentOrders.filter(o => o.status === 'delivered').length} completed`}
        />
        <StatCard
          icon={<Package size={22} />}
          label="Products"
          value={stats.totalProducts}
          change="+3"
          changeType="up"
          color="purple"
          subtitle="Active products"
        />
        <StatCard
          icon={<Users size={22} />}
          label="Customers"
          value={stats.totalUsers}
          change="+5.1%"
          changeType="up"
          color="green"
          subtitle="Total registered users"
        />
        <StatCard
          icon={<CreditCard size={22} />}
          label="Avg Order Value"
          value={`$${avgOrderValue.toFixed(2)}`}
          change="+3.2%"
          changeType="up"
          color="orange"
          subtitle={`from ${stats.totalOrders} orders`}
        />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink text-lg">Revenue Trend</h2>
            <span className="text-xs text-ink/40 bg-stone-50 px-3 py-1 rounded-full border border-stone-200">
              Last {recentOrders.length || 0} orders
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tickFormatter={(val) => `$${val}`} stroke="#94a3b8" />
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <Tooltip
                  formatter={(val) => `$${val}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.primary}
                  strokeWidth={2.5}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink text-lg">Order Status</h2>
            <span className="text-xs text-ink/40 bg-stone-50 px-3 py-1 rounded-full border border-stone-200">
              Distribution
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={statusBadgeColors[entry.name.toLowerCase().replace(' ', '_')] || COLORS.grey}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => `${val} orders`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low Stock & Top Products Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-ink text-lg">⚠️ Low Stock Alerts</h2>
            <Link to="/admin/products" className="text-xs text-primary-600 hover:underline">
              View all products
            </Link>
          </div>
          {loadingLowStock ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin h-6 w-6 border-4 border-primary-500 border-t-transparent rounded-full" />
            </div>
          ) : lowStockProducts.length === 0 ? (
            <p className="text-ink/40 text-center py-4 text-sm">✅ All products have sufficient stock</p>
          ) : (
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <Package size={20} className="text-stone-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">{product.name}</p>
                      <p className="text-xs text-ink/40">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-sm ${product.stock === 0 ? 'text-red-600' : 'text-orange-600'}`}>
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </p>
                    <Link to={`/admin/products`} className="text-xs text-primary-600 hover:underline">
                      Restock
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Products by Revenue */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-card p-5">
          <h2 className="font-display font-semibold text-ink text-lg mb-4">🏆 Top Products</h2>
          {topProducts.length === 0 ? (
            <p className="text-ink/40 text-center py-4 text-sm">No product data available</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-medium text-ink text-sm">{product.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-deal-600 text-sm">${product.revenue.toFixed(2)}</p>
                    <p className="text-xs text-ink/40">{product.quantity} units</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table with Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-card overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-wrap items-center justify-between p-5 border-b border-stone-100">
          <div>
            <h2 className="font-display font-semibold text-ink text-lg">Recent Orders</h2>
            <p className="text-xs text-ink/40 mt-0.5">Latest {recentOrders.length} orders</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 text-sm text-stone-600 hover:text-primary-600 font-medium transition bg-stone-50 hover:bg-primary-50 px-4 py-2 rounded-xl"
            >
              <FileText size={16} /> Export CSV
            </button>
            <Link
              to="/admin/orders"
              className="flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium transition bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-xl"
            >
              View All Orders <Eye size={16} />
            </Link>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="px-5 py-3 border-b border-stone-100 flex flex-wrap gap-2">
          <button
            onClick={() => setOrderFilter('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              orderFilter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All
          </button>
          {['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setOrderFilter(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition capitalize ${
                orderFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-12 h-12 mx-auto text-stone-300" strokeWidth={1.25} />
            <p className="text-ink/50 mt-3">No orders match the selected filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-500 font-medium text-left">
                <tr>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Order ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Customer</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Payment</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-primary-50/30 transition-colors duration-150">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-xs bg-stone-100 px-2.5 py-1 rounded-lg text-stone-600">
                        #{order._id.slice(-8)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">
                          {order.user?.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-ink">{order.user?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-deal-600">${order.totalAmount.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-stone-500">
                        <CreditCard size={14} className="text-stone-400" />
                        {order.paymentMethod?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1.5 text-xs text-stone-500">
                        <Calendar size={14} className="text-stone-400" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-xs bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition inline-block"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions Section */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg shadow-primary-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg">Add New Product</h3>
              <p className="text-sm opacity-80 mt-0.5">Expand your catalog</p>
            </div>
            <Link
              to="/admin/products"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-deal-500 to-deal-600 rounded-2xl p-5 text-white shadow-lg shadow-deal-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg">Manage Orders</h3>
              <p className="text-sm opacity-80 mt-0.5">Process & track orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm"
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-purple-600/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-semibold text-lg">Manage Users</h3>
              <p className="text-sm opacity-80 mt-0.5">Customer management</p>
            </div>
            <Link
              to="/admin/users"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-medium transition backdrop-blur-sm"
            >
              View Users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;