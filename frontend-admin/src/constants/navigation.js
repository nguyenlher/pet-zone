// src/constants/navigation.js

// Navigation items for admin sidebar
export const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/',
    hasDropdown: false,
  },
  {
    id: 'products',
    label: 'Products',
    icon: 'Package',
    path: '/items/products',
    hasDropdown: true,
    children: [
      {
        id: 'pets',
        label: 'Pets',
        icon: 'PawPrint',
        path: '/items/pets',
      },
      {
        id: 'all-products',
        label: 'Products',
        icon: 'ShoppingBag',
        path: '/items/products',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: 'ShoppingCart',
    path: '/orders',
    hasDropdown: false,
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: 'Users',
    path: '/customers',
    hasDropdown: false,
  },

  {
    id: 'generate-3d',
    label: '3D Generation',
    icon: 'Box',
    path: '/generate-3d',
    hasDropdown: false,
  },
];
