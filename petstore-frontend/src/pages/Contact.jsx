import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import '../styles/pages/Contact.css';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.4 } }),
};



export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <motion.div className="contact-hero" initial="hidden" animate="visible" variants={fadeInUp}>
          <h1 className="page-title">Get In Touch</h1>
          <p className="page-subtitle">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        <div className="contact-grid">
          {/* Form */}
          <motion.div className="contact-form-wrap card" initial="hidden" animate="visible" variants={fadeInUp} custom={1}>
            <h3><MessageSquare size={20} /> Send a Message</h3>
            {sent && (
              <div className="toast success" style={{ position: 'static', marginBottom: '16px' }}>
                Message sent successfully! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-grid-contact">
                <div className="input-group">
                  <label htmlFor="contact-name">Full Name</label>
                  <input id="contact-name" className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label htmlFor="contact-email">Email Address</label>
                  <input id="contact-email" type="email" className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" className="input-field" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
              </div>
              <div className="input-group">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" className="input-field textarea" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg">
                <Send size={18} /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <div className="contact-info-col">
            <motion.div className="contact-info-cards" initial="hidden" animate="visible" variants={fadeInUp} custom={2}>
              {[
                { icon: <MapPin size={22} />, title: 'Visit Us', info: '123 Pet Street, New York, NY 10001' },
                { icon: <Phone size={22} />, title: 'Call Us', info: '+1 (234) 567-8900' },
                { icon: <Mail size={22} />, title: 'Email Us', info: 'hello@pawshop.com' },
                { icon: <Clock size={22} />, title: 'Working Hours', info: 'Mon - Sat: 9:00 AM - 6:00 PM' },
              ].map((item, i) => (
                <div key={i} className="contact-info-card">
                  <div className="contact-info-icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.info}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Map placeholder */}
            <motion.div className="map-placeholder card" initial="hidden" animate="visible" variants={fadeInUp} custom={3}>
              <div className="map-inner">
                <MapPin size={32} />
                <p>Map View</p>
                <span>123 Pet Street, New York, NY 10001</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
