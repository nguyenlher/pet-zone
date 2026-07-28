'use client';

import React, { useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TurnstileCaptcha } from '@/components/ui/TurnstileCaptcha';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError('Vui lòng nhập địa chỉ email và mật khẩu.');
      return;
    }

    if (!captchaToken) {
      setFormError('Vui lòng hoàn thành xác thực bảo mật (Captcha).');
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      const result = await signIn('keycloak-credentials', {
        username: username.trim(),
        password,
        captchaToken,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        console.error('[SignIn] NextAuth signin error:', result.error, result);
        turnstileRef.current?.reset();
        setCaptchaToken(null);
        setFormError(
          result.error === 'CredentialsSignin' ||
          result.error === 'Configuration' ||
          result.error === 'CallbackRouteError'
            ? 'Tên đăng nhập hoặc mật khẩu không chính xác.'
            : 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin tài khoản.'
        );
        setLoading(false);
      } else {
        setIsSuccess(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#000000', '#D4F442', '#FF5E3A'],
        });

        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 800);
      }
    } catch (err: unknown) {
      console.error('Sign in error:', err);
      setFormError('Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau.');
      setLoading(false);
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
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
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
            <div className="pb-4 text-center text-xs sm:text-sm font-bold tracking-widest uppercase text-black relative cursor-default">
              ĐĂNG NHẬP
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-black" />
            </div>

            <Link
              href="/auth/register"
              className="pb-4 text-center text-xs sm:text-sm font-bold tracking-widest uppercase text-gray-400 hover:text-gray-700 transition-colors"
            >
              ĐĂNG KÝ
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                ĐỊA CHỈ EMAIL
              </label>
              <input
                type="email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="info@drakele.com"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                MẬT KHẨU
              </label>
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

            {/* Error Message Box */}
            {formError && (
              <div className="border border-red-500 bg-white p-4 text-xs sm:text-sm text-red-600 leading-relaxed rounded-none">
                {formError}
              </div>
            )}

            {/* Success Message Box */}
            {isSuccess && (
              <div className="border border-emerald-500 bg-emerald-50/50 p-4 text-xs sm:text-sm text-emerald-800 leading-relaxed rounded-none">
                Đăng nhập thành công! Đang chuyển hướng...
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-none accent-black cursor-pointer text-black"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <Link
                href="/auth/forgot-password"
                className="text-gray-500 hover:text-black font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Cloudflare Turnstile Captcha */}
            <div className="pt-2">
              <TurnstileCaptcha
                ref={turnstileRef}
                onSuccess={(token) => {
                  setCaptchaToken(token);
                  setFormError(null);
                }}
                onExpire={() => setCaptchaToken(null)}
                onError={() => {
                  setCaptchaToken(null);
                  setFormError('Không thể kết nối dịch vụ xác thực Captcha. Vui lòng tải lại trang.');
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSuccess || !captchaToken}
              className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 text-xs sm:text-sm tracking-widest uppercase transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
            >
              {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center text-stone-400 text-sm">
          Đang tải trang đăng nhập...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
