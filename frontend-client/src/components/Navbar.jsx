import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, LogOut, Package, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePetTypes } from '../hooks/usePets';
import favoriteService from '../services/favoriteService';
import { VNFlag, USFlag } from './FlagIcons';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [petDropdown, setPetDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [langDropdown, setLangDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { petTypes } = usePetTypes();
  const navigate = useNavigate();
  const petRef = useRef(null);
  const profileRef = useRef(null);
  const langRef = useRef(null);

  const currentLanguage = i18n.language || 'vi';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (petRef.current && !petRef.current.contains(e.target)) setPetDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
      if (langRef.current && !langRef.current.contains(e.target)) setLangDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load favorite count when user is authenticated
  useEffect(() => {
    const loadFavoriteCount = async () => {
      if (isAuthenticated) {
        try {
          const count = await favoriteService.getFavoriteCount();
          setFavoriteCount(count);
        } catch (error) {
          console.error('Failed to load favorite count:', error);
        }
      } else {
        setFavoriteCount(0);
      }
    };
    loadFavoriteCount();
  }, [isAuthenticated]);

  const linkCls = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 hover:text-primary ${isActive ? 'text-primary' : 'text-stone-700'}`;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-heading font-bold text-xl text-stone-900">
          <div className="w-8 h-8 text-primary">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="8" r="3.5" fill="currentColor" opacity="0.8"/>
              <circle cx="22" cy="8" r="3.5" fill="currentColor" opacity="0.8"/>
              <circle cx="5" cy="16" r="3" fill="currentColor" opacity="0.6"/>
              <circle cx="27" cy="16" r="3" fill="currentColor" opacity="0.6"/>
              <ellipse cx="16" cy="22" rx="8" ry="7" fill="currentColor"/>
            </svg>
          </div>
          <span>Pet Store</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={linkCls} end>{t('navbar.home')}</NavLink>

          {/* Pets dropdown */}
          <div className="relative" ref={petRef}>
            <button
              className="flex items-center gap-1 text-sm font-medium text-stone-700 hover:text-primary transition-colors"
              onClick={() => setPetDropdown(!petDropdown)}
            >
              {t('navbar.pets')} <ChevronDown size={14} className={`transition-transform duration-200 ${petDropdown ? 'rotate-180' : ''}`} />
            </button>
            {petDropdown && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-stone-100 py-2 animate-slide-down">
                <Link to="/pets" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-primary transition-colors"
                  onClick={() => { setPetDropdown(false); setMobileOpen(false); }}>
                  {t('navbar.all_pets')}
                </Link>
                {petTypes.map(type => (
                  <Link key={type.id} to={`/pets?type=${type.id}`}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-primary transition-colors"
                    onClick={() => { setPetDropdown(false); setMobileOpen(false); }}>
                    {type.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/products" className={linkCls}>{t('navbar.products')}</NavLink>
          <NavLink to="/faq" className={linkCls}>{t('navbar.faq')}</NavLink>
          <NavLink to="/contact" className={linkCls}>{t('navbar.contact')}</NavLink>
          <NavLink to="/3d-store" className="text-sm font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-accent text-white hover:shadow-md transition-all">
            {t('navbar.store_3d')}
          </NavLink>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher - Click directly to toggle */}
          <button
            className="flex items-center justify-center p-1 hover:scale-110 transition-all duration-150"
            onClick={() => i18n.changeLanguage(currentLanguage.startsWith('vi') ? 'en' : 'vi')}
            title={currentLanguage.startsWith('vi') ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
          >
            {currentLanguage.startsWith('vi') ? (
              <USFlag className="w-6 h-4 object-cover rounded-sm shadow-sm" />
            ) : (
              <VNFlag className="w-6 h-4 object-cover rounded-sm shadow-sm" />
            )}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 text-stone-700 hover:text-primary transition-colors">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button className="p-2 text-stone-700 hover:text-primary transition-colors" onClick={() => setProfileDropdown(!profileDropdown)}>
              {isAuthenticated && user?.avatar
                ? <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                : <User size={22} />
              }
            </button>
            {profileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-100 py-2 animate-slide-down">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-3 border-b border-stone-100">
                      <p className="font-semibold text-sm text-stone-900">{user?.name || user?.email}</p>
                      <p className="text-xs text-stone-500">{user?.email}</p>
                    </div>
                    <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-primary transition-colors"
                      onClick={() => setProfileDropdown(false)}>
                      <User size={15} /> {t('navbar.my_profile')}
                    </Link>
                    <Link to="/favorites" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-primary transition-colors"
                      onClick={() => setProfileDropdown(false)}>
                      <Heart size={15} /> {t('navbar.favorite_list')}
                      {favoriteCount > 0 && (
                        <span className="ml-auto text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                          {favoriteCount}
                        </span>
                      )}
                    </Link>
                    <Link to="/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-primary transition-colors"
                      onClick={() => setProfileDropdown(false)}>
                      <Package size={15} /> {t('navbar.order_history')}
                    </Link>
                    <div className="border-t border-stone-100 mt-1" />
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      onClick={async () => { await logout(); setProfileDropdown(false); navigate('/'); }}>
                      <LogOut size={15} /> {t('navbar.logout')}
                    </button>
                  </>
                ) : (
                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-stone-700 hover:bg-amber-50 hover:text-primary transition-colors"
                    onClick={() => { navigate('/login'); setProfileDropdown(false); }}>
                    <User size={15} /> {t('navbar.sign_in')}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 text-stone-700" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 px-6 py-4 flex flex-col gap-3 animate-slide-down">
          <NavLink to="/" className={linkCls} end onClick={() => setMobileOpen(false)}>{t('navbar.home')}</NavLink>
          <NavLink to="/pets" className={linkCls} onClick={() => setMobileOpen(false)}>{t('navbar.pets')}</NavLink>
          <NavLink to="/products" className={linkCls} onClick={() => setMobileOpen(false)}>{t('navbar.products')}</NavLink>
          <NavLink to="/faq" className={linkCls} onClick={() => setMobileOpen(false)}>{t('navbar.faq')}</NavLink>
          <NavLink to="/contact" className={linkCls} onClick={() => setMobileOpen(false)}>{t('navbar.contact')}</NavLink>
          <NavLink to="/3d-store" className="text-sm font-semibold text-primary" onClick={() => setMobileOpen(false)}>{t('navbar.store_3d')}</NavLink>
          {/* Mobile Language Switcher */}
          <div className="flex gap-4 border-t border-stone-100 pt-3 mt-2">
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold ${currentLanguage.startsWith('vi') ? 'bg-amber-50 border-primary text-primary' : 'border-stone-200 text-stone-600'}`}
              onClick={() => { i18n.changeLanguage('vi'); setMobileOpen(false); }}
            >
              <VNFlag className="w-4 h-3 object-cover mr-1" /> Tiếng Việt
            </button>
            <button
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-semibold ${!currentLanguage.startsWith('vi') ? 'bg-amber-50 border-primary text-primary' : 'border-stone-200 text-stone-600'}`}
              onClick={() => { i18n.changeLanguage('en'); setMobileOpen(false); }}
            >
              <USFlag className="w-4 h-3 object-cover mr-1" /> English
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
