'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  ArrowLeft,
  Mail,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const keycloakResetUrl = `${
    process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER ||
    'http://localhost:8080/realms/super-petmark-3d'
  }/login-actions/reset-credentials?client_id=${
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'user-service'
  }`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập một địa chỉ email hợp lệ.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    // Simulate sending recovery email
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#121316] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Đăng nhập</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white">
            <svg
              className="w-4 h-4 text-[#D4F442] fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 11c-2.21 0-4 1.79-4 4 0 1.94 1.38 3.56 3.23 3.93.5.1 1.04.1 1.54 0 1.85-.37 3.23-1.99 3.23-3.93 0-2.21-1.79-4-4-4z" />
              <circle cx="7" cy="8.5" r="2" />
              <circle cx="17" cy="8.5" r="2" />
              <circle cx="10" cy="5.5" r="1.8" />
              <circle cx="14" cy="5.5" r="1.8" />
            </svg>
          </div>
          <span className="font-extrabold text-base tracking-tight text-stone-900">
            Pet Zone<span className="text-[#FF5E3A]">.</span>
          </span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 sm:p-10 space-y-7"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#F9ECE7] text-[#D9654B] flex items-center justify-center mx-auto mb-2 shadow-sm">
              <KeyRound className="w-7 h-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900">
              Khôi Phục Mật Khẩu
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto">
              Đừng lo lắng! Nhập email đã đăng ký tài khoản Pet Zone để nhận hướng dẫn đặt lại mật khẩu an toàn.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Địa chỉ Email của bạn
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-black hover:bg-stone-800 text-white font-extrabold text-sm transition-transform active:scale-[0.98] shadow-xl cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Đang xử lý...' : 'Gửi Liên Kết Đặt Lại Mật Khẩu'}
              </button>

              {/* Direct Keycloak Reset Portal */}
              <div className="pt-2 border-t border-stone-100 text-center">
                <a
                  href={keycloakResetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-black transition-colors"
                >
                  <span>Đặt lại trực tiếp trên cổng Keycloak IAM</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-5 text-center"
            >
              <div className="p-6 rounded-2xl bg-[#EBF3ED] border border-emerald-200 space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-emerald-950 text-sm">
                  Kiểm tra hộp thư của bạn
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến{' '}
                  <strong className="text-emerald-950">{email}</strong>. Vui lòng kiểm tra cả mục Thư rác (Spam) nếu không thấy sau 2 phút.
                </p>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="text-xs text-stone-500 hover:text-black font-semibold underline cursor-pointer"
              >
                Gửi lại email khác
              </button>
            </motion.div>
          )}

          {/* Back to sign in */}
          <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
            Nhớ mật khẩu rồi?{' '}
            <Link
              href="/auth/signin"
              className="font-bold text-stone-900 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Pet Zone. Keycloak Self-Service Password Reset.
      </footer>
    </div>
  );
}
