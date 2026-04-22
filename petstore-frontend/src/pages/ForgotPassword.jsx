import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import authService from '../services/authService';
import '../styles/pages/Auth.css';

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
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await authService.forgotPassword(email);
      if (response.success) {
        setSent(true);
      } else {
        setError(response.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Brand */}
        <motion.div className="auth-brand" initial="hidden" animate="visible" variants={fadeInUp}>
          <div className="auth-brand-icon"><PawPrint size={28} /></div>
          <h1>Reset <span>Password</span></h1>
          <p>No worries, we'll send you reset instructions</p>
        </motion.div>

        {/* Card */}
        <motion.div className="auth-card" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
          {!sent ? (
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <div className="auth-error">{error}</div>}

              <div className="input-group">
                <label htmlFor="forgot-email">Email Address</label>
                <div className="input-field-wrap">
                  <input
                    id="forgot-email"
                    type="email"
                    className="input-field has-icon"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Mail size={18} className="input-icon" />
                </div>
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                <Send size={18} />
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <motion.div className="auth-success" initial="hidden" animate="visible" variants={fadeInUp}>
              <div className="auth-success-icon"><CheckCircle size={32} /></div>
              <h3>Check Your Email</h3>
              <p>We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.</p>
              <button className="auth-submit" onClick={() => { setSent(false); setEmail(''); }} style={{ maxWidth: 260 }}>
                <Mail size={18} /> Resend Email
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div className="auth-footer" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
          <Link to="/login" className="auth-back"><ArrowLeft size={16} /> Back to Sign In</Link>
        </motion.div>
      </div>
    </div>
  );
}
