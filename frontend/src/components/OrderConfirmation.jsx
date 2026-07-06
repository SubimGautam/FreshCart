import { Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import OrderStatusTracker from './OrderStatusTracker';

const OrderConfirmation = ({ order, onContinueShopping }) => {
  if (!order) return null;

  return (
    <div className="max-w-xl mx-auto text-center py-6">
      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-5">
        <CheckCircle2 className="w-9 h-9 text-primary-600" strokeWidth={1.75} />
      </div>
      <h1 className="text-2xl sm:text-3xl font-display font-semibold text-ink mb-2">Order placed successfully</h1>
      <p className="text-ink/55 mb-6">
        Thank you — your order <span className="font-medium text-ink">#{order._id?.slice(-8)}</span> has been received.
      </p>

      <div className="bg-white border border-stone-200 rounded-xl shadow-card p-6 text-left mb-6">
        <div className="mb-6">
          <OrderStatusTracker status={order.status} fulfillmentMethod={order.fulfillmentMethod} />
        </div>

        <div className="space-y-3 mb-4 border-t border-stone-100 pt-4">
          {order.items?.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-ink/70">{item.name} × {item.quantity}</span>
              <span className="font-display font-medium text-ink tabular">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-100 pt-3 flex justify-between font-display font-semibold text-ink">
          <span>Total</span>
          <span className="tabular">${order.totalAmount?.toFixed(2)}</span>
        </div>

        {order.paymentMethod !== 'cash_on_delivery' && order.paymentStatus === 'pending' && (
          <p className="text-xs text-deal-600 bg-deal-50 border border-deal-100 rounded-lg px-3 py-2 mt-4">
            Online payment integration is being finalized — we'll reach out to confirm payment for this order.
          </p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to={`/orders/${order._id}`}
          className="bg-white border border-stone-200 hover:bg-stone-50 text-ink px-6 py-2.5 rounded-full font-medium transition"
        >
          View order
        </Link>
        <button
          onClick={onContinueShopping}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-medium transition"
        >
          <ShoppingBag className="w-4 h-4" strokeWidth={1.75} /> Continue shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
