// src/components/CustomerDetailDrawer.jsx
import React from 'react';
import { X, Users, Mail, Phone, Calendar, ShoppingBag, CreditCard, Edit, Trash2, Shield, CheckCircle, XCircle } from 'lucide-react';

// Format VND currency
const formatVND = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount || 0);
};

export default function CustomerDetailDrawer({ customer, onClose, onEdit, onToggleActive, onDelete, isToggling = false }) {
  if (!customer) return null;

  const initials = `${customer.firstName?.[0] || ''}${customer.lastName?.[0] || ''}`.toUpperCase() || 'U';

  const handleEdit = () => {
    onClose();
    onEdit(customer);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete customer "${customer.firstName} ${customer.lastName}"?`)) {
      onClose();
      onDelete(customer.id);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 cursor-pointer animate-fadeIn"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md sm:max-w-lg bg-white shadow-2xl z-50 flex flex-col border-l border-neutral-200 animate-slideIn">
        {/* Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-none border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black">
              <Users size={16} />
            </div>
            <div>
              <h2 className="font-bold text-black text-xs uppercase tracking-wider">Customer Profile</h2>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                USER ID: {customer.id ? String(customer.id).substring(0, 8).toUpperCase() : 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-none border border-neutral-200 bg-white hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
            title="Close Drawer"
          >
            <X size={16} className="text-black" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          {/* Avatar Hero Card */}
          <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex items-center gap-4">
            <div className="w-16 h-16 rounded-none bg-black flex items-center justify-center text-white text-lg font-mono font-bold shrink-0 shadow-sm">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono uppercase font-bold tracking-wider border rounded-none ${
                  customer.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-red-50 text-red-700 border-red-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${customer.isActive ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {customer.isActive ? 'ACTIVE ACCOUNT' : 'INACTIVE ACCOUNT'}
                </span>
              </div>
              <h1 className="text-base font-bold text-black uppercase tracking-tight truncate">
                {customer.firstName} {customer.lastName}
              </h1>
              <p className="text-xs text-neutral-500 font-mono truncate">{customer.email}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 border-b border-neutral-200">
            <div className="p-4 border-r border-neutral-200 bg-white">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <ShoppingBag size={13} />
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Total Orders</span>
              </div>
              <p className="text-xl font-bold font-mono text-black">{customer.totalOrders || 0}</p>
            </div>
            <div className="p-4 bg-white">
              <div className="flex items-center gap-1.5 text-neutral-400 mb-1">
                <CreditCard size={13} />
                <span className="text-[10px] font-bold uppercase tracking-widest font-mono">Total Spent</span>
              </div>
              <p className="text-xl font-bold font-mono text-black">{formatVND(customer.totalSpent || 0)}</p>
            </div>
          </div>

          {/* Account Details & Contact */}
          <div className="p-5 border-b border-neutral-200 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 font-mono">
              Contact &amp; Credentials
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 border border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                <span className="text-neutral-500 uppercase text-[10px] tracking-wider flex items-center gap-2">
                  <Mail size={13} className="text-neutral-400" />
                  Email
                </span>
                <a href={`mailto:${customer.email}`} className="font-semibold text-black hover:underline truncate max-w-[220px]">
                  {customer.email}
                </a>
              </div>

              <div className="p-3 border border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                <span className="text-neutral-500 uppercase text-[10px] tracking-wider flex items-center gap-2">
                  <Phone size={13} className="text-neutral-400" />
                  Phone
                </span>
                <span className="font-semibold text-black">
                  {customer.phoneNumber || 'Not provided'}
                </span>
              </div>

              <div className="p-3 border border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                <span className="text-neutral-500 uppercase text-[10px] tracking-wider flex items-center gap-2">
                  <Calendar size={13} className="text-neutral-400" />
                  Registered Date
                </span>
                <span className="font-semibold text-neutral-700">
                  {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('vi-VN') : '—'}
                </span>
              </div>

              <div className="p-3 border border-neutral-100 bg-neutral-50/50 flex items-center justify-between">
                <span className="text-neutral-500 uppercase text-[10px] tracking-wider flex items-center gap-2">
                  <Shield size={13} className="text-neutral-400" />
                  Account Status
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isToggling}
                    onClick={() => onToggleActive(customer.id, customer.isActive)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-none border transition-colors focus:outline-none ${
                      isToggling ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                      customer.isActive ? 'bg-emerald-600 border-emerald-600' : 'bg-red-500 border-red-500'
                    }`}
                    title={customer.isActive ? 'Click to deactivate' : 'Click to activate'}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform bg-white transition-transform ${
                        customer.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    customer.isActive ? 'text-emerald-700' : 'text-red-600'
                  }`}>
                    {customer.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Action */}
          <div className="p-5">
            <a
              href={`mailto:${customer.email}`}
              className="w-full py-2.5 border border-neutral-200 rounded-none flex items-center justify-center gap-2 text-neutral-700 hover:text-black hover:border-black transition-colors font-mono text-xs uppercase tracking-wider font-bold bg-white"
            >
              <Mail size={14} />
              Send Email to Customer
            </a>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-5 border-t border-neutral-200 flex items-center gap-3 bg-neutral-50/50">
          <button
            onClick={handleEdit}
            className="flex-1 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-800 transition-colors rounded-none cursor-pointer"
          >
            <Edit size={14} />
            Edit Customer
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none cursor-pointer bg-white"
            title="Delete Customer"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
