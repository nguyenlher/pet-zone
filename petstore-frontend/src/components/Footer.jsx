import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';
import '../styles/components/Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <div className="footer-logo-icon">
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
            <p className="footer-desc">
              Your trusted pet store for finding the perfect furry, feathery, or scaly companion. We care about every pet's happiness.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-link" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" className="social-link" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" className="social-link" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" className="social-link" aria-label="YouTube"><Youtube size={18} /></a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/pets">All Pets</Link></li>
              <li><Link to="/pets?category=dogs">Dogs</Link></li>
              <li><Link to="/pets?category=cats">Cats</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>My Account</h4>
            <ul>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Contact Info</h4>
            <ul className="contact-list">
              <li><MapPin size={16} /> 123 Pet Street, New York, NY</li>
              <li><Phone size={16} /> +1 (234) 567-8900</li>
              <li><Mail size={16} /> info@petstore.com</li>
              <li><Clock size={16} /> Mon - Sat: 9:00 - 18:00</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} PawShop. Made with <Heart size={14} className="heart-icon" /> for pets everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
