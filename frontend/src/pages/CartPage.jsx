import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const TAX_RATE = 0.08;
const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_THRESHOLD = 50;

const CartPage = () => {
  const { cart, updateCartItem, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleUpdateQty = async (productId, quantity) => {
    try {
      await updateCartItem(productId, Math.max(1, quantity));
    } catch (err) {
      toast.error(err.message || 'Could not update item');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      toast.success('Item removed from cart');
    } catch (err) {
      toast.error(err.message || 'Could not remove item');
    }
  };

  const getPrice = (product) => (product?.discountPrice && product.discountPrice < product.price ? product.discountPrice : product?.price) || 0;

  const subtotal = cart.reduce((sum, item) => sum + getPrice(item.product) * item.quantity, 0);
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-display font-extrabold text-ink mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-6 font-medium">Looks like you haven't added anything yet.</p>
        <Link to="/dashboard" className="bg-deal-500 hover:bg-deal-600 text-white px-8 py-3.5 rounded-full font-bold transition shadow-pop active:translate-y-0.5 active:shadow-none inline-block">
          Start Shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-display font-extrabold text-ink mb-6">🛒 Your Cart</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-4">
          {cart.map((item) => {
            const price = getPrice(item.product);
            return (
              <div key={item.product._id} className="bg-white rounded-2xl border-2 border-gray-100 shadow-card p-4 flex items-center gap-4">
                <Link to={`/products/${item.product._id}`} className="w-20 h-20 bg-gradient-to-br from-primary-50 to-cream rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🛒</span>
                  )}
                </Link>
                <div className="flex-1">
                  <Link to={`/products/${item.product._id}`} className="font-display font-bold text-ink hover:text-primary-600">
                    {item.product.name}
                  </Link>
                  <p className="text-sm text-gray-500 font-medium">${price.toFixed(2)} / {item.product.unit}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateQty(item.product._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQty(item.product._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display font-extrabold text-deal-600">${(price * item.quantity).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-sm text-red-500 hover:underline mt-1 font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl border-2 border-gray-100 shadow-card p-6 h-fit">
          <h2 className="font-display font-extrabold text-ink mb-4 text-lg">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free 🎉' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-gray-600 font-medium">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            {subtotal < FREE_SHIPPING_THRESHOLD && subtotal > 0 && (
              <p className="text-xs text-primary-700 bg-primary-50 rounded-xl p-2.5 mt-2 font-bold border border-primary-200">
                🚚 Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}
          </div>
          <div className="border-t-2 border-gray-100 mt-4 pt-4 flex justify-between font-display font-extrabold text-ink text-lg">
            <span>Grand Total</span>
            <span className="text-deal-600">${grandTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-display font-bold py-3.5 rounded-full transition mt-5 shadow-pop active:translate-y-0.5 active:shadow-none"
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
