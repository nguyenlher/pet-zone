// src/data/mockData.js

// Navigation items for sidebar
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
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart2',
    path: '/reports',
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

// Current offers data
export const currentOffers = [
  {
    id: 1,
    name: 'Summer Sale - 20% Off',
    expiry: 'Expires in 5 days',
    progress: 75,
  },
  {
    id: 2,
    name: 'New Customer Discount',
    expiry: 'Expires in 12 days',
    progress: 45,
  },
  {
    id: 3,
    name: 'Pet Food Bundle Deal',
    expiry: 'Expires in 3 days',
    progress: 90,
  },
  {
    id: 4,
    name: 'Free Shipping Weekend',
    expiry: 'Expires in 2 days',
    progress: 60,
  },
];
