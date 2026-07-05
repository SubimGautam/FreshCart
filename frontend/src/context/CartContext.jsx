import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getCartRequest,
  addToCartRequest,
  updateCartItemRequest,
  removeFromCartRequest,
} from '../services/cartService';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }
    try {
      const data = await getCartRequest();
      setCart(data.cart);
    } catch (err) {
      // silent fail
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    const data = await addToCartRequest(productId, quantity);
    setCart(data.cart);
  };

  const updateCartItem = async (productId, quantity) => {
    const data = await updateCartItemRequest(productId, quantity);
    setCart(data.cart);
  };

  const removeFromCart = async (productId) => {
    const data = await removeFromCartRequest(productId);
    setCart(data.cart);
  };

  const clearCartLocally = () => setCart([]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItemsTotal = cart.reduce((sum, item) => sum + (item.product?.finalPrice ?? item.product?.price ?? 0) * item.quantity, 0);

  const value = {
    cart,
    cartItemCount,
    cartItemsTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCartLocally,
    refetchCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
