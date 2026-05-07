import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowLeft, ShieldCheck, LogIn, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';
import '../styles/pages/Checkout.css';

export default function Checkout() {
  const { items, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [form, setForm] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '', 
    email: user?.email || '', 
    phone: user?.phone || '',
    address: user?.address || '', 
    city: '',
    paymentMethod: 'cod',
    discountCode: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Update form when user data changes (after login)
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
      }));
    }
  }, [user]);

  const validateStep1 = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required.';
    if (!form.phone.trim()) errors.phone = 'Phone number is required.';
    if (!form.address.trim()) errors.address = 'Address is required.';
    if (!form.city.trim()) errors.city = 'City is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const shipping = cartTotal > 500 ? 0 : 25;
  const total = cartTotal + shipping;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderData = {
        userId: user.id, // UUID from authenticated user
        items: items.map(item => ({
          petId: item.id, // UUID of the pet
          quantity: item.quantity
        })),
        shipping: {
          name: form.name,
          phone: form.phone,
          address: form.address,
          city: form.city,
          paymentMethod: form.paymentMethod
        },
        discountCode: form.discountCode || '' // Optional discount code
      };

      const response = await orderService.createOrder(orderData);
      setOrderResponse(response);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <motion.div className="order-success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="success-icon"><CheckCircle size={64} /></div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your order has been confirmed.</p>
            <p className="order-id">Order ID: {orderResponse?.orderId || 'N/A'}</p>
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
          {['Shipping', 'Review', 'Payment'].map((s, i) => (
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
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      id="name" 
                      name="name" 
                      className={`input-field ${formErrors.name ? 'input-error' : ''}`} 
                      value={form.name} 
                      onChange={handleChange}
                    />
                    {formErrors.name && <span className="field-error">{formErrors.name}</span>}
                  </div>
                  <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} disabled style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone">Phone *</label>
                    <input id="phone" name="phone" className={`input-field ${formErrors.phone ? 'input-error' : ''}`} value={form.phone} onChange={handleChange} />
                    {formErrors.phone && <span className="field-error">{formErrors.phone}</span>}
                  </div>
                  <div className="input-group full-span">
                    <label htmlFor="address">Address *</label>
                    <input id="address" name="address" className={`input-field ${formErrors.address ? 'input-error' : ''}`} value={form.address} onChange={handleChange} />
                    {formErrors.address && <span className="field-error">{formErrors.address}</span>}
                  </div>
                  <div className="input-group">
                    <label htmlFor="city">City *</label>
                    <input id="city" name="city" className={`input-field ${formErrors.city ? 'input-error' : ''}`} value={form.city} onChange={handleChange} />
                    {formErrors.city && <span className="field-error">{formErrors.city}</span>}
                  </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => { if (validateStep1()) setStep(2); }}>Continue to Review</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3><CheckCircle size={20} /> Review Your Order</h3>
                <div className="review-section">
                  <h4>Shipping Details</h4>
                  <p>{form.name}</p>
                  <p>{form.address}, {form.city}</p>
                  <p>{form.phone}</p>
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
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Continue to Payment</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div className="form-section" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3><CreditCard size={20} /> Payment Method</h3>
                <div className="payment-methods">
                  {[
                    { value: 'cod', label: 'Cash on Delivery (COD)', description: 'Pay when you receive your pet' },
                    { value: 'vnpay', label: 'VNPay', description: 'Pay securely with VNPay e-wallet' },
                  ].map(method => (
                    <label key={method.value} className={`payment-option ${form.paymentMethod === method.value ? 'active' : ''}`}>
                      <input type="radio" name="paymentMethod" value={method.value} checked={form.paymentMethod === method.value} onChange={handleChange} />
                      <div className="payment-option-content">
                        <span className="payment-label">{method.label}</span>
                        <span className="payment-description">{method.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="form-actions">
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    <ShieldCheck size={18} /> {loading ? 'Processing...' : `Place Order — $${total.toLocaleString()}`}
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
            
            {/* Discount Code Input */}
            <div className="discount-code-section">
              <div className="input-group">
                <input
                  type="text"
                  name="discountCode"
                  className="input-field"
                  placeholder="Enter discount code"
                  value={form.discountCode}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="summary-divider" />
            <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
            <div className="summary-divider" />
            <div className="summary-row total"><span>Total</span><span>${total.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Login Required Dialog */}
        {showLoginDialog && (
          <div className="modal-overlay" onClick={() => setShowLoginDialog(false)}>
            <motion.div
              className="login-dialog"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <button className="dialog-close" onClick={() => setShowLoginDialog(false)}>
                <X size={20} />
              </button>
              <div className="dialog-icon">
                <LogIn size={48} />
              </div>
              <h2 className="dialog-title">Login Required</h2>
              <p className="dialog-message">
                You need to be logged in to place an order. Please log in or create an account to continue.
              </p>
              <div className="dialog-actions">
                <Link to="/login" className="btn btn-primary">
                  <LogIn size={18} />
                  Log In
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Create Account
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
