'use client';

import React from 'react';
import {
  MapPin,
  Mail,
  Clock,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-200 scroll-mt-20">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1.5">
          Liên Hệ
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black uppercase">
          Trải nghiệm trực tiếp
        </h2>
      </div>

      {/* Main Grid: Contact Info Cards + Map Iframe */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-4">
          <div className="p-5 sm:p-6 bg-white border border-neutral-200 rounded-none">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black shrink-0 rounded-none">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Địa chỉ
                </span>
                <h3 className="font-bold text-black text-sm leading-snug">
                  123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                </h3>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-neutral-200 rounded-none">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black shrink-0 rounded-none">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Email liên hệ
                </span>
                <div>
                  <a
                    href="mailto:contact@petzone.vn"
                    className="font-bold text-black text-sm hover:underline"
                  >
                    nguyenlher@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-neutral-200 rounded-none">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 border border-neutral-200 bg-neutral-50 flex items-center justify-center text-black shrink-0 rounded-none">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Giờ hoạt động
                </span>
                <p className="font-bold text-black text-sm">
                  08:30 — 21:30 (Thứ Hai — Chủ Nhật)
                </p>
                <p className="text-xs text-neutral-500 pt-0.5">
                  Phục vụ liên tục tất cả các ngày trong tuần.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Google Map Iframe */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative w-full h-[360px] sm:h-[420px] lg:h-full min-h-[360px] rounded-none overflow-hidden border border-neutral-200 bg-neutral-100">
            <iframe
              title="Vị trí Showroom Pet Zone"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.424167419728!2d106.70175551480082!3d10.774943992322645!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4167e4125b%3A0xb3a8241473215286!2zTmd1eeG7hW4gSHXhu4csIELhur9uIE5naMOpLCBRdeG6rW4gMSwgSOG7kyBDaMOtIE1pbmgsIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1650000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full block filter grayscale contrast-[1.05]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
