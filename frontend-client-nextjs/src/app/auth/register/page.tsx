'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function RegisterPage() {
  const router = useRouter();

  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Password match verification
  const isConfirmFilled = confirmPassword.length > 0;
  const isPasswordMatch = isConfirmFilled && password === confirmPassword;
  const isPasswordMismatch = isConfirmFilled && password !== confirmPassword;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (
      !lastName.trim() ||
      !firstName.trim() ||
      !phoneNumber.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả 6 thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    // Phone validation (Vietnamese standard format: 10-11 digits)
    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg('Số điện thoại không hợp lệ (Ví dụ: 0912345678).');
      return;
    }

    setSubmitting(true);

    // Simulate account registration
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4F442', '#FF6B4A', '#2D4A3E'],
      });

      // Auto redirect to sign in after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#121316] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="p-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Trở về Trang chủ</span>
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
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-lg bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 sm:p-10 space-y-7"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-stone-900">
              Đăng Ký Tài Khoản
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Điền thông tin của bạn để tạo tài khoản mua sắm và nhận ưu đãi thành viên.
            </p>
          </div>

          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Box */}
          {success ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 rounded-2xl bg-[#EBF3ED] border border-emerald-300 text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-emerald-900">
                Đăng ký tài khoản thành công!
              </h3>
              <p className="text-xs text-emerald-700 max-w-xs mx-auto">
                Chào mừng <strong>{lastName} {firstName}</strong> gia nhập Pet Zone. Đang chuyển hướng bạn tới trang đăng nhập...
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Row 1: Họ & Tên */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Họ */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Họ <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Nguyễn"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
                    />
                  </div>
                </div>

                {/* 2. Tên */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700 block">
                    Tên <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Văn A"
                      className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Số điện thoại (Dòng độc lập) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Số điện thoại <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* 4. Email (Dòng độc lập) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ban@example.com"
                    className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
                  />
                </div>
              </div>

              {/* 5. Mật khẩu (Dòng độc lập) */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700 block">
                  Mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 6. Xác nhận mật khẩu (Dòng độc lập với phản hồi trực tiếp) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-700">
                    Xác nhận mật khẩu <span className="text-rose-500">*</span>
                  </label>
                  {isPasswordMatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mật khẩu trùng khớp
                    </span>
                  )}
                  {isPasswordMismatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-500 transition-all">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Mật khẩu chưa khớp
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock
                    className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                      isPasswordMatch
                        ? 'text-emerald-500'
                        : isPasswordMismatch
                        ? 'text-rose-400'
                        : 'text-stone-400'
                    }`}
                  />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-11 py-2.5 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all placeholder:text-stone-400 ${
                      isPasswordMatch
                        ? 'bg-emerald-50/40 border border-emerald-400 focus:ring-emerald-500 text-stone-900'
                        : isPasswordMismatch
                        ? 'bg-rose-50/40 border border-rose-300 focus:ring-rose-400 text-stone-900'
                        : 'bg-stone-50 border border-stone-200 focus:ring-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2 pt-2 text-[11px] text-stone-500">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  defaultChecked
                  className="w-3.5 h-3.5 rounded border-stone-300 text-black focus:ring-black accent-black cursor-pointer mt-0.5"
                />
                <label htmlFor="terms" className="cursor-pointer leading-tight">
                  Tôi đồng ý với{' '}
                  <span className="underline text-stone-800 font-semibold">
                    Điều khoản dịch vụ
                  </span>{' '}
                  và{' '}
                  <span className="underline text-stone-800 font-semibold">
                    Chính sách bảo mật
                  </span>{' '}
                  của Pet Zone.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-2xl bg-black hover:bg-stone-800 text-white font-extrabold text-sm transition-transform active:scale-[0.98] cursor-pointer shadow-xl disabled:opacity-50 mt-2"
              >
                {submitting ? 'Đang tạo tài khoản...' : 'Hoàn Tất Đăng Ký'}
              </button>
            </form>
          )}

          {/* Footer link to Sign In */}
          <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
            Đã có tài khoản?{' '}
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
        © {new Date().getFullYear()} Pet Zone. Giao thức xác thực an toàn.
      </footer>
    </div>
  );
}
