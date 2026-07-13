'use client';

import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubscribed(true);
  };

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200">
      <div className="relative rounded-none overflow-hidden bg-neutral-50 text-black p-8 sm:p-12 lg:p-16 border border-neutral-200">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-neutral-200 bg-white text-neutral-600 text-[10px] font-bold tracking-widest uppercase rounded-none">
            <span>Đặc quyền</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight uppercase leading-tight">
            Nhận ưu đãi 15% cho đơn đầu tiên
          </h2>

          <p className="text-neutral-500 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
            Cập nhật bộ sưu tập mới nhất, tài liệu chăm sóc sức khỏe khoa học và ưu đãi dành riêng cho thành viên Pet Zone.
          </p>

          {/* Form */}
          {!isSubscribed ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto pt-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập địa chỉ email của bạn..."
                className="w-full sm:flex-1 px-4 py-3 bg-white border border-neutral-300 text-black placeholder:text-neutral-400 text-xs focus:outline-none focus:border-black rounded-none transition-colors"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider shrink-0 transition-colors rounded-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Đăng Ký</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border border-neutral-200 bg-white max-w-md mx-auto space-y-2 rounded-none text-left"
            >
              <div className="flex items-center gap-2 text-black font-bold text-xs uppercase tracking-wider">
                <Check className="w-4 h-4 text-black" />
                <span>Đăng ký thành công</span>
              </div>
              <p className="text-xs text-neutral-500">
                Mã giảm giá <strong className="text-black font-mono font-bold bg-neutral-100 px-1.5 py-0.5">PETZONE15</strong> đã được gửi tới{' '}
                <span className="text-black font-medium">{email}</span>.
              </p>
            </motion.div>
          )}

          <p className="text-[10px] uppercase tracking-wider text-neutral-400">
            Cam kết bảo mật thông tin. Bạn có thể huỷ đăng ký nhận bản tin bất kỳ lúc nào.
          </p>
        </div>
      </div>
    </section>
  );
};
