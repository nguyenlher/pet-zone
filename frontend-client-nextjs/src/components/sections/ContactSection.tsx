'use client';

import React from 'react';
import {
  MapPin,
  Mail,
  Clock,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-stone-900">
          GHÉ THĂM CỬA HÀNG
        </h2>
      </div>

      {/* Main Grid: Contact Info Cards + Map Iframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-stone-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D4F442]/30 flex items-center justify-center text-stone-900 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Địa chỉ
                </span>
                <h3 className="font-bold text-stone-900 text-sm sm:text-base leading-snug">
                  123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </h3>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-stone-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Email
                </span>
                <div className="flex flex-wrap items-center gap-3 pt-0.5">
                  <a
                    href="mailto:contact@petzone.vn"
                    className="font-bold text-stone-900 text-sm sm:text-base hover:text-black transition-colors"
                  >
                    nguyenlher@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-stone-200/80 shadow-sm hover:border-stone-300 transition-colors">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0 border border-sky-100">
                <Clock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                  Thời Gian Phục Vụ
                </span>
                <p className="font-bold text-stone-900 text-sm sm:text-base">
                  08:30 - 21:30 (Thứ 2 — Chủ nhật)
                </p>
                <p className="text-xs text-stone-500 pt-1">
                  Mở cửa xuyên suốt tất cả các ngày trong tuần và ngày lễ.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Google Map Iframe */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[400px] sm:h-[480px] lg:h-full min-h-[400px] rounded-3xl overflow-hidden border border-stone-200/80 shadow-md bg-stone-100">
            {/* Embedded Google Map Iframe */}
            <iframe
              title="Vị trí Showroom Pet Zone"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424167419728!2d106.70175551480082!3d10.774943992322645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4167e4125b%3A0xb3a8241473215286!2zTmd1eeG7hW4gSHXhu4csIELhur9uIE5naMOpLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full block filter contrast-[1.02] saturate-[1.05]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
