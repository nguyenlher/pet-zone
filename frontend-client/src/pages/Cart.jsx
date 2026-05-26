import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, cartTotal, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center py-20">
          <ShoppingBag size={72} strokeWidth={1} className="mx-auto text-stone-300 mb-5" />
          <h2 className="font-heading text-3xl font-bold text-stone-700 mb-3">Your cart is empty</h2>
          <p className="text-stone-500 mb-8">Looks like you haven't added any pets to your cart yet.</p>
          <Link to="/pets" className="btn btn-primary btn-lg">Browse Pets</Link>
        </div>
      </div>
    );
  }

  const shipping = cartTotal > 500 ? 0 : 25;

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.h1 className="font-heading text-4xl font-bold text-stone-900 mb-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          Shopping Cart
        </motion.h1>
        <p className="text-stone-500 mb-8">{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item, i) => (
              <motion.div key={item.id} className="card p-4 flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/pets/${item.id}`} className="shrink-0">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/pets/${item.id}`} className="font-heading font-bold text-stone-900 hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-sm text-stone-500">{item.breed}</p>
                </div>
                <div className="flex items-center gap-2 border border-stone-200 rounded-xl px-3 py-1.5">
                  <button className="text-stone-500 hover:text-primary transition-colors disabled:opacity-30"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                  <button className="text-stone-500 hover:text-primary transition-colors" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-heading font-bold text-stone-900 w-24 text-right">${(item.price * item.quantity).toLocaleString()}</span>
                <button className="text-stone-400 hover:text-red-500 transition-colors p-2" onClick={() => removeItem(item.id)} title="Remove">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}
            <div className="flex justify-between pt-2">
              <Link to="/pets" className="btn btn-secondary btn-sm"><ArrowLeft size={15} /> Continue Shopping</Link>
              <button className="btn btn-secondary btn-sm" onClick={clearCart}>Clear Cart</button>
            </div>
          </div>

          {/* Summary */}
          <motion.div className="card p-6 h-fit" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h3 className="font-heading text-xl font-bold text-stone-900 mb-5">Order Summary</h3>
            <div className="flex justify-between text-sm text-stone-600 mb-3">
              <span>Subtotal</span><span>${cartTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-stone-600 mb-3">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : `$${shipping}`}</span>
            </div>
            <div className="border-t border-stone-100 my-4" />
            <div className="flex justify-between font-heading font-bold text-stone-900 text-lg mb-5">
              <span>Total</span><span>${(cartTotal + shipping).toLocaleString()}</span>
            </div>
            {cartTotal < 500 && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4">🚚 Free shipping on orders over $500!</p>
            )}
            <Link to="/checkout" className="btn btn-primary w-full justify-center">
              Proceed to Checkout <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
