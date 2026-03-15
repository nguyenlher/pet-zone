import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Search, Heart, LogOut, Package, Settings } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';
import '../styles/components/Navbar.css';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [petDropdown, setPetDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const petRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (petRef.current && !petRef.current.contains(e.target)) setPetDropdown(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { label: 'Pets', dropdown: true },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="8" r="3.5" fill="currentColor" opacity="0.8"/>
              <circle cx="22" cy="8" r="3.5" fill="currentColor" opacity="0.8"/>
              <circle cx="5" cy="16" r="3" fill="currentColor" opacity="0.6"/>
              <circle cx="27" cy="16" r="3" fill="currentColor" opacity="0.6"/>
              <ellipse cx="16" cy="22" rx="8" ry="7" fill="currentColor"/>
            </svg>
          </div>
          <span className="logo-text">Pet Store</span>
        </Link>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link, i) =>
            link.dropdown ? (
              <div key={i} className="nav-dropdown" ref={petRef}>
                <button
                  className="nav-link dropdown-toggle"
                  onClick={() => setPetDropdown(!petDropdown)}
                >
                  Pets <ChevronDown size={16} className={`chevron ${petDropdown ? 'rotated' : ''}`} />
                </button>
                {petDropdown && (
                  <div className="dropdown-menu animate-slide-down">
                    <Link to="/pets" className="dropdown-item" onClick={() => { setPetDropdown(false); setMobileOpen(false); }}>
                      <span className="dropdown-icon">🐾</span> All Pets
                    </Link>
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        to={`/pets?category=${cat.slug}`}
                        className="dropdown-item"
                        onClick={() => { setPetDropdown(false); setMobileOpen(false); }}
                      >
                        <span className="dropdown-count">{cat.count}</span>
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={i} to={link.to} className="nav-link" onClick={() => setMobileOpen(false)}>
                {link.label}
              </Link>
            )
          )}
        </div>

        <div className="navbar-actions">
          <Link to="/cart" className="action-btn cart-btn" title="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          <div className="nav-dropdown" ref={profileRef}>
            <button
              className="action-btn profile-btn"
              onClick={() => setProfileDropdown(!profileDropdown)}
              title="Profile"
            >
              {isAuthenticated && user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="profile-avatar" />
              ) : (
                <User size={20} />
              )}
            </button>
            {profileDropdown && (
              <div className="dropdown-menu profile-menu animate-slide-down">
                {isAuthenticated ? (
                  <>
                    <div className="dropdown-user-info">
                      <strong>{user?.name}</strong>
                      <span>{user?.email}</span>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => { setProfileDropdown(false); setMobileOpen(false); }}>
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => { setProfileDropdown(false); setMobileOpen(false); }}>
                      <Package size={16} /> Order History
                    </Link>
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={() => { logout(); setProfileDropdown(false); }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </>
                ) : (
                  <button className="dropdown-item" onClick={() => { navigate('/profile'); setProfileDropdown(false); }}>
                    <User size={16} /> Sign In
                  </button>
                )}
              </div>
            )}
          </div>

          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
