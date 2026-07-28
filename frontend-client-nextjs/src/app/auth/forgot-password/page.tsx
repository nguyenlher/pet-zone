'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authService } from '@/services/authService';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Vui lòng nhập một địa chỉ email hợp lệ.');
      return;
    }

    if (!captchaToken) {
      setErrorMsg('Vui lòng hoàn thành xác thực bảo mật (Captcha).');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      await authService.forgotPassword(email.trim(), captchaToken);
      setSubmitted(true);
    } catch (err: unknown) {
      console.error('[forgot-password] Lỗi gửi yêu cầu:', err);
      turnstileRef.current?.reset();
      setCaptchaToken(null);
      const msg =
        err instanceof Error
          ? err.message
          : 'Không thể gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra lại địa chỉ email hoặc thử lại sau.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#121316] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="p-6 max-w-5xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-black transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại Đăng nhập</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[540px]">
          {/* Brand Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-neutral-400">
                Khôi phục tài khoản
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Pet Zone
            </h1>
          </div>

          {/* Section Header */}
          <div className="border-b border-gray-200 mb-8 pb-4 relative">
            <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-black">
              QUÊN MẬT KHẨU
            </h2>
            <span className="absolute bottom-0 left-0 w-28 h-[2.5px] bg-black" />
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                Nhập địa chỉ email đã đăng ký của bạn để nhận liên kết khôi phục mật khẩu.
              </p>

              {/* Email Field */}
              <div>
                <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  ĐỊA CHỈ EMAIL
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@drakele.com"
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Error Message Box */}
              {errorMsg && (
                <div className="border border-red-500 bg-white p-4 text-xs sm:text-sm text-red-600 leading-relaxed rounded-none">
                  {errorMsg}
                </div>
              )}

              {/* Cloudflare Turnstile Captcha */}
              <div className="pt-2">
                <TurnstileCaptcha
                  ref={turnstileRef}
                  onSuccess={(token) => {
                    setCaptchaToken(token);
                    setErrorMsg(null);
                  }}
                  onExpire={() => setCaptchaToken(null)}
                  onError={() => {
                    setCaptchaToken(null);
                    setErrorMsg('Không thể kết nối dịch vụ xác thực Captcha. Vui lòng tải lại trang.');
                  }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !captchaToken}
                className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 text-xs sm:text-sm tracking-widest uppercase transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
              >
                {loading ? 'ĐANG GỬI YÊU CẦU...' : 'GỬI LIÊN KẾT ĐẶT LẠI MẬT KHẨU'}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="border border-emerald-500 bg-emerald-50/50 p-5 text-xs sm:text-sm text-emerald-800 leading-relaxed rounded-none">
                <p className="font-bold mb-1">Kiểm tra hộp thư của bạn</p>
                <p>
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra cả mục Thư rác (Spam) nếu không thấy thư.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs sm:text-sm pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-gray-600 hover:text-black font-semibold underline cursor-pointer"
                >
                  Gửi lại với email khác
                </button>

                <Link
                  href="/auth/signin"
                  className="text-black font-bold uppercase tracking-wider hover:underline"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </div>
          )}

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
