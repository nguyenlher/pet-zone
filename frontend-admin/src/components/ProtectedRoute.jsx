// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { isAdmin, isTokenExpired } from '../utils/jwtUtils';
import { AlertCircle } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken');

  // Check if user is authenticated
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return <Navigate to="/login" replace />;
  }

  // Check if user has ADMIN role
  if (!isAdmin(accessToken)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin dashboard. 
              Only users with ADMIN role can access this area.
            </p>
            <button
              onClick={() => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
              }}
              className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
