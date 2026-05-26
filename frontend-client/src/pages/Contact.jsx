import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const info = [
    { icon: Phone, title: 'Call Us', text: '(+84) 567-8900' },
    { icon: Mail, title: 'Email Us', text: 'hello@pawshop.com' },
    { icon: MapPin, title: 'Visit Us', text: '19 Nguyen Huu Tho Str., Ho Chi Minh City' },
    { icon: Clock, title: 'Working Hours', text: 'Mon - Sat: 8:30 AM - 20:30 PM' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mb-10">
          <h1 className="font-heading text-4xl font-bold text-stone-900 mb-2">Get In Touch</h1>
          <p className="text-stone-500 text-lg">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={1} className="lg:col-span-2 card p-8">
            <h3 className="font-heading text-xl font-bold text-stone-900 flex items-center gap-2 mb-6">
              <MessageSquare size={20} className="text-primary" /> Send a Message
            </h3>
            {sent && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl mb-5">
                ✓ Message sent! We'll get back to you soon.
              </div>
            )}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                <textarea id="contact-message" className="input-field resize-none" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-fit">
                <Send size={18} /> Send Message
              </button>
            </form>
          </motion.div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={2} className="flex flex-col gap-4">
              {info.map(({ icon: Icon, title, text }, i) => (
                <div key={i} className="card p-4 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-primary flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-stone-900 text-sm">{title}</h4>
                    <p className="text-sm text-stone-500">{text}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div initial="hidden" animate="visible" variants={fadeInUp} custom={3} className="card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3920.0330883073725!2d106.6967668746547!3d10.731931389414115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317528b2747a81a3%3A0x33c1813055acb613!2zxJDhuqFpIGjhu41jIFTDtG4gxJDhu6ljIFRo4bqvbmc!5e0!3m2!1svi!2s!4v1763968596080!5m2!1svi!2s"
                width="100%" height="220" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" title="PawShop Location"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
