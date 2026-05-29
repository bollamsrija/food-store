import { useState, useEffect } from 'react';
import { ShoppingCart, Heart, User, Search, Menu, X, Leaf, LogOut, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export default function Navbar({ currentPage, onNavigate, searchQuery, onSearchChange }: NavbarProps) {
  const { cartCount, wishlist, user, profile, showToast, isAdmin } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    showToast('Signed out successfully');
    setUserMenuOpen(false);
    onNavigate('home');
  };

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'About Us', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm shadow-sm'
    }`}>
      {/* Top bar */}
      <div className="bg-forest-700 text-white text-xs py-1.5 px-4 text-center">
        Free delivery on orders above 999 | WhatsApp: +91 98765 43210 | Kukatpally, Hyderabad
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button - Now next to logo */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 group"
            >
              <div className="w-9 h-9 bg-forest-600 rounded-xl flex items-center justify-center shadow-green group-hover:bg-forest-700 transition-colors">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="font-display font-bold text-forest-800 text-base leading-tight">Sri Sai Natural</div>
                <div className="text-[10px] text-earth-600 font-medium uppercase tracking-wider">Pure Foods</div>
              </div>
            </button>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => onNavigate(link.page)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === link.page
                    ? 'text-forest-700 bg-forest-50'
                    : 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <div className="flex items-center gap-2 animate-slide-down">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={e => onSearchChange(e.target.value)}
                  autoFocus
                  className="w-48 sm:w-64 border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      onNavigate('shop');
                      setSearchOpen(false);
                    }
                  }}
                />
                <button onClick={() => { setSearchOpen(false); onSearchChange(''); }} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="relative p-2 text-gray-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-forest-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="p-2 text-gray-500 hover:text-forest-700 hover:bg-forest-50 rounded-lg transition-colors flex items-center gap-1"
              >
                <User className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 animate-scale-in overflow-hidden">
                  {user ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="text-sm font-semibold text-gray-800 truncate">{profile?.full_name || user.email}</div>
                        <div className="text-xs text-gray-500 truncate">{user.email}</div>
                      </div>
                      <button onClick={() => { onNavigate('orders'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-forest-600" /> My Orders
                      </button>
                      <button onClick={() => { onNavigate('wishlist'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-forest-50 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-500" /> Wishlist
                      </button>
                      {isAdmin && (
                        <button onClick={() => { onNavigate('admin'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-forest-700 hover:bg-forest-50 flex items-center gap-2 font-medium">
                          <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                        </button>
                      )}
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => { onNavigate('login'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-forest-50 font-medium">
                        Sign In
                      </button>
                      <button onClick={() => { onNavigate('register'); setUserMenuOpen(false); }} className="w-full text-left px-4 py-3 text-sm text-forest-700 hover:bg-forest-50 font-semibold border-t border-gray-100">
                        Create Account
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-2 animate-slide-down">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => { onNavigate(link.page); setMobileOpen(false); }}
                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                  currentPage === link.page ? 'text-forest-700 bg-forest-50' : 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Click outside to close menus */}
      {(userMenuOpen || mobileOpen) && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => { setUserMenuOpen(false); setMobileOpen(false); }}
        />
      )}
    </header>
  );
}
