// src/components/Sidebar.jsx
import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, CreditCard, Users, BarChart2,
  TrendingUp, Bell, HelpCircle, Settings, LogOut, PawPrint, ChevronRight,
  ChevronDown, Package, ShoppingBag, Box,
} from 'lucide-react';
import { navItems } from '../constants/navigation';

const iconMap = {
  LayoutDashboard, ShoppingCart, CreditCard, Users, BarChart2,
  TrendingUp, Bell, HelpCircle, Settings, Package, PawPrint, ShoppingBag, Box,
};

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Auto-open dropdown if a child is active
  const isChildActive = (children) => {
    return children?.some(child => location.pathname === child.path);
  };

  // Initialize open dropdowns based on active children
  useEffect(() => {
    const initialOpenDropdowns = {};
    navItems.forEach(item => {
      if (item.hasDropdown && item.children && isChildActive(item.children)) {
        initialOpenDropdowns[item.id] = true;
      }
    });
    setOpenDropdowns(initialOpenDropdowns);
  }, [location.pathname]);

  const toggleDropdown = (itemId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen flex flex-col bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out z-40 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-neutral-200">
        <div className="w-8 h-8 rounded-none bg-black flex items-center justify-center flex-shrink-0">
          <PawPrint size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-extrabold text-sm tracking-widest text-black uppercase">
              Pet Zone
            </span>
            <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-semibold border-l border-neutral-200 pl-2">
              Admin
            </span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="ml-auto p-1.5 rounded-none text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
          title={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
        >
          <ChevronRight size={14} className={`transition-transform duration-200 ${collapsed ? '' : 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
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
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer group ${
                    isAnyChildActive
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon size={16} className={`flex-shrink-0 ${isAnyChildActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-900'}`} />
                  {!collapsed && (
                    <>
                      <span className="whitespace-nowrap flex-1 text-left">
                        {item.label}
                      </span>
                      <ChevronDown 
                        size={13} 
                        className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </>
                  )}
                </button>
                
                {!collapsed && isDropdownOpen && (
                  <div className="ml-4 mt-1 pl-2 border-l border-neutral-200 space-y-1">
                    {item.children.map((child) => {
                      const ChildIcon = iconMap[child.icon];
                      const isChildItemActive = location.pathname === child.path;
                      
                      return (
                        <NavLink
                          key={child.id}
                          to={child.path}
                          className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer group ${
                            isChildItemActive
                              ? 'bg-neutral-900 text-white font-semibold'
                              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                          }`}
                        >
                          <ChildIcon size={14} className={`flex-shrink-0 ${isChildItemActive ? 'text-white' : 'text-neutral-400 group-hover:text-neutral-900'}`} />
                          <span className="whitespace-nowrap">
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
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer group ${
                isActive
                  ? 'bg-neutral-900 text-white font-semibold'
                  : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
              title={collapsed ? item.label : ''}
            >
              <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-900'}`} />
              {!collapsed && (
                <span className="whitespace-nowrap flex-1 text-left">
                  {item.label}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-neutral-600 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors duration-150 cursor-pointer group"
          title={collapsed ? 'Log Out' : ''}
        >
          <LogOut size={16} className="flex-shrink-0 text-neutral-400 group-hover:text-red-600" />
          {!collapsed && <span className="whitespace-nowrap">Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
