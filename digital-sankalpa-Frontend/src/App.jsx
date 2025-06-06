import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { CartProvider } from './contexts/CartContext';
import { PopupProvider } from './contexts/PopupContext';
import { ToastProvider } from './contexts/ToastContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboard from './pages/AdminDashboard';
import WarrantyPage from './pages/WarrantyPage';
import ContactPage from './pages/ContactPage';
import WishlistPage from './pages/WishlistPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


function AppContent() {
  const { pathname } = useLocation();
  const hideHeaderFooter = ['/login', '/register', '/forgot-password'].includes(pathname);

  return (
    <CartProvider>
      <ToastProvider>
        <PopupProvider>
        <div className="flex flex-col min-h-screen">
        {!hideHeaderFooter && <Header />}
        <main className={`flex-grow container mx-auto ${hideHeaderFooter ? 'p-0' : 'px-4 py-6'}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/admin_dash" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
            <Route path="/warranty" element={<WarrantyPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {!hideHeaderFooter && <Footer />}
        </div>
        </PopupProvider>
      </ToastProvider>
    </CartProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;