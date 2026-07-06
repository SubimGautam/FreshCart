import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getOrderByIdRequest } from '../services/orderService';
import OrderConfirmation from '../components/OrderConfirmation';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderByIdRequest(orderId)
      .then((data) => setOrder(data.order))
      .catch((err) => toast.error(err.message || 'Could not load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

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
        <p className="text-ink/50">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <OrderConfirmation order={order} onContinueShopping={() => navigate('/dashboard')} />
    </div>
  );
};

export default OrderConfirmationPage;
