import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getDashboardStatsRequest } from '../../services/adminService';
import StatCard from '../../components/StatCard';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStatsRequest()
      .then((data) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      })
      .catch((err) => toast.error(err.message || 'Could not load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="💰" label="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} color="deal" />
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} color="primary" />
        <StatCard icon="🛒" label="Total Products" value={stats.totalProducts} color="flash" />
        <StatCard icon="👥" label="Total Users" value={stats.totalUsers} color="ink" />
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-display font-bold text-ink text-lg">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:underline font-bold">
            View all →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-left">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8)}</td>
                    <td className="px-5 py-3 font-medium text-ink">{order.user?.name || 'Unknown'}</td>
                    <td className="px-5 py-3 font-bold text-deal-600">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
