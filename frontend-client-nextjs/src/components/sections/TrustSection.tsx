'use client';

import React from 'react';
import { STATS, TESTIMONIALS } from '../../data/mockData';
import { Star, CheckCircle2, HeartHandshake, ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* 1. Numerical Stats Grid */}
      <div className="bg-[#FAF9F5] rounded-3xl p-8 sm:p-12 border border-stone-200/80 shadow-sm">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex flex-col justify-between ${i !== 0 ? 'sm:pl-8' : ''} ${
                i > 1 ? 'pt-6 sm:pt-0' : ''
              }`}
            >
              <div>
                <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-sm font-bold text-stone-800 mt-2 block">
                  {stat.label}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {stat.sublabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. Core Pillars Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-3xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3ED] flex items-center justify-center text-[#4A7C59] mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Chứng Nhận Kiểm Nghiệm</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              100% thức ăn và phụ kiện đều vượt qua kiểm định vi sinh, không chứa chất gây dị ứng cho da lông thú cưng.
            </p>
          </div>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#F9ECE7] flex items-center justify-center text-[#D9654B] mb-4">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Bác Sĩ Thú Y Đồng Hành</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Tư vấn dinh dưỡng và khẩu phần ăn cá nhân hóa theo thể trạng và độ tuổi của từng bé hoàn toàn miễn phí.
            </p>
          </div>
        </div>

        <div className="p-7 rounded-3xl bg-white border border-stone-200/80 shadow-sm flex flex-col justify-between">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEF9] flex items-center justify-center text-[#7A62A8] mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">Đổi Trả 30 Ngày</h3>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Nếu boss không hợp tác hoặc không vừa size phụ kiện, Pet Zone hỗ trợ đổi mới tận nhà nhanh chóng.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Customer Testimonials */}
      <div id="reviews">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
            Cộng Đồng Sen & Boss
          </span>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-stone-900">
            Hàng ngàn lời khen từ <br /> những người bạn nhỏ.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-3xl bg-white p-7 border border-stone-200/80 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                <p className="text-stone-700 text-sm leading-relaxed italic">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & Pet Info */}
              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={t.avatar}
                      alt={t.author}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <img
                      src={t.petAvatar}
                      alt={t.petName}
                      className="w-5 h-5 rounded-full object-cover border-2 border-white absolute -bottom-1 -right-1 shadow-sm"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-1">
                      {t.author}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                    </h4>
                    <p className="text-[11px] text-stone-400">
                      Chủ của {t.petName} ({t.petBreed})
                    </p>
                  </div>
                </div>
                <span className="text-[10px] text-stone-400">{t.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
