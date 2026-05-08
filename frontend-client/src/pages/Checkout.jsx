import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, CheckCircle, ArrowLeft, ShieldCheck, LogIn, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import orderService from '../services/orderService';

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
    if (!user) { setShowLoginDialog(true); return; }
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        userId: user.id,
        items: items.map(item => ({ petId: item.id, quantity: item.quantity })),
        shipping: { name: form.name, phone: form.phone, address: form.address, city: form.city, paymentMethod: form.paymentMethod },
        discountCode: form.discountCode || '',
      };
      const response = await orderService.createOrder(orderData);
      setOrderResponse(response);
      if (response.paymentUrl) { window.location.href = response.paymentUrl; return; }
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
        <motion.div className="text-center py-20" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-600" />
          </div>
          <h2 className="font-heading text-3xl font-bold text-stone-900 mb-3">Order Placed Successfully!</h2>
          <p className="text-stone-500 mb-2">Thank you for your purchase. Your order has been confirmed.</p>
          <p className="text-sm text-stone-400 mb-8">Order ID: {orderResponse?.orderId || 'N/A'}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/orders" className="btn btn-primary">View Orders</Link>
            <Link to="/pets" className="btn btn-secondary">Continue Shopping</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center py-20">
          <h3 className="font-heading text-2xl font-bold text-stone-700 mb-3">Your cart is empty</h3>
          <p className="text-stone-500 mb-6">Add some pets before checkout.</p>
          <Link to="/pets" className="btn btn-primary">Browse Pets</Link>
        </div>
      </div>
    );
  }

  const steps = ['Shipping', 'Review', 'Payment'];

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/cart" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-primary transition-colors mb-6">
          <ArrowLeft size={15} /> Back to Cart
        </Link>
        <h1 className="font-heading text-4xl font-bold text-stone-900 mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-sm font-medium ${step > i ? 'text-emerald-600' : step === i + 1 ? 'text-primary' : 'text-stone-400'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-primary text-white' : 'bg-stone-200 text-stone-500'}`}>
                  {step > i + 1 ? <CheckCircle size={14} /> : i + 1}
                </div>
                {s}
              </div>
              {i < steps.length - 1 && <div className={`h-px flex-1 min-w-[32px] ${step > i + 1 ? 'bg-emerald-400' : 'bg-stone-200'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form className="lg:col-span-2" onSubmit={handlePlaceOrder}>
            {/* Step 1: Shipping */}
            {step === 1 && (
              <motion.div className="card p-6" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2 mb-5">
                  <Truck size={20} className="text-primary" /> Shipping Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name', label: 'Full Name *', type: 'text' },
                    { id: 'email', label: 'Email', type: 'email', disabled: true },
                    { id: 'phone', label: 'Phone *', type: 'text' },
                  ].map(({ id, label, type, disabled }) => (
                    <div key={id} className="input-group">
                      <label htmlFor={id}>{label}</label>
                      <input id={id} name={id} type={type} value={form[id]} onChange={handleChange}
                        disabled={disabled}
                        className={`input-field ${formErrors[id] ? 'input-error' : ''} ${disabled ? 'bg-stone-50 cursor-not-allowed' : ''}`} />
                      {formErrors[id] && <span className="field-error">{formErrors[id]}</span>}
                    </div>
                  ))}
                  <div className="input-group sm:col-span-2">
                    <label htmlFor="address">Address *</label>
                    <input id="address" name="address" value={form.address} onChange={handleChange}
                      className={`input-field ${formErrors.address ? 'input-error' : ''}`} />
                    {formErrors.address && <span className="field-error">{formErrors.address}</span>}
                  </div>
                  <div className="input-group">
                    <label htmlFor="city">City *</label>
                    <input id="city" name="city" value={form.city} onChange={handleChange}
                      className={`input-field ${formErrors.city ? 'input-error' : ''}`} />
                    {formErrors.city && <span className="field-error">{formErrors.city}</span>}
                  </div>
                </div>
                <button type="button" className="btn btn-primary mt-6"
                  onClick={() => { if (validateStep1()) setStep(2); }}>
                  Continue to Review
                </button>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <motion.div className="card p-6" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2 mb-5">
                  <CheckCircle size={20} className="text-primary" /> Review Your Order
                </h3>
                <div className="bg-stone-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-stone-700 mb-2">Shipping Details</h4>
                  <p className="text-sm text-stone-600">{form.name}</p>
                  <p className="text-sm text-stone-600">{form.address}, {form.city}</p>
                  <p className="text-sm text-stone-600">{form.phone}</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4 mb-4">
                  <h4 className="text-sm font-semibold text-stone-700 mb-3">Items ({items.length})</h4>
                  {items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 py-2 border-b border-stone-200 last:border-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-stone-800">{item.name}</p>
                        <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-stone-900">${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                  <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Continue to Payment</button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div className="card p-6" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="font-heading text-lg font-bold text-stone-900 flex items-center gap-2 mb-5">
                  <CreditCard size={20} className="text-primary" /> Payment Method
                </h3>
                <div className="flex flex-col gap-3 mb-6">
                  {[
                    { value: 'cod', label: 'Cash on Delivery (COD)', description: 'Pay when you receive your pet' },
                    { value: 'vnpay', label: 'VNPay', description: 'Pay securely with VNPay e-wallet' },
                  ].map(method => (
                    <label key={method.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.paymentMethod === method.value ? 'border-primary bg-amber-50' : 'border-stone-200 hover:border-stone-300'}`}>
                      <input type="radio" name="paymentMethod" value={method.value} checked={form.paymentMethod === method.value} onChange={handleChange} className="accent-primary" />
                      <div>
                        <span className="block font-semibold text-stone-900 text-sm">{method.label}</span>
                        <span className="text-xs text-stone-500">{method.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {error && <p className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-xl">{error}</p>}
                <div className="flex gap-3">
                  <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                  <button type="submit" className="btn btn-primary flex-1" disabled={loading}>
                    <ShieldCheck size={18} />
                    {loading ? 'Processing...' : `Place Order — $${total.toLocaleString()}`}
                  </button>
                </div>
              </motion.div>
            )}
          </form>

          {/* Summary */}
          <div className="card p-6 h-fit">
            <h3 className="font-heading text-lg font-bold text-stone-900 mb-5">Order Summary</h3>
            <div className="flex flex-col gap-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                    <p className="text-xs text-stone-500">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold">${(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="input-group mb-4">
              <input type="text" name="discountCode" value={form.discountCode} onChange={handleChange}
                className="input-field" placeholder="Discount code" />
            </div>
            <div className="border-t border-stone-100 pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-stone-600"><span>Subtotal</span><span>${cartTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-stone-600"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping}`}</span></div>
              <div className="border-t border-stone-100 mt-2 pt-3 flex justify-between font-heading font-bold text-stone-900">
                <span>Total</span><span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login dialog */}
      {showLoginDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowLoginDialog(false)}>
          <motion.div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center" onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <button className="absolute top-4 right-4 text-stone-400 hover:text-stone-700" onClick={() => setShowLoginDialog(false)}><X size={20} /></button>
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
              <LogIn size={28} className="text-primary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-stone-900 mb-3">Login Required</h2>
            <p className="text-stone-500 text-sm mb-6">You need to be logged in to place an order.</p>
            <div className="flex gap-3">
              <Link to="/login" className="btn btn-primary flex-1"><LogIn size={16} /> Log In</Link>
              <Link to="/register" className="btn btn-secondary flex-1">Register</Link>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
