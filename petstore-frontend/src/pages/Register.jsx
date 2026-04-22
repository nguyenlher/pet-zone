import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Auth.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <h1>Join <span>PawShop</span></h1>
          <p>Create your account and start your journey</p>
        </motion.div>

        {/* Card */}
        <motion.div className="auth-card" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="auth-error">{error}</div>}

            {/* Name */}
            <div className="auth-grid-2">
              <div className="input-group">
                <label htmlFor="reg-first">First Name</label>
                <div className="input-field-wrap">
                  <input id="reg-first" name="firstName" className="input-field has-icon" placeholder="Enter first name" value={form.firstName} onChange={handleChange} required />
                  <User size={18} className="input-icon" />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="reg-last">Last Name</label>
                <div className="input-field-wrap">
                  <input id="reg-last" name="lastName" className="input-field has-icon" placeholder="Enter last name" value={form.lastName} onChange={handleChange} required />
                  <User size={18} className="input-icon" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="input-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-field-wrap">
                <input id="reg-email" name="email" type="email" className="input-field has-icon" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                <Mail size={18} className="input-icon" />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <label htmlFor="reg-password">Password</label>
              <div className="input-field-wrap">
                <input id="reg-password" name="password" type={showPwd ? 'text' : 'password'} className="input-field has-icon" placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                <Lock size={18} className="input-icon" />
                <button type="button" className="password-toggle" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div className="input-group">
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div className="input-field-wrap">
                <input id="reg-confirm" name="confirmPassword" type={showConfirm ? 'text' : 'password'} className="input-field has-icon" placeholder="Re-enter your password" value={form.confirmPassword} onChange={handleChange} required />
                <Lock size={18} className="input-icon" />
                <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="auth-terms">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
              <span>I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a></span>
            </label>

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Creating account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div className="auth-divider">or sign up with</div>

            {/* Social */}
            <div className="auth-social-row">
              <button type="button" className="auth-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" className="auth-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer */}
        <motion.div className="auth-footer" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
          Already have an account? <Link to="/login">Sign In</Link>
        </motion.div>
      </div>
    </div>
  );
}
