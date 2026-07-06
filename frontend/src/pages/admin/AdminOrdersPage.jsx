import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAllOrdersRequest, updateOrderStatusRequest } from '../../services/adminService';

const statusOptions = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrdersRequest();
      setOrders(data.orders);
    } catch (err) {
      toast.error('Could not load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatusRequest(orderId, status);
      toast.success('Order status updated');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status } : o)));
    } catch (err) {
      toast.error(err.message || 'Could not update status');
    }
  };

  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">📦 Manage Orders</h1>

      <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <p className="text-gray-500 p-6 text-center">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium text-left">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <>
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    >
                      <td className="px-5 py-3 font-mono text-xs text-gray-500">#{order._id.slice(-8)}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-ink">{order.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email}</p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td className="px-5 py-3 font-bold text-deal-600">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-5 py-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className={`px-2.5 py-1 rounded-full text-xs font-bold border-2 border-transparent outline-none cursor-pointer ${statusColors[order.status]}`}
                        >
                          {statusOptions.map((s) => (
                            <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                    {expandedId === order._id && (
                      <tr key={`${order._id}-detail`}>
                        <td colSpan={6} className="px-5 py-4 bg-primary-50">
                          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Items</p>
                          <ul className="space-y-1 mb-3">
                            {order.items.map((item, i) => (
                              <li key={i} className="text-sm text-gray-700">
                                {item.name} × {item.quantity} — <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">Shipping Address</p>
                          <p className="text-sm text-gray-700">
                            {order.shippingAddress.line1}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                          </p>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
