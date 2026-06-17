'use client';

import React from 'react';
import { Star, CheckCircle2, HeartHandshake, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatItem, Testimonial } from '@/types';

const STATS: StatItem[] = [
  {
    value: '150,000+',
    label: 'Thú Cưng Đồng Hành',
    sublabel: 'Trên khắp các tỉnh thành cả nước',
    highlight: 'Hạnh phúc',
  },
  {
    value: '99.8%',
    label: 'Đánh Giá 5 Sao',
    sublabel: 'Dựa trên hơn 24,000 phản hồi thật',
    highlight: 'Tin cậy',
  },
  {
    value: '100%',
    label: 'Chuẩn Kiểm Định',
    sublabel: 'Không chất độc hại & an toàn sinh học',
    highlight: 'Chứng nhận',
  },
  {
    value: '60 Phút',
    label: 'Giao Nhanh Thần Tốc',
    sublabel: 'Đơn hoả tốc nội thành Hà Nội & TP.HCM',
    highlight: 'Hỏa tốc',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Trang Hoàng',
    petName: 'Bơ & Đậu',
    petBreed: 'Mèo Anh Lông Ngắn',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    petAvatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80',
    comment: 'Bát sứ nung bảo vệ chiếc cằm của 2 bé mèo nhà mình khỏi mụn đen. Độ dốc 15 độ thấy rõ các bé ăn thoải mái hơn nhiều, không còn bị nôn trớ sau khi ăn no. Đóng gói hộp rất cao cấp!',
    rating: 5,
    verified: true,
    date: '3 ngày trước',
  },
  {
    id: 'test-2',
    author: 'Minh Đăng',
    petName: 'Milo',
    petBreed: 'Corgi Pembroke 2 tuổi',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    petAvatar: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=200&auto=format&fit=crop&q=80',
    comment: 'Vòng cổ gắn AirTag cực kỳ an toàn mỗi khi dẫn Milo đi công viên. Chất da mềm êm không siết lông, khoá bấm rất chắc chắn. 10/10 xứng đáng!',
    rating: 5,
    verified: true,
    date: '1 tuần trước',
  },
  {
    id: 'test-3',
    author: 'Khánh Linh',
    petName: 'Mochi',
    petBreed: 'Poodle Toy',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    petAvatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&auto=format&fit=crop&q=80',
    comment: 'Thức ăn dinh dưỡng rất thơm ngon, Mochi kén ăn số 1 mà giờ cứ đến giờ ăn là ngoan ngoãn ngồi chờ. Đội ngũ bác sĩ tư vấn khẩu phần rất có tâm.',
    rating: 5,
    verified: true,
    date: '2 tuần trước',
  },
];

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
              100% thức ăn và phụ kiện đều vượt qua kiểm định an toàn, không chứa chất gây dị ứng cho da lông thú cưng.
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
