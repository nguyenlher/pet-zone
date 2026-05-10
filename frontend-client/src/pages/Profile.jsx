import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Package, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (!loading && !isAuthenticated) navigate('/login'); }, [isAuthenticated, loading, navigate]);
  useEffect(() => {
    if (user) {
      setForm({
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      // Split full name into firstName and lastName
      const nameParts = form.name.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      // Prepare update payload matching backend DTO
      const updatePayload = {
        firstName,
        lastName,
        phone: form.phone || null,
        address: form.address || null,
      };
      
      await updateProfile(updatePayload);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) { 
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleLogout = async () => { await logout(); navigate('/'); };

  if (loading) return (
    <div className="pt-20 min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  if (!isAuthenticated || !user) return null;

  const fullName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'User';

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside className="card p-6 lg:col-span-1 h-fit" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <img src={user?.avatar} alt={fullName} className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-amber-100" />
                <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shadow-md" title="Change photo">
                  <Camera size={12} />
                </button>
              </div>
              <h3 className="font-heading font-bold text-stone-900 mt-3">{fullName}</h3>
              <p className="text-xs text-stone-500">{user?.email}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {[
                { to: '/profile', icon: User, label: 'My Profile', active: true },
                { to: '/orders', icon: Package, label: 'Order History', active: false },
              ].map(({ to, icon: Icon, label, active }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-amber-50 text-primary' : 'text-stone-600 hover:bg-stone-50 hover:text-primary'}`}>
                  <Icon size={16} /> {label}
                </Link>
              ))}
              <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-2" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </nav>
          </motion.aside>

          {/* Main */}
          <motion.div className="lg:col-span-3 flex flex-col gap-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between">
              <h1 className="font-heading text-3xl font-bold text-stone-900">My Profile</h1>
              {!editing ? (
                <button className="btn btn-secondary" onClick={() => setEditing(true)}><Edit3 size={15} /> Edit Profile</button>
              ) : (
                <button className="btn btn-primary" onClick={handleSave}><Save size={15} /> Save Changes</button>
              )}
            </div>

            {saved && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm">
                ✓ Profile updated successfully!
              </div>
            )}

            {/* Personal Information */}
            <div className="card p-6">
              <h3 className="font-heading font-bold text-stone-900 mb-5">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { id: 'name', label: 'Full Name', icon: User, name: 'name', value: form.name },
                  { id: 'email', label: 'Email Address', icon: Mail, name: 'email', value: form.email, disabled: true },
                  { id: 'phone', label: 'Phone Number', icon: Phone, name: 'phone', value: form.phone },
                  { id: 'address', label: 'Address', icon: MapPin, name: 'address', value: form.address },
                ].map(({ id, label, icon: Icon, name, value, disabled }) => (
                  <div key={id} className="input-group">
                    <label htmlFor={id} className="flex items-center gap-1.5"><Icon size={13} /> {label}</label>
                    {editing && !disabled ? (
                      <input id={id} name={name} value={value} onChange={handleChange} className="input-field" />
                    ) : (
                      <p className={`px-4 py-3 rounded-xl text-sm ${disabled ? 'bg-stone-50 text-stone-500' : 'bg-stone-50 text-stone-800'}`}>
                        {value || 'Not set'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Account Details */}
            <div className="card p-6">
              <h3 className="font-heading font-bold text-stone-900 mb-5">Account Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="input-group">
                  <label>Member Since</label>
                  <p className="px-4 py-3 rounded-xl text-sm bg-stone-50 text-stone-800">
                    {new Date(user?.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="input-group">
                  <label>Account Status</label>
                  <p className="px-4 py-3 rounded-xl text-sm bg-stone-50">
                    <span className="badge badge-success">Active</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
