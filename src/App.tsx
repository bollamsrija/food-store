import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import OrdersPage from './pages/OrdersPage';
import WishlistPage from './pages/WishlistPage';
import CategoriesPage from './pages/CategoriesPage';
import TrackOrderPage from './pages/TrackOrderPage';
import AdminPage from './pages/AdminPage';

function AppInner() {
  const [page, setPage] = useState('home');
  const [productSlug, setProductSlug] = useState('');
  const [shopCategory, setShopCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = (target: string) => {
    if (target.startsWith('product:')) {
      setProductSlug(target.replace('product:', ''));
      setPage('product');
    } else if (target.startsWith('shop?category=')) {
      setShopCategory(target.replace('shop?category=', ''));
      setPage('shop');
    } else {
      setShopCategory('');
      setPage(target);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePop = () => setPage('home');
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const noFooterPages = ['login', 'register', 'admin'];
  const noNavPages: string[] = [];
  const showFooter = !noFooterPages.includes(page);
  const showNav = !noNavPages.includes(page);

  const renderPage = () => {
    switch (page) {
      case 'home': return <HomePage onNavigate={navigate} />;
      case 'shop': return <ShopPage onNavigate={navigate} initialCategory={shopCategory} searchQuery={searchQuery} />;
      case 'categories': return <CategoriesPage onNavigate={navigate} />;
      case 'product': return <ProductPage slug={productSlug} onNavigate={navigate} />;
      case 'cart': return <CartPage onNavigate={navigate} />;
      case 'checkout': return <CheckoutPage onNavigate={navigate} />;
      case 'about': return <AboutPage onNavigate={navigate} />;
      case 'contact': return <ContactPage />;
      case 'login': return <AuthPage mode="login" onNavigate={navigate} />;
      case 'register': return <AuthPage mode="register" onNavigate={navigate} />;
      case 'orders': return <OrdersPage onNavigate={navigate} />;
      case 'wishlist': return <WishlistPage onNavigate={navigate} />;
      case 'track-order': return <TrackOrderPage />;
      case 'admin': return <AdminPage onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showNav && (
        <Navbar
          currentPage={page}
          onNavigate={navigate}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}
      <main className="flex-1">{renderPage()}</main>
      {showFooter && <Footer onNavigate={navigate} />}
      <WhatsAppButton />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
