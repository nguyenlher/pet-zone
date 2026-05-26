import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
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
            Welcome to <span className="gradient-text">PawShop</span>
          </h1>
          <p className="text-stone-500">Sign in to continue to your account</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <div className="input-group">
              <label htmlFor="login-email">Email Address</label>
              <div className="relative">
                <input id="login-email" name="email" type="email" className="input-field pl-10"
                  placeholder="you@example.com" value={form.email} onChange={handleChange} required />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <div className="relative">
                <input id="login-password" name="password" type={showPwd ? 'text' : 'password'} className="input-field pl-10 pr-10"
                  placeholder="Enter your password" value={form.password} onChange={handleChange} required />
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-stone-600 cursor-pointer">
                <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} className="accent-primary w-4 h-4" />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading}
              className="btn btn-primary w-full justify-center py-3.5 text-base disabled:opacity-70">
              <LogIn size={18} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="relative text-center text-sm text-stone-400 before:absolute before:inset-y-1/2 before:left-0 before:right-0 before:h-px before:bg-stone-200">
              <span className="relative bg-white px-3">or continue with</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
                <GoogleIcon /> Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 border border-stone-200 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </form>
        </motion.div>

        <motion.p initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="text-center text-sm text-stone-500 mt-6">
          Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Sign Up</Link>
        </motion.p>
      </div>
    </div>
  );
}
