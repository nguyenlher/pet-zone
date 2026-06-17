export type CategorySlug = 'thu-cung' | 'thuc-an' | 'quan-ao' | 'nha-chuong' | 'phu-kien' | 'all' | string;

export interface PaginatedResult<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  page: number; // 0-based từ server
  size: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: CategorySlug;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  isNew?: boolean;
  image: string;
  hoverImage: string;
  description: string;
  tags: string[];
  colors?: { name: string; hex: string }[];
  inStock: boolean;
  specs?: { [key: string]: string };
}

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  count: string;
  description: string;
  icon: string;
  bgColor: string;
  accentColor: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  petName: string;
  petBreed: string;
  avatar: string;
  petAvatar: string;
  comment: string;
  rating: number;
  verified: boolean;
  date: string;
}

export interface StatItem {
  value: string;
  label: string;
  sublabel: string;
  highlight?: string;
}

export interface ShippingDetail {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: 'COD' | 'VNPAY' | string;
}

export interface OrderItem {
  id: string;
  itemType: 'PRODUCT' | 'PET' | string;
  name: string;
  quantity: number;
  price: number;
  subtotalPrice: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PENDING_PAYMENT'
  | 'PROCESSING'
  | 'CONFIRMED'
  | 'DELIVERING'
  | 'DELIVERED'
  | 'CANCELLED'
  | string;

export interface Order {
  orderId: string;
  userId?: string | null;
  subtotalAmount: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  items: OrderItem[];
  shipping?: ShippingDetail;
  paymentUrl?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateOrderPayload {
  userId?: string | null;
  discountCode?: string;
  items: {
    itemType: 'PRODUCT' | 'PET' | string;
    itemId: string;
    quantity: number;
  }[];
  shipping: ShippingDetail;
}

