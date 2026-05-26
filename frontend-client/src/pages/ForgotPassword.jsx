import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import authService from '../services/authService';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Please enter your email address.'); return; }
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) { setSent(true); } else { setError(response.message || 'Failed to send reset link.'); }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <PawPrint size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-stone-900 mb-1">
            Reset <span className="gradient-text">Password</span>
          </h1>
          <p className="text-stone-500">No worries, we'll send you reset instructions</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="card p-8">
          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
              <div className="input-group">
                <label htmlFor="forgot-email">Email Address</label>
                <div className="relative">
                  <input id="forgot-email" type="email" className="input-field pl-10" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3.5 disabled:opacity-70">
                <Send size={18} /> {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={32} className="text-emerald-600" />
              </div>
              <h3 className="font-heading text-xl font-bold text-stone-900 mb-2">Check Your Email</h3>
              <p className="text-stone-500 text-sm mb-6">We've sent a password reset link to <strong>{email}</strong>.</p>
              <button className="btn btn-primary w-full justify-center" onClick={() => { setSent(false); setEmail(''); }}>
                <Mail size={16} /> Resend Email
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="text-center mt-6">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-primary transition-colors">
            <ArrowLeft size={15} /> Back to Sign In
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
