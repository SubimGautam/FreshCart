import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getWishlistRequest, addToWishlistRequest, removeFromWishlistRequest } from '../services/wishlistService';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    try {
      const data = await getWishlistRequest();
      setWishlist(data.wishlist);
    } catch (err) {
      // silent fail - user may just not have a wishlist yet
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = (productId) => wishlist.some((p) => p._id === productId);

  const addToWishlist = async (productId) => {
    const data = await addToWishlistRequest(productId);
    setWishlist(data.wishlist);
  };

  const removeFromWishlist = async (productId) => {
    const data = await removeFromWishlistRequest(productId);
    setWishlist(data.wishlist);
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const value = { wishlist, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist, refetchWishlist: fetchWishlist };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
