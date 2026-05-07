import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Package, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saved, setSaved] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  // Update form when user data loads
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
      await updateProfile(form);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <motion.aside className="profile-sidebar card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="profile-avatar-section">
              <div className="avatar-wrap">
                <img src={user?.avatar} alt={user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'} className="avatar-large" />
                <button className="avatar-edit" title="Change photo">
                  <Camera size={14} />
                </button>
              </div>
              <h3>{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User'}</h3>
              <p>{user?.email}</p>
            </div>

            <nav className="profile-nav">
              <Link to="/profile" className="profile-nav-link active">
                <User size={18} /> My Profile
              </Link>
              <Link to="/orders" className="profile-nav-link">
                <Package size={18} /> Order History
              </Link>
              <button className="profile-nav-link logout" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </nav>
          </motion.aside>

          {/* Main */}
          <motion.div className="profile-main" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="profile-header">
              <h1 className="page-title">My Profile</h1>
              {!editing ? (
                <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                  <Edit3 size={16} /> Edit Profile
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleSave}>
                  <Save size={16} /> Save Changes
                </button>
              )}
            </div>

            {saved && (
              <div className="toast success" style={{ position: 'static', marginBottom: '16px' }}>
                Profile updated successfully!
              </div>
            )}

            <div className="profile-card card">
              <h3>Personal Information</h3>
              <div className="profile-grid">
                <div className="input-group">
                  <label htmlFor="name"><User size={14} /> Full Name</label>
                  {editing ? (
                    <input id="name" name="name" className="input-field" value={form.name} onChange={handleChange} />
                  ) : (
                    <p className="profile-value">{user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}</p>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="email"><Mail size={14} /> Email Address</label>
                  {editing ? (
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      className="input-field" 
                      value={form.email} 
                      onChange={handleChange}
                      disabled
                      style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                    />
                  ) : (
                    <p className="profile-value">{user?.email}</p>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="phone"><Phone size={14} /> Phone Number</label>
                  {editing ? (
                    <input id="phone" name="phone" className="input-field" value={form.phone} onChange={handleChange} />
                  ) : (
                    <p className="profile-value">{user?.phone}</p>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="address"><MapPin size={14} /> Address</label>
                  {editing ? (
                    <input id="address" name="address" className="input-field" value={form.address} onChange={handleChange} />
                  ) : (
                    <p className="profile-value">{user?.address}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="profile-card card">
              <h3>Account Details</h3>
              <div className="profile-grid">
                <div className="input-group">
                  <label>Member Since</label>
                  <p className="profile-value">{new Date(user?.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="input-group">
                  <label>Account Status</label>
                  <p className="profile-value"><span className="badge badge-success">Active</span></p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
