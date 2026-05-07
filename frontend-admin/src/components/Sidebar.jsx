// src/components/Sidebar.jsx
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, CreditCard, Users, BarChart2,
  TrendingUp, Bell, HelpCircle, Settings, LogOut, PawPrint, ChevronRight,
  ChevronDown, Package, ShoppingBag,
} from 'lucide-react';
import { navItems } from '../data/mockData';

const iconMap = {
  LayoutDashboard, ShoppingCart, CreditCard, Users, BarChart2,
  TrendingUp, Bell, HelpCircle, Settings, Package, PawPrint, ShoppingBag,
};

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (itemId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 ease-in-out z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{ background: '#111827' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-700/50">
        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
          <PawPrint size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <span className="text-white font-bold text-base tracking-tight whitespace-nowrap">PetStore</span>
            <span className="text-emerald-400 font-bold text-base ml-0.5">Admin</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto text-gray-400 hover:text-white transition-colors duration-150 cursor-pointer"
        >
          <ChevronRight size={16} className={`transition-transform duration-300 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = location.pathname === item.path;
          const hasChildren = item.hasDropdown && item.children;
          const isDropdownOpen = openDropdowns[item.id];
          const isAnyChildActive = hasChildren && isChildActive(item.children);

          if (hasChildren) {
            return (
              <div key={item.id}>
                <button
                  onClick={() => !collapsed && toggleDropdown(item.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer group ${
                    isAnyChildActive
                      ? 'bg-white text-gray-900'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={18} className={`flex-shrink-0 ${isAnyChildActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-white'}`} />
                  {!collapsed && (
                    <>
                      <span className={`text-sm font-medium whitespace-nowrap ${isAnyChildActive ? 'text-gray-900' : ''}`}>
                        {item.label}
                      </span>
                      <ChevronDown 
                        size={14} 
                        className={`ml-auto transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </button>
                
                {!collapsed && isDropdownOpen && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = iconMap[child.icon];
                      const isChildItemActive = location.pathname === child.path;
                      
                      return (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer group ${
                            isChildItemActive
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'text-gray-400 hover:text-white hover:bg-gray-700/30'
                          }`}
                        >
                          <ChildIcon size={16} className={`flex-shrink-0 ${isChildItemActive ? 'text-emerald-400' : 'text-gray-400 group-hover:text-white'}`} />
                          <span className={`text-sm font-medium whitespace-nowrap ${isChildItemActive ? 'text-emerald-400' : ''}`}>
                            {child.label}
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-white text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={18} className={`flex-shrink-0 ${isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-white'}`} />
              {!collapsed && (
                <span className={`text-sm font-medium whitespace-nowrap ${isActive ? 'text-gray-900' : ''}`}>
                  {item.label}
                </span>
              )}
              {!collapsed && isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-2 py-4 border-t border-gray-700/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-900/20 transition-all duration-150 cursor-pointer group"
          title={collapsed ? 'Log Out' : ''}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
