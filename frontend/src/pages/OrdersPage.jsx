import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PackageSearch, ChevronRight, ShoppingBag } from 'lucide-react';
import { getMyOrdersRequest } from '../services/orderService';

const statusStyles = {
  pending: 'bg-flash-300/50 text-flash-700',
  confirmed: 'bg-primary-100 text-primary-700',
  preparing: 'bg-primary-100 text-primary-700',
  out_for_delivery: 'bg-primary-600 text-white',
  delivered: 'bg-ink text-white',
  cancelled: 'bg-deal-100 text-deal-700',
};

const getStatusLabel = (status, fulfillmentMethod) => {
  const labels = {
    pending: 'Order placed',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    out_for_delivery: fulfillmentMethod === 'pickup' ? 'Ready for pickup' : 'Out for delivery',
    delivered: fulfillmentMethod === 'pickup' ? 'Picked up' : 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrdersRequest()
      .then((data) => setOrders(data.orders))
      .catch((err) => toast.error(err.message || 'Could not load your orders'))
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
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <h1 className="text-3xl font-display font-semibold text-ink mb-6">My orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
          <PackageSearch className="w-12 h-12 mx-auto mb-4 text-stone-300" strokeWidth={1.25} />
          <p className="text-ink/55 mb-6">You haven't placed any orders yet.</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-medium transition"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.75} /> Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="flex items-center justify-between gap-4 bg-white border border-stone-200 hover:border-primary-300 rounded-xl px-5 py-4 shadow-card transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs text-ink/45">#{order._id.slice(-8)}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[order.status]}`}>
                    {getStatusLabel(order.status, order.fulfillmentMethod)}
                  </span>
                </div>
                <p className="text-sm text-ink/60">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right flex items-center gap-3 flex-shrink-0">
                <span className="font-display font-semibold text-ink tabular">${order.totalAmount.toFixed(2)}</span>
                <ChevronRight className="w-4 h-4 text-ink/30" strokeWidth={1.75} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
