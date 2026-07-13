'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { authService } from '@/services/authService';

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
  const [agreed, setAgreed] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<{ text: string; emailHighlight?: string } | null>(null);
  const [success, setSuccess] = useState(false);

  // Password confirmation states
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!agreed) {
      setErrorMsg({ text: 'Vui lòng đồng ý với điều khoản và chính sách bảo mật để tiếp tục.' });
      return;
    }

    if (!lastName.trim() || !firstName.trim()) {
      setErrorMsg({ text: 'Vui lòng nhập đầy đủ họ và tên.' });
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg({ text: 'Vui lòng nhập số điện thoại.' });
      return;
    }

    const cleanPhone = phoneNumber.replace(/\s+/g, '');
    const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(cleanPhone)) {
      setErrorMsg({ text: 'Số điện thoại không hợp lệ (Ví dụ: 0912345678).' });
      return;
    }

    if (!email.trim() || !password || !confirmPassword) {
      setErrorMsg({ text: 'Vui lòng điền đầy đủ các trường thông tin bắt buộc.' });
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg({ text: 'Mật khẩu và xác nhận mật khẩu không khớp. Vui lòng kiểm tra lại.' });
      return;
    }

    if (password.length < 6) {
      setErrorMsg({ text: 'Mật khẩu phải chứa ít nhất 6 ký tự.' });
      return;
    }

    setSubmitting(true);

    try {
      await authService.register({
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      setSubmitting(false);
      setSuccess(true);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#D4F442', '#FF6B4A'],
      });

      setTimeout(() => {
        router.push('/auth/signin');
      }, 1500);
    } catch (err: unknown) {
      setSubmitting(false);
      const message = err instanceof Error ? err.message : '';
      if (
        message.includes('already in use') ||
        message.includes('already exists') ||
        message.includes('Duplicate') ||
        message.includes('409')
      ) {
        setErrorMsg({
          text: 'Mật khẩu bạn vừa nhập đã được email ',
          emailHighlight: email.trim(),
        });
      } else {
        setErrorMsg({
          text: message || 'Đăng ký tài khoản không thành công. Vui lòng thử lại sau.',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#121316] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="p-6 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Trở về Trang chủ</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-10">
        <div className="w-full max-w-[540px]">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-neutral-400">
                Tài khoản khách hàng
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Pet Zone
            </h1>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-2 border-b border-gray-200 mb-8">
            <Link
              href="/auth/signin"
              className="pb-4 text-center text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors"
            >
              ĐĂNG NHẬP
            </Link>

            <div className="pb-4 text-center text-xs sm:text-sm font-bold tracking-widest uppercase text-black relative cursor-default">
              ĐĂNG KÝ
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black" />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {/* 1. HỌ & TÊN (trên cùng) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  HỌ
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nguyễn"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  TÊN
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Văn A"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* 2. SỐ ĐIỆN THOẠI */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                SỐ ĐIỆN THOẠI
              </label>
              <input
                type="tel"
                required
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0912 345 678"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* 3. ĐỊA CHỈ EMAIL */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                ĐỊA CHỈ EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nguyenvana@gmail.com"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* 4. MẬT KHẨ & XÁC NHẬN MẬT KHẨ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                    MẬT KHẨU
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full px-4 py-3.5 pr-10 border rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${
                      password
                        ? 'bg-[#FEFEDF] border-gray-300 focus:border-black'
                        : 'bg-white border-gray-300 focus:border-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1"
                    title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider">
                    XÁC NHẬN MẬT KHẨU
                  </label>
                  {/* Real-time match status indicator */}
                  {passwordsMatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                      <Check className="w-3 h-3" />
                      Khớp
                    </span>
                  )}
                  {passwordsMismatch && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600">
                      <X className="w-3 h-3" />
                      Chưa khớp
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className={`w-full px-4 py-3.5 pr-10 border rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none transition-colors ${
                      passwordsMismatch
                        ? 'bg-[#FEFEDF] border-red-500 focus:border-red-600'
                        : confirmPassword
                        ? 'bg-[#FEFEDF] border-gray-300 focus:border-black'
                        : 'bg-white border-gray-300 focus:border-black'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1"
                    title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message Box */}
            {errorMsg && (
              <div className="border border-red-500 bg-white p-4 text-xs sm:text-sm text-red-600 leading-relaxed rounded-none">
                {errorMsg.emailHighlight ? (
                  <span>
                    {errorMsg.text}
                    <span className="text-blue-600 font-medium">{errorMsg.emailHighlight}</span>
                    {' sử dụng. Vui lòng chọn mật khẩu khác.'}
                  </span>
                ) : (
                  errorMsg.text
                )}
              </div>
            )}

            {/* Success Message Box */}
            {success && (
              <div className="border border-emerald-500 bg-emerald-50/50 p-4 text-xs sm:text-sm text-emerald-800 leading-relaxed rounded-none">
                Đăng ký thành công! Đang chuyển hướng bạn tới trang đăng nhập...
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="pt-1">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 rounded-none accent-black cursor-pointer text-black"
                />
                <span className="text-xs sm:text-sm text-gray-800 font-medium">
                  Tôi đồng ý với điều khoản và chính sách bảo mật.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || success}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 text-xs sm:text-sm tracking-widest uppercase transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
            >
              {submitting ? 'ĐANG TẠO TÀI KHOẢN...' : 'TẠO TÀI KHOẢN'}
            </button>
          </form>

          {/* Footer note */}
          <p className="text-center text-xs text-gray-400 mt-10">
            © {new Date().getFullYear()} Pet Zone. Giao thức xác thực an toàn chuẩn OpenID Connect.
          </p>
        </div>
      </main>

      <div className="p-4" />
    </div>
  );
}
