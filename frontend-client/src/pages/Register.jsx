import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.confirmPassword) { setError('Please fill in all required fields.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('You must agree to the terms and conditions.'); return; }
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
    <div className="pt-16 min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/30">
            <PawPrint size={28} className="text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-stone-900 mb-1">
            Join <span className="gradient-text">PawShop</span>
          </h1>
          <p className="text-stone-500">Create your account and start your journey</p>
        </motion.div>

        <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="card p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              {[{ id: 'reg-first', name: 'firstName', label: 'First Name' }, { id: 'reg-last', name: 'lastName', label: 'Last Name' }].map(({ id, name, label }) => (
                <div key={id} className="input-group">
                  <label htmlFor={id}>{label}</label>
                  <div className="relative">
                    <input id={id} name={name} className="input-field pl-10" placeholder={`Enter ${label.toLowerCase()}`} value={form[name]} onChange={handleChange} required />
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  </div>
                </div>
              ))}
            </div>

            <div className="input-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="relative">
                <input id="reg-email" name="email" type="email" className="input-field pl-10" placeholder="Enter your email" value={form.email} onChange={handleChange} required />
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              </div>
            </div>

            {[
              { id: 'reg-password', name: 'password', label: 'Password', show: showPwd, toggle: () => setShowPwd(!showPwd) },
              { id: 'reg-confirm', name: 'confirmPassword', label: 'Confirm Password', show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
            ].map(({ id, name, label, show, toggle }) => (
              <div key={id} className="input-group">
                <label htmlFor={id}>{label}</label>
                <div className="relative">
                  <input id={id} name={name} type={show ? 'text' : 'password'} className="input-field pl-10 pr-10"
                    placeholder={`Enter your ${label.toLowerCase()}`} value={form[name]} onChange={handleChange} required />
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" onClick={toggle} tabIndex={-1}>
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}

            <label className="flex items-start gap-3 text-sm text-stone-600 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="accent-primary w-4 h-4 mt-0.5 shrink-0" />
              <span>I agree to the <a href="#terms" className="text-primary hover:underline">Terms of Service</a> and <a href="#privacy" className="text-primary hover:underline">Privacy Policy</a></span>
            </label>

            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3.5 text-base disabled:opacity-70">
              <UserPlus size={18} /> {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </motion.div>

        <motion.p initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="text-center text-sm text-stone-500 mt-6">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
        </motion.p>
      </div>
    </div>
  );
}
