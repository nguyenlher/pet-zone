import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import '../styles/pages/Cart.css';

export default function Cart() {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <ShoppingBag size={64} strokeWidth={1} />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any pets to your cart yet.</p>
            <Link to="/pets" className="btn btn-primary btn-lg">
              <ArrowLeft size={18} /> Browse Pets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 25;

  return (
    <div className="cart-page">
      <div className="container">
        <motion.h1 className="page-title" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>Shopping Cart</motion.h1>
        <p className="page-subtitle">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item, i) => (
              <motion.div key={item.id} className="cart-item card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/pets/${item.id}`} className="cart-item-image">
                  <img src={item.image} alt={item.name} />
                </Link>
                <div className="cart-item-info">
                  <Link to={`/pets/${item.id}`} className="cart-item-name">{item.name}</Link>
                  <p className="cart-item-breed">{item.breed}</p>
                </div>
                <div className="cart-item-quantity">
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <div className="cart-item-price">${(item.price * item.quantity).toLocaleString()}</div>
                <button className="cart-item-remove" onClick={() => removeItem(item.id)} title="Remove">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
            <div className="cart-actions-row">
              <Link to="/pets" className="btn btn-secondary btn-sm">
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          <motion.div className="cart-summary card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="free-shipping">Free</span> : `$${shipping}`}</span>
            </div>
            <div className="summary-divider" />
            <div className="summary-row total">
              <span>Total</span>
              <span>${(cartTotal + shipping).toLocaleString()}</span>
            </div>
            {cartTotal < 500 && (
              <p className="shipping-note">Free shipping on orders over $500!</p>
            )}
            <Link to="/checkout" className="btn btn-primary btn-lg full-width">
              Proceed to Checkout <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
