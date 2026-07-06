import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';

const StorefrontLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster position="top-center" />
            <Routes>
              <Route path="/" element={<StorefrontLayout><LandingPage /></StorefrontLayout>} />
              <Route path="/login" element={<StorefrontLayout><LoginPage /></StorefrontLayout>} />
              <Route path="/signup" element={<StorefrontLayout><SignupPage /></StorefrontLayout>} />
              <Route path="/products/:id" element={<StorefrontLayout><ProductDetailsPage /></StorefrontLayout>} />
              <Route path="/dashboard" element={<StorefrontLayout><ProtectedRoute><DashboardPage /></ProtectedRoute></StorefrontLayout>} />
              <Route path="/wishlist" element={<StorefrontLayout><ProtectedRoute><WishlistPage /></ProtectedRoute></StorefrontLayout>} />
              <Route path="/cart" element={<StorefrontLayout><ProtectedRoute><CartPage /></ProtectedRoute></StorefrontLayout>} />
              <Route path="/checkout" element={<StorefrontLayout><ProtectedRoute><CheckoutPage /></ProtectedRoute></StorefrontLayout>} />
              <Route path="/orders" element={<StorefrontLayout><ProtectedRoute><OrdersPage /></ProtectedRoute></StorefrontLayout>} />
              <Route path="/orders/:id" element={<StorefrontLayout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></StorefrontLayout>} />
              <Route path="/profile" element={<StorefrontLayout><ProtectedRoute><ProfilePage /></ProtectedRoute></StorefrontLayout>} />

              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="reviews" element={<AdminReviewsPage />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
