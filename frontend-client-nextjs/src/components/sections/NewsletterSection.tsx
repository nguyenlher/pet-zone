'use client';

import React, { useState } from 'react';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowRight, Sparkles, Check, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsSubscribed(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#D4F442', '#FF6B4A', '#FFFFFF'],
    });
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative rounded-3xl overflow-hidden bg-black text-white p-8 sm:p-14 lg:p-20 border border-stone-800 shadow-2xl">
        {/* Dynamic Gradient Mesh / Moving Blobs Background */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#D4F442] opacity-20 blur-[100px] animate-pulse" />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF5E3A] opacity-25 blur-[120px] animate-pulse"
          style={{ animationDuration: '7s' }}
        />

        {/* Minimal Animated Grid Lines Background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#D4F442] text-xs font-bold tracking-wider uppercase backdrop-blur-md border border-white/15">
            <Gift className="w-3.5 h-3.5" />
            Ưu đãi thành viên mới
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Nhận ngay voucher <br />
            <span className="text-[#D4F442]">giảm 15%</span> đơn đầu tiên.
          </h2>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            Cùng hàng tuần nhận bí quyết chăm sóc sức khỏe và thực đơn dinh dưỡng cá nhân hoá từ các chuyên gia thú y hàng đầu.
          </p>

          {/* Form */}
          {!isSubscribed ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-4"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full sm:flex-1 px-5 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4F442] backdrop-blur-md transition-all"
              />
              <MagneticButton
                type="submit"
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#D4F442] hover:bg-[#c6e936] text-black font-extrabold text-sm shadow-xl shrink-0 transition-transform cursor-pointer"
              >
                <span>Đăng Ký</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4F442]/40 max-w-md mx-auto space-y-2"
            >
              <div className="flex items-center justify-center gap-2 text-[#D4F442] font-bold text-base">
                <Check className="w-5 h-5" />
                <span>Đăng ký thành công!</span>
              </div>
              <p className="text-xs text-stone-300">
                Mã giảm giá <strong className="text-white text-sm bg-white/20 px-2 py-0.5 rounded font-mono">PETZONE15</strong> đã được gửi tới{' '}
                <span className="text-[#D4F442] font-semibold">{email}</span>.
              </p>
            </motion.div>
          )}

          <p className="text-[11px] text-stone-400">
            Không spam thư rác. Bạn có thể huỷ đăng ký nhận tin bất cứ lúc nào chỉ với 1 cú click.
          </p>
        </div>
      </div>
    </section>
  );
};
