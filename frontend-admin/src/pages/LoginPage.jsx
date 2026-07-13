// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(email.trim(), password);

      if (response.access_token) {
        localStorage.setItem('accessToken', response.access_token);
        localStorage.setItem('refreshToken', response.refresh_token);

        // Check if user has ADMIN role
        const { isAdmin, getUserInfoFromToken } = await import('../utils/jwtUtils');

        if (!isAdmin(response.access_token)) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');

          const userInfo = getUserInfoFromToken(response.access_token);
          const roles = userInfo?.roles?.join(', ') || 'none';

          setError(`Truy cập bị từ chối. Yêu cầu quyền Quản trị viên (Admin). Vai trò tài khoản của bạn: ${roles}`);
          setIsLoading(false);
          return;
        }

        navigate('/', { replace: true });
      } else {
        setError('Phản hồi không hợp lệ từ máy chủ.');
      }
    } catch (err) {
      console.error('Login error:', err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        setError(serverMsg);
      } else if (err.response?.status === 401 || err.response?.status === 400) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
      } else {
        setError('Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-[540px]">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <span className="text-xs uppercase font-extrabold tracking-[0.25em] text-neutral-400">
              Quản trị hệ thống
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
            Pet Zone
          </h1>
        </div>

        {/* Section Header (Styled like the title in image) */}
        <div className="border-b border-gray-200 mb-8 pb-4 relative">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest uppercase text-black">
            ĐĂNG NHẬP
          </h2>
          <span className="absolute bottom-0 left-0 w-24 h-[2.5px] bg-black" />
        </div>

        {/* Form Container */}
        <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="admin@petzone.com"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              MẬT KHẨU
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3.5 border border-gray-300 rounded-none text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Error Message Box (Matches screenshot red outline box) */}
          {error && (
            <div className="border border-red-500 bg-white p-4 text-xs sm:text-sm text-red-600 leading-relaxed rounded-none">
              {error}
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

            <button
              type="button"
              onClick={() => setError('Vui lòng liên hệ Quản trị viên hệ thống để cấp lại mật khẩu.')}
              className="text-gray-500 hover:text-black font-medium transition-colors cursor-pointer"
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-4 text-xs sm:text-sm tracking-widest uppercase transition-colors rounded-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-4"
          >
            {isLoading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
          </button>
        </form>

        {/* Footer info */}
        <p className="text-center text-xs text-gray-400 mt-10">
          © {new Date().getFullYear()} Pet Zone Admin. Giao thức xác thực an toàn chuẩn OpenID Connect.
        </p>
      </div>
    </div>
  );
}
