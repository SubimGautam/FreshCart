import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, ShoppingBag, Truck, Store, Banknote, Smartphone, Landmark } from 'lucide-react';
import { getOrderByIdRequest } from '../services/orderService';
import OrderStatusTracker from '../components/OrderStatusTracker';

const paymentLabels = {
  cash_on_delivery: { label: 'Cash on delivery', icon: Banknote },
  esewa: { label: 'eSewa', icon: Smartphone },
  mobile_banking: { label: 'Mobile banking', icon: Landmark },
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByIdRequest(id)
      .then((data) => setOrder(data.order))
      .catch((err) => toast.error(err.message || 'Could not load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="text-ink/50 mb-4">Order not found.</p>
        <Link to="/orders" className="text-primary-600 hover:underline font-medium">Back to my orders</Link>
      </div>
    );
  }

  const payment = paymentLabels[order.paymentMethod] || paymentLabels.cash_on_delivery;
  const PaymentIcon = payment.icon;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-primary-600 mb-6">
        <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> Back to my orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-display font-semibold text-ink">Order #{order._id.slice(-8)}</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-card p-6 mb-6">
        <OrderStatusTracker status={order.status} fulfillmentMethod={order.fulfillmentMethod} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            {order.fulfillmentMethod === 'pickup' ? (
              <Store className="w-4 h-4 text-primary-600" strokeWidth={1.75} />
            ) : (
              <Truck className="w-4 h-4 text-primary-600" strokeWidth={1.75} />
            )}
            {order.fulfillmentMethod === 'pickup' ? 'Pickup' : 'Delivery address'}
          </div>
          {order.fulfillmentMethod === 'pickup' ? (
            <p className="text-sm text-ink/60">We'll share the outlet address and pickup window once confirmed.</p>
          ) : (
            <p className="text-sm text-ink/60">
              {order.shippingAddress?.line1}{order.shippingAddress?.line2 ? `, ${order.shippingAddress.line2}` : ''}
              <br />
              {order.shippingAddress?.city}{order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''} {order.shippingAddress?.postalCode}
              <br />
              {order.shippingAddress?.country}
            </p>
          )}
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-2">
            <PaymentIcon className="w-4 h-4 text-primary-600" strokeWidth={1.75} />
            Payment method
          </div>
          <p className="text-sm text-ink/60">{payment.label}</p>
          <p className="text-xs text-ink/40 mt-1 capitalize">Payment status: {order.paymentStatus}</p>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl shadow-card p-6">
        <h2 className="font-display font-semibold text-lg text-ink mb-4">Items</h2>
        <div className="space-y-3 mb-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-ink/70">{item.name} × {item.quantity}</span>
              <span className="font-display font-medium text-ink tabular">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-100 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-ink/60">
            <span>Items total</span>
            <span className="tabular">${order.itemsTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-ink/60">
            <span>Delivery fee</span>
            <span className="tabular">{order.deliveryFee === 0 ? 'Free' : `$${order.deliveryFee.toFixed(2)}`}</span>
          </div>
        </div>
        <div className="border-t border-stone-200 mt-3 pt-3 flex justify-between font-display font-semibold text-ink text-lg">
          <span>Total</span>
          <span className="tabular">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 mt-6 text-primary-600 hover:text-primary-700 font-medium text-sm"
      >
        <ShoppingBag className="w-4 h-4" strokeWidth={1.75} /> Continue shopping
      </button>
    </div>
  );
};

export default OrderDetailPage;
