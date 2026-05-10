import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { publicApi } from '../services/api';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing your payment...');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
      
      if (!vnp_ResponseCode) { 
        navigate('/'); 
        return; 
      }

      try {
        // Call backend to verify and process payment
        const params = {};
        searchParams.forEach((value, key) => {
          params[key] = value;
        });

        const response = await publicApi.get('/api/public/payments/callback/VNPAY', { params });
        
        if (response.data.success || response.data.code === '00') {
          // Use orderId from response
          if (response.data.orderId) {
            setOrderId(response.data.orderId);
          } else {
            // Fallback: Extract orderId from vnp_OrderInfo
            const orderInfo = searchParams.get('vnp_OrderInfo');
            if (orderInfo) {
              const match = orderInfo.match(/([a-f0-9-]{36})/i);
              if (match) setOrderId(match[1]);
            }
          }
          
          clearCart();
          setStatus('success');
          setMessage(response.data.message || 'Payment completed successfully!');
          setTimeout(() => navigate('/orders'), 3000);
        } else {
          setStatus('failed');
          setMessage(response.data.message || 'Payment verification failed.');
          setTimeout(() => navigate('/cart'), 4000);
        }
      } catch (error) {
        console.error('Payment callback error:', error);
        setStatus('failed');
        setMessage('Failed to verify payment. Please contact support.');
        setTimeout(() => navigate('/cart'), 4000);
      }
    };

    processPayment();
  }, [searchParams, navigate, clearCart]);

  const configs = {
    processing: { icon: <Loader size={56} className="text-amber-500 animate-spin" />, bg: 'bg-amber-50', color: 'text-amber-600', title: 'Processing Payment' },
    success: { icon: <CheckCircle size={56} className="text-emerald-500" />, bg: 'bg-emerald-50', color: 'text-emerald-600', title: 'Payment Successful!' },
    failed: { icon: <XCircle size={56} className="text-red-500" />, bg: 'bg-red-50', color: 'text-red-500', title: 'Payment Failed' },
    cancelled: { icon: <XCircle size={56} className="text-stone-400" />, bg: 'bg-stone-50', color: 'text-stone-500', title: 'Payment Cancelled' },
  };

  const cfg = configs[status] || configs.processing;

  return (
    <div className="pt-16 min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <motion.div className="card p-10 max-w-md w-full text-center" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className={`w-24 h-24 rounded-full ${cfg.bg} flex items-center justify-center mx-auto mb-6`}>
          {cfg.icon}
        </div>
        <h2 className={`font-heading text-2xl font-bold mb-3 ${cfg.color}`}>{cfg.title}</h2>
        <p className="text-stone-500 text-sm mb-2">{message}</p>
        {orderId && <p className="text-xs text-stone-400 mb-4">Order ID: {orderId}</p>}

        {status !== 'processing' && (
          <p className="text-xs text-stone-400 mb-6">Redirecting automatically...</p>
        )}

        <div className="flex gap-3 justify-center mt-2">
          {status === 'success' ? (
            <>
              <Link to="/orders" className="btn btn-primary">View Orders</Link>
              <Link to="/pets" className="btn btn-secondary">Continue Shopping</Link>
            </>
          ) : status !== 'processing' ? (
            <>
              <Link to="/cart" className="btn btn-primary">Back to Cart</Link>
              <Link to="/orders" className="btn btn-secondary">View Orders</Link>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}
