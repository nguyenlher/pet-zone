import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function CustomerModal({ isOpen, onClose, onSubmit, initialData = null, title = "Add Customer" }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '',
        password: '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[1px] p-4">
      <div className="bg-white rounded-none border border-neutral-200 w-full max-w-md shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-neutral-200">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-black">{title}</h2>
            <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Customer credentials &amp; profile information</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black transition-colors cursor-pointer p-1">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black transition-colors placeholder:text-neutral-400"
                  placeholder="e.g. Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!initialData}
                className={`w-full px-3.5 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black font-mono transition-colors ${
                  initialData ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' : 'bg-white'
                }`}
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3.5 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black font-mono transition-colors placeholder:text-neutral-400"
                placeholder="+84 901 234 567"
              />
            </div>
            {!initialData && (
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-1.5">Initial Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2 border border-neutral-200 rounded-none text-xs focus:outline-none focus:border-black transition-colors"
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end gap-3 pt-5 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200 rounded-none text-xs font-bold uppercase tracking-wider text-neutral-700 hover:border-black transition-colors cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-none text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Save Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
