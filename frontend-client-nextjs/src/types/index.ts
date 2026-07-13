export type CategorySlug = 'thu-cung' | 'thuc-an' | 'quan-ao' | 'nha-chuong' | 'phu-kien' | 'all' | string;

export interface PaginatedResult<T> {
  items: T[];
  totalElements: number;
  totalPages: number;
  page: number; // 0-based từ server
  size: number;
}

export interface BaseItem {
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
  modelUrl?: string;
  has3DModel?: boolean;
}

/**
 * Pet entity - represents a living animal with specific biological attributes
 */
export interface Pet extends BaseItem {
  isPet: true;
  petName: string;
  breedName?: string;
  petTypeId?: string;
  petTypeName?: string;
  soldCount?: number;
}

/**
 * Product entity - represents physical retail merchandise (food, clothing, accessories, housing)
 */
export interface Product extends BaseItem {
  isPet?: false;
  brand?: string;
  stockQuantity?: number;
  soldCount?: number;
}

/**
 * Polymorphic union type representing any purchasable item across the store
 */
export type StoreItem = Product | Pet;

/**
 * Type guard to safely check whether a StoreItem is a Pet
 */
export function isPetItem(item: StoreItem): item is Pet {
  return Boolean(
    item.isPet ||
    item.categorySlug === 'thu-cung' ||
    item.category?.toLowerCase().includes('thú cưng')
  );
}

export interface PetType {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  isActive?: boolean;
  displayOrder?: number;
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
  product: StoreItem;
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

