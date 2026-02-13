import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Edit3, Save, Camera, Package, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/Profile.css';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    updateProfile(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <motion.aside className="profile-sidebar card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="profile-avatar-section">
              <div className="avatar-wrap">
                <img src={user?.avatar} alt={user?.name} className="avatar-large" />
                <button className="avatar-edit" title="Change photo">
                  <Camera size={14} />
                </button>
              </div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>

            <nav className="profile-nav">
              <Link to="/profile" className="profile-nav-link active">
                <User size={18} /> My Profile
              </Link>
              <Link to="/orders" className="profile-nav-link">
                <Package size={18} /> Order History
              </Link>
              <button className="profile-nav-link logout" onClick={logout}>
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
                    <p className="profile-value">{user?.name}</p>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="email"><Mail size={14} /> Email Address</label>
                  {editing ? (
                    <input id="email" name="email" type="email" className="input-field" value={form.email} onChange={handleChange} />
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
