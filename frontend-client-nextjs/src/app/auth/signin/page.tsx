'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  LogIn,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

function SignInContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setFormError('Vui lòng nhập tên đăng nhập/email và mật khẩu.');
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      // Send credentials directly through NextAuth to Keycloak via OpenID Connect
      const result = await signIn('keycloak-credentials', {
        username: username.trim(),
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setFormError(
          result.error === 'CredentialsSignin'
            ? 'Tên đăng nhập hoặc mật khẩu không chính xác.'
            : result.error
        );
        setLoading(false);
      } else {
        setIsSuccess(true);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#D4F442', '#FF5E3A', '#2D4A3E'],
        });

        // Smooth redirect
        setTimeout(() => {
          router.push(callbackUrl);
          router.refresh();
        }, 1000);
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      setFormError('Không thể kết nối đến máy chủ xác thực Keycloak.');
      setLoading(false);
    }
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
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-8 sm:p-10 space-y-7"
        >
          {/* Header text */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black tracking-tight text-stone-900">
              Đăng Nhập
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto">
              Nhập thông tin tài khoản của bạn để đăng nhập vào Pet Zone.
            </p>
          </div>

          {/* Success State */}
          {isSuccess && (
            <div className="p-4 rounded-2xl bg-[#EBF3ED] border border-emerald-300 flex items-center gap-3 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-bold">Đăng nhập thành công! Đang chuyển hướng...</span>
            </div>
          )}

          {/* Error Alert */}
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Direct Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 block">
                Tên đăng nhập hoặc Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin hoặc email@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700">Mật khẩu</label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-stone-500 hover:text-black font-semibold"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-2xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-black placeholder:text-stone-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2 pt-1">
              <input
                id="remember"
                type="checkbox"
                defaultChecked
                className="w-4 h-4 rounded border-stone-300 text-black focus:ring-black accent-black cursor-pointer"
              />
              <label htmlFor="remember" className="text-xs text-stone-600 cursor-pointer">
                Ghi nhớ đăng nhập trên thiết bị này
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSuccess}
              className="w-full py-4 px-6 rounded-2xl bg-black hover:bg-stone-800 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4 text-[#D4F442]" />
              <span>{loading ? 'Đang gửi xác thực OIDC...' : 'Đăng Nhập'}</span>
            </button>
          </form>

          {/* Footer Link to Register */}
          <div className="pt-2 text-center text-xs text-stone-500 border-t border-stone-100">
            Chưa có tài khoản?{' '}
            <Link
              href="/auth/register"
              className="font-bold text-stone-900 hover:underline inline-flex items-center gap-1"
            >
              Đăng ký thành viên mới
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Pet Zone. Giao thức xác thực an toàn chuẩn OpenID Connect & Keycloak.
      </footer>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF9F5] flex items-center justify-center text-stone-400 text-sm">
          Đang tải trang đăng nhập...
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
