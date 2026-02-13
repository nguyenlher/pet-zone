import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Checkout.css';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    address: user?.address || '', city: '', zip: '',
    paymentMethod: 'card', cardNumber: '', cardExpiry: '', cardCvc: '',
  });

  const shipping = cartTotal > 500 ? 0 : 25;
  const total = cartTotal + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <motion.div className="order-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="success-icon"><CheckCircle size={64} /></div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <p className="order-id">Order ID: ORD-{Date.now().toString().slice(-6)}</p>
            <div className="success-actions">
              <Link to="/orders" className="btn btn-primary">View Orders</Link>
              <Link to="/pets" className="btn btn-secondary">Continue Shopping</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add some pets before checkout.</p>
            <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/cart" className="back-link"><ArrowLeft size={16} /> Back to Cart</Link>
        <h1 className="page-title">Checkout</h1>

        <div className="checkout-steps">
          {['Shipping', 'Payment', 'Review'].map((s, i) => (
            <div key={i} className={`checkout-step ${step > i ? 'completed' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="step-number">{step > i + 1 ? <CheckCircle size={16} /> : i + 1}</div>
              <span>{s}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handlePlaceOrder}>
            {step === 1 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3><Truck size={20} /> Shipping Information</h3>
                <div className="form-grid">
                  <div className="input-group">
                    <label htmlFor="name">Full Name</label>
                    <input id="name" name="name" className="input-field" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" className="input-field" value={form.phone} onChange={handleChange} required />
                  </div>
                  <div className="input-group full-span">
                    <label htmlFor="address">Address</label>
                    <input id="address" name="address" className="input-field" value={form.address} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" className="input-field" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="zip">ZIP Code</label>
                    <input id="zip" name="zip" className="input-field" value={form.zip} onChange={handleChange} required />
                  </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>Continue to Payment</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3><CreditCard size={20} /> Payment Method</h3>
                <div className="payment-methods">
                  {[
                    { value: 'card', label: 'Credit / Debit Card' },
                    { value: 'paypal', label: 'PayPal' },
                    { value: 'cod', label: 'Cash on Delivery' },
                  ].map(method => (
                    <label key={method.value} className={`payment-option ${form.paymentMethod === method.value ? 'active' : ''}`}>
                      <input type="radio" name="paymentMethod" value={method.value} checked={form.paymentMethod === method.value} onChange={handleChange} />
                      <span>{method.label}</span>
                    </label>
                  ))}
                </div>
                {form.paymentMethod === 'card' && (
                  <div className="form-grid" style={{ marginTop: '20px' }}>
                    <div className="input-group full-span">
                      <label htmlFor="cardNumber">Card Number</label>
                      <input id="cardNumber" name="cardNumber" className="input-field" placeholder="1234 5678 9012 3456" value={form.cardNumber} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="cardExpiry">Expiry Date</label>
                      <input id="cardExpiry" name="cardExpiry" className="input-field" placeholder="MM/YY" value={form.cardExpiry} onChange={handleChange} />
                    </div>
                    <div className="input-group">
                      <label htmlFor="cardCvc">CVC</label>
                      <input id="cardCvc" name="cardCvc" className="input-field" placeholder="123" value={form.cardCvc} onChange={handleChange} />
                    </div>
                  </div>
                )}
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Review Order</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3><CheckCircle size={20} /> Review Your Order</h3>
                <div className="review-section">
                  <h4>Shipping Details</h4>
                  <p>{form.name}</p>
                  <p>{form.address}, {form.city} {form.zip}</p>
                  <p>{form.phone}</p>
                </div>
                <div className="review-section">
                  <h4>Payment</h4>
                  <p>{form.paymentMethod === 'card' ? `Credit Card ending in ${form.cardNumber.slice(-4) || '****'}` : form.paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</p>
                </div>
                <div className="review-section">
                  <h4>Items ({items.length})</h4>
                  {items.map(item => (
                    <div key={item.id} className="review-item">
                      <img src={item.image} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <span className="review-item-price">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <ShieldCheck size={18} /> Place Order — ${total.toLocaleString()}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Summary sidebar */}
          <div className="checkout-summary card">
            <h3>Order Summary</h3>
            <div className="summary-items">
              {items.map(item => (
                <div key={item.id} className="summary-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-qty">x{item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>${total.toLocaleString()}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
