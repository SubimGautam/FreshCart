import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Truck, Store, CreditCard, Banknote, Smartphone, Landmark,
  Check, Plus, ShoppingBag, Lock, AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { getAddressesRequest, addAddressRequest } from '../services/userService';
import { placeOrderRequest } from '../services/orderService';
import OrderConfirmation from '../components/OrderConfirmation';

const TAX_RATE = 0.08;
const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_THRESHOLD = 50;

const emptyAddress = { label: 'Home', fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '' };

const steps = [
  { key: 'cart', label: 'Cart' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'payment', label: 'Payment' },
  { key: 'confirmation', label: 'Confirmation' },
];

const Stepper = ({ step }) => {
  const currentIndex = steps.findIndex((s) => s.key === step);
  const navigate = useNavigate();

  return (
    <div className="flex items-center flex-wrap">
      {steps.map((s, i) => {
        const isPastOrCart = i < currentIndex || s.key === 'cart';
        const active = s.key === step;
        return (
          <div key={s.key} className="flex items-center">
            {i > 0 && <span className="w-8 h-px bg-stone-300 mx-2" />}
            <button
              type="button"
              disabled={s.key !== 'cart' || step === 'confirmation'}
              onClick={() => s.key === 'cart' && navigate('/cart')}
              className={`flex items-center gap-1.5 text-sm ${
                active ? 'text-ink font-semibold' : isPastOrCart ? 'text-primary-600 font-medium' : 'text-ink/35'
              } ${s.key === 'cart' && step !== 'confirmation' ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {isPastOrCart && !active ? (
                <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <Check className="w-3 h-3" strokeWidth={2.5} />
                </span>
              ) : (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${active ? 'bg-primary-600 text-white' : 'bg-stone-100 text-ink/40'}`}>
                  {i + 1}
                </span>
              )}
              {s.label}
            </button>
          </div>
        );
      })}
    </div>
  );
};

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCartLocally } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState('shipping');

  const [fulfillment, setFulfillment] = useState('delivery');
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [savingAddress, setSavingAddress] = useState(false);

  const [email, setEmail] = useState(user?.email || '');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [order, setOrder] = useState(null);

  const hasPhone = Boolean(user?.phone);

  useEffect(() => {
    if (fulfillment !== 'delivery') return;
    getAddressesRequest()
      .then((data) => {
        setAddresses(data.addresses);
        const preferred = data.addresses.find((a) => a.isDefault) || data.addresses[0];
        if (preferred) setSelectedAddressId(preferred._id);
        if (data.addresses.length === 0) setShowAddressForm(true);
      })
      .catch(() => {});
  }, [fulfillment]);

  const getPrice = (product) =>
    (product?.discountPrice && product.discountPrice < product.price ? product.discountPrice : product?.price) || 0;

  const subtotal = cart.reduce((sum, item) => sum + getPrice(item.product) * item.quantity, 0);
  const shipping = fulfillment === 'pickup' || subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + shipping + tax;

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const data = await addAddressRequest({ ...addressForm, country: 'Nepal' });
      setAddresses(data.addresses);
      const added = data.addresses[data.addresses.length - 1];
      if (added) setSelectedAddressId(added._id);
      setAddressForm(emptyAddress);
      setShowAddressForm(false);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message || 'Could not save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const canContinueToPayment =
    hasPhone && email.trim() && (fulfillment === 'pickup' || Boolean(selectedAddressId));

  const handleContinueToPayment = () => {
    if (!hasPhone) {
      toast.error('Please add a phone number to your profile first');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (fulfillment === 'delivery' && !selectedAddressId) {
      toast.error('Please select or add a delivery address');
      return;
    }
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!agreedToTerms) {
      toast.error('Please agree to the Terms and Conditions');
      return;
    }

    setPlacingOrder(true);
    try {
      const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
      const payload = {
        fulfillmentMethod: fulfillment,
        shippingAddress: fulfillment === 'delivery' ? selectedAddress : undefined,
        paymentMethod,
      };

      const data = await placeOrderRequest(payload);
      setOrder(data.order);
      clearCartLocally();
      setStep('confirmation');
    } catch (err) {
      toast.error(err.message || 'Could not place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cart.length === 0 && step !== 'confirmation') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-stone-300" strokeWidth={1.25} />
        <h1 className="text-2xl font-display font-semibold text-ink mb-2">Your cart is empty</h1>
        <p className="text-ink/50 mb-6">Add a few items before checking out.</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-medium transition"
        >
          Start shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
        <h1 className="text-3xl font-display font-semibold text-ink">Checkout</h1>
        <Stepper step={step} />
      </div>

      {step === 'confirmation' ? (
        <OrderConfirmation order={order} onContinueShopping={() => navigate('/dashboard')} />
      ) : (
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-8">
            {step === 'shipping' && (
              <>
                <div>
                  <h2 className="font-display font-semibold text-lg text-ink mb-3">Fulfillment method</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFulfillment('delivery')}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 text-left transition ${
                        fulfillment === 'delivery' ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${fulfillment === 'delivery' ? 'border-primary-600 bg-primary-600' : 'border-stone-300'}`} />
                      <Truck className="w-5 h-5 text-ink/60" strokeWidth={1.75} />
                      <span className="font-medium text-ink text-sm">Delivery</span>
                    </button>
                    <button
                      onClick={() => setFulfillment('pickup')}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 text-left transition ${
                        fulfillment === 'pickup' ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${fulfillment === 'pickup' ? 'border-primary-600 bg-primary-600' : 'border-stone-300'}`} />
                      <Store className="w-5 h-5 text-ink/60" strokeWidth={1.75} />
                      <span className="font-medium text-ink text-sm">Pick up</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="font-display font-semibold text-lg text-ink mb-3">Contact</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-ink/60 mb-1">
                        Email address <span className="text-deal-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-lg focus:ring-1 focus:ring-primary-400 focus:border-primary-400 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-ink/60 mb-1">
                        Phone number <span className="text-deal-500">*</span>
                      </label>
                      {hasPhone ? (
                        <input
                          type="tel"
                          value={user.phone}
                          disabled
                          className="w-full px-4 py-2.5 border border-stone-200 rounded-lg bg-stone-50 text-ink/70"
                        />
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2.5 border border-deal-200 bg-deal-50 rounded-lg">
                          <AlertCircle className="w-4 h-4 text-deal-600 flex-shrink-0" strokeWidth={1.75} />
                          <span className="text-sm text-deal-600">Number required —</span>
                          <Link to="/profile" className="text-sm font-medium text-deal-700 hover:underline">
                            add it in your profile
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {fulfillment === 'delivery' ? (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-display font-semibold text-lg text-ink">Delivery address</h2>
                      {!showAddressForm && (
                        <button
                          onClick={() => setShowAddressForm(true)}
                          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={2} /> Add new
                        </button>
                      )}
                    </div>

                    {!showAddressForm && addresses.length > 0 && (
                      <div className="space-y-2.5">
                        {addresses.map((addr) => (
                          <label
                            key={addr._id}
                            className={`flex items-start gap-3 border rounded-xl px-4 py-3 cursor-pointer transition ${
                              selectedAddressId === addr._id ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                              className="mt-1 w-4 h-4 accent-primary-600"
                            />
                            <div className="text-sm">
                              <p className="font-medium text-ink">
                                {addr.label} {addr.isDefault && <span className="text-[11px] text-primary-600 font-normal">(default)</span>}
                              </p>
                              <p className="text-ink/60">{addr.fullName} · {addr.phone}</p>
                              <p className="text-ink/60">
                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}{addr.state ? `, ${addr.state}` : ''}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}

                    {showAddressForm && (
                      <form onSubmit={handleAddAddress} className="bg-stone-50 rounded-xl p-5 space-y-3 border border-stone-200">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            placeholder="Label (e.g. Home)"
                            value={addressForm.label}
                            onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                          <input
                            required
                            placeholder="Full name"
                            value={addressForm.fullName}
                            onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                        </div>
                        <input
                          required
                          placeholder="Phone number"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                        />
                        <input
                          required
                          placeholder="Address line 1"
                          value={addressForm.line1}
                          onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                        />
                        <input
                          placeholder="Address line 2 (optional)"
                          value={addressForm.line2}
                          onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm"
                        />
                        <div className="grid grid-cols-3 gap-3">
                          <input
                            required
                            placeholder="City"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                          <input
                            placeholder="State"
                            value={addressForm.state}
                            onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                          <input
                            required
                            placeholder="ZIP / Postal code"
                            value={addressForm.postalCode}
                            onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={savingAddress}
                            className="bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-full transition"
                          >
                            {savingAddress ? 'Saving...' : 'Save address'}
                          </button>
                          {addresses.length > 0 && (
                            <button type="button" onClick={() => setShowAddressForm(false)} className="text-ink/50 hover:text-ink text-sm px-5 py-2">
                              Cancel
                            </button>
                          )}
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm text-ink/60">
                    Pick up from our FreshCart outlet — we'll share the exact address and a pickup time window once your order is confirmed.
                  </div>
                )}

                <button
                  onClick={handleContinueToPayment}
                  disabled={!canContinueToPayment}
                  className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 disabled:bg-stone-200 disabled:text-ink/30 disabled:cursor-not-allowed text-white font-medium px-8 py-3 rounded-full transition"
                >
                  Continue to payment
                </button>
              </>
            )}

            {step === 'payment' && (
              <>
                <div>
                  <h2 className="font-display font-semibold text-lg text-ink mb-3">Payment method</h2>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <button
                      onClick={() => setPaymentMethod('cash_on_delivery')}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 text-left transition ${
                        paymentMethod === 'cash_on_delivery' ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod === 'cash_on_delivery' ? 'border-primary-600 bg-primary-600' : 'border-stone-300'}`} />
                      <Banknote className="w-5 h-5 text-ink/60" strokeWidth={1.75} />
                      <span className="font-medium text-ink text-sm">Cash on delivery</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod((m) => (m === 'cash_on_delivery' ? 'esewa' : m))}
                      className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 text-left transition ${
                        paymentMethod !== 'cash_on_delivery' ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${paymentMethod !== 'cash_on_delivery' ? 'border-primary-600 bg-primary-600' : 'border-stone-300'}`} />
                      <CreditCard className="w-5 h-5 text-ink/60" strokeWidth={1.75} />
                      <span className="font-medium text-ink text-sm">Online payment</span>
                    </button>
                  </div>

                  {paymentMethod !== 'cash_on_delivery' && (
                    <div className="grid grid-cols-2 gap-3">
                      <label
                        className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 cursor-pointer transition ${
                          paymentMethod === 'esewa' ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="online-method"
                          checked={paymentMethod === 'esewa'}
                          onChange={() => setPaymentMethod('esewa')}
                          className="w-4 h-4 accent-primary-600"
                        />
                        <Smartphone className="w-4 h-4 text-ink/60" strokeWidth={1.75} />
                        <span className="text-sm font-medium text-ink">eSewa</span>
                      </label>
                      <label
                        className={`flex items-center gap-2.5 border rounded-xl px-4 py-3 cursor-pointer transition ${
                          paymentMethod === 'mobile_banking' ? 'border-primary-500 bg-primary-50/60' : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="online-method"
                          checked={paymentMethod === 'mobile_banking'}
                          onChange={() => setPaymentMethod('mobile_banking')}
                          className="w-4 h-4 accent-primary-600"
                        />
                        <Landmark className="w-4 h-4 text-ink/60" strokeWidth={1.75} />
                        <span className="text-sm font-medium text-ink">Mobile banking</span>
                      </label>
                    </div>
                  )}

                  {paymentMethod !== 'cash_on_delivery' && (
                    <p className="text-xs text-ink/45 mt-3">
                      Online payment gateway integration is in progress — placing the order now will reserve your items and we'll confirm payment with you directly.
                    </p>
                  )}
                </div>

                <label className="flex items-start gap-2.5 text-sm text-ink/60">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 accent-primary-600"
                  />
                  I have read and agree to the Terms and Conditions.
                </label>

                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="text-ink/50 hover:text-ink text-sm font-medium"
                >
                  ← Back to shipping
                </button>
              </>
            )}
          </div>

          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-white rounded-xl border border-stone-200 shadow-card p-6">
              <h2 className="font-display font-semibold text-lg text-ink mb-4">Review your cart</h2>
              <div className="space-y-4 mb-5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-stone-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-stone-300" strokeWidth={1.5} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink leading-snug">{item.product.name}</p>
                      <p className="text-xs text-ink/45">{item.quantity}x</p>
                    </div>
                    <p className="text-sm font-display font-semibold text-ink tabular">
                      ${(getPrice(item.product) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-ink/60">
                  <span>Subtotal</span>
                  <span className="tabular">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Shipping</span>
                  <span className="tabular">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-ink/60">
                  <span>Tax (8%)</span>
                  <span className="tabular">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-stone-200 mt-3 pt-3 flex justify-between font-display font-semibold text-ink text-lg">
                <span>Total</span>
                <span className="tabular">${grandTotal.toFixed(2)}</span>
              </div>

              {step === 'payment' && (
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full mt-5 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-display font-semibold py-3.5 rounded-full transition"
                >
                  {placingOrder ? 'Placing order...' : 'Place order'}
                </button>
              )}

              <div className="flex items-start gap-2.5 mt-5 pt-5 border-t border-stone-100">
                <Lock className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" strokeWidth={1.75} />
                <div>
                  <p className="text-sm font-medium text-ink">Secure checkout</p>
                  <p className="text-xs text-ink/45 mt-0.5">Your information is encrypted and safe with us at every step.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
