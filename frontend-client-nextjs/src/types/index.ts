export type CategorySlug = 'thu-cung' | 'thuc-an' | 'quan-ao' | 'nha-chuong' | 'phu-kien' | 'all' | string;

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
  isOrganic?: boolean;
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
