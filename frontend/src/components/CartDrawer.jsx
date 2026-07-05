import toast from 'react-hot-toast';

const CartDrawer = ({ isOpen, onClose, cart, onUpdateQty, onRemove, onCheckout, checkingOut }) => {
  const itemsTotal = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.product._id} className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-14 h-14 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {item.product.imageUrl ? (
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">🛒</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">{item.product.name}</p>
                  <p className="text-xs text-gray-500">${item.product.price.toFixed(2)} / {item.product.unit}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => onUpdateQty(item.product._id, Math.max(1, item.quantity - 1))}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      −
                    </button>
                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQty(item.product._id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.product._id)}
                  className="text-gray-400 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t border-gray-100">
            <div className="flex justify-between mb-4">
              <span className="text-gray-600">Items total</span>
              <span className="font-bold text-gray-900">${itemsTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={checkingOut}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition"
            >
              {checkingOut ? 'Placing order...' : 'Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
