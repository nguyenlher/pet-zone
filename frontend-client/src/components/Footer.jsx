import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 text-white font-heading font-bold text-xl mb-4">
              <div className="w-8 h-8 text-primary">
                <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="8" r="3.5" fill="currentColor" opacity="0.8"/>
                  <circle cx="22" cy="8" r="3.5" fill="currentColor" opacity="0.8"/>
                  <circle cx="5" cy="16" r="3" fill="currentColor" opacity="0.6"/>
                  <circle cx="27" cy="16" r="3" fill="currentColor" opacity="0.6"/>
                  <ellipse cx="16" cy="22" rx="8" ry="7" fill="currentColor"/>
                </svg>
              </div>
              Pet Store
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed mb-5">
              Your trusted pet store for finding the perfect furry, feathery, or scaly companion. We care about every pet's happiness.
            </p>
            <div className="flex items-center gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 hover:bg-primary hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="flex flex-col gap-2.5">
              {[['/', 'Home'], ['/pets', 'All Pets'], ['/pets?category=dogs', 'Dogs'], ['/pets?category=cats', 'Cats'], ['/contact', 'Contact Us']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-stone-400 hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">My Account</h4>
            <ul className="flex flex-col gap-2.5">
              {[['/profile', 'My Profile'], ['/orders', 'Order History'], ['/cart', 'Shopping Cart'], ['/checkout', 'Checkout']].map(([to, label]) => (
                <li key={to}><Link to={to} className="text-sm text-stone-400 hover:text-primary transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Contact Info</h4>
            <ul className="flex flex-col gap-3">
              {[
                { Icon: MapPin, text: '123 Pet Street, New York, NY' },
                { Icon: Phone, text: '+1 (234) 567-8900' },
                { Icon: Mail, text: 'info@petstore.com' },
                { Icon: Clock, text: 'Mon - Sat: 9:00 - 18:00' },
              ].map(({ Icon, text }, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-stone-400">
                  <Icon size={15} className="mt-0.5 shrink-0 text-primary" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-6 text-center text-sm text-stone-500 flex items-center justify-center gap-1.5">
          &copy; {new Date().getFullYear()} PawShop. Made with <Heart size={13} className="text-red-400 fill-red-400 animate-heart-pulse" /> for pets everywhere.
        </div>
      </div>
    </footer>
  );
}
