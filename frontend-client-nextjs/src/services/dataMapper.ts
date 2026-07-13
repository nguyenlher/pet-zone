import { Product, Pet, CategorySlug } from '../types';
import { PET_3D_MODELS } from '../constants/pet3dModels';

export interface BackendProduct {
  id: string;
  name: string;
  brand?: string;
  category: 'FOOD' | 'ACCESSORY' | 'CLOTHING' | 'HOUSING' | 'OTHER' | string;
  petTypeId?: string;
  price: number;
  stockQuantity: number;
  soldCount?: number;
  description?: string;
  status?: string;
  avgRating?: number;
  totalReviews?: number;
  viewCount?: number;
  images?: { id?: string; imageUrl: string; isThumbnail?: boolean }[] | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface BackendPet {
  id: string;
  name: string;
  breedName?: string;
  petTypeId?: string;
  petTypeName?: string;
  gender?: 'MALE' | 'FEMALE' | string;
  ageInMonths?: number;
  weight?: number;
  colors?: string[];
  price: number;
  status?: string;
  viewCount?: number;
  thumbnailUrl?: string;
  has3DModel?: boolean;
  createdAt?: string;
}

export interface BackendPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  empty?: boolean;
}

// Fallback high-resolution images for products when DB contains placeholder.com URLs
const CATEGORY_IMAGE_POOL: Record<string, { image: string; hoverImage: string }> = {
  // Food items
  'royal canin': {
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582457601554-04df82173f4e?w=700&auto=format&fit=crop&q=80',
  },
  'pate': {
    image: 'https://images.unsplash.com/photo-1582457601554-04df82173f4e?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
  },
  'xương gặm': {
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
  },
  'sữa': {
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
  },
  FOOD_DEFAULT: {
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1582457601554-04df82173f4e?w=700&auto=format&fit=crop&q=80',
  },

  // Clothing items
  'áo mưa': {
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80',
  },
  'áo len': {
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
  },
  'giày': {
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
  },
  CLOTHING_DEFAULT: {
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
  },

  // Housing items
  'chuồng': {
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
  },
  'nệm': {
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=700&auto=format&fit=crop&q=80',
  },
  'nhà gỗ': {
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=700&auto=format&fit=crop&q=80',
  },
  'nhà cây': {
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=700&auto=format&fit=crop&q=80',
  },
  'lồng vận chuyển': {
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
  },
  HOUSING_DEFAULT: {
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=700&auto=format&fit=crop&q=80',
  },

  // Accessories
  'vòng cổ': {
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
  },
  'dây dắt': {
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=700&auto=format&fit=crop&q=80',
  },
  'bát': {
    image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=700&auto=format&fit=crop&q=80',
  },
  'bóng': {
    image: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=700&auto=format&fit=crop&q=80',
  },
  'lược': {
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=700&auto=format&fit=crop&q=80',
  },
  ACCESSORY_DEFAULT: {
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=700&auto=format&fit=crop&q=80',
    hoverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=700&auto=format&fit=crop&q=80',
  },
};

function resolveProductImages(name: string, category: string, rawImages?: { imageUrl: string }[] | null) {
  // Check if valid thumbnail in rawImages
  if (rawImages && rawImages.length > 0) {
    const validImg = rawImages.find((img) => img.imageUrl && !img.imageUrl.includes('placeholder.com'));
    if (validImg) {
      return {
        image: validImg.imageUrl,
        hoverImage: rawImages[1]?.imageUrl || validImg.imageUrl,
      };
    }
  }

  // Find by name keyword
  const lowerName = name.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_IMAGE_POOL)) {
    if (key !== 'FOOD_DEFAULT' && key !== 'CLOTHING_DEFAULT' && key !== 'HOUSING_DEFAULT' && key !== 'ACCESSORY_DEFAULT') {
      if (lowerName.includes(key)) {
        return val;
      }
    }
  }

  // Fallback by category
  if (category === 'FOOD') return CATEGORY_IMAGE_POOL.FOOD_DEFAULT;
  if (category === 'CLOTHING') return CATEGORY_IMAGE_POOL.CLOTHING_DEFAULT;
  if (category === 'HOUSING') return CATEGORY_IMAGE_POOL.HOUSING_DEFAULT;
  return CATEGORY_IMAGE_POOL.ACCESSORY_DEFAULT;
}

export function mapBackendProductToProduct(bp: BackendProduct): Product {
  let categorySlug: CategorySlug = 'phu-kien';
  let categoryLabel = 'Phụ Kiện';

  switch (bp.category) {
    case 'FOOD':
      categorySlug = 'thuc-an';
      categoryLabel = 'Thức Ăn';
      break;
    case 'CLOTHING':
      categorySlug = 'quan-ao';
      categoryLabel = 'Quần Áo';
      break;
    case 'HOUSING':
      categorySlug = 'nha-chuong';
      categoryLabel = 'Nhà / Chuồng';
      break;
    case 'ACCESSORY':
    case 'OTHER':
    default:
      categorySlug = 'phu-kien';
      categoryLabel = 'Phụ Kiện';
      break;
  }

  const { image, hoverImage } = resolveProductImages(bp.name, bp.category, bp.images);

  return {
    id: bp.id,
    name: bp.name,
    category: categoryLabel,
    categorySlug,
    price: Number(bp.price),
    rating: bp.avgRating ? Number(bp.avgRating) : 4.8,
    reviewsCount: bp.totalReviews ?? 15,
    badge: bp.soldCount !== undefined ? `Đã bán ${bp.soldCount}` : bp.brand || undefined,
    isNew: false,
    image,
    hoverImage,
    description: bp.description || `${bp.name} chất lượng cao, thương hiệu ${bp.brand || 'Pet Zone'}.`,
    tags: [bp.brand || 'Pet Zone', categoryLabel, bp.stockQuantity > 0 ? 'Còn hàng' : 'Hết hàng'],
    inStock: (bp.stockQuantity ?? 0) > 0 && bp.status !== 'OUT_OF_STOCK',
    specs: {
      'Thương hiệu': bp.brand || 'Pet Zone',
      'Số lượng trong kho': `${bp.stockQuantity || 0} sản phẩm`,
      'Đã bán': `${bp.soldCount || 0} lượt`,
    },
    soldCount: bp.soldCount ?? 0,
  };
}

export function mapBackendPetToProduct(pet: BackendPet): Pet {
  const isAvailable = pet.status === 'AVAILABLE';
  const imgUrl =
    pet.thumbnailUrl ||
    'https://res.cloudinary.com/dehn8lwxv/image/upload/v1778158475/super-petmark-3d/images/golden_retrieve_dtcl8d.jpg';

  const breedSearch = `${pet.breedName || ''} ${pet.name || ''}`.toLowerCase();
  const matched3D =
    PET_3D_MODELS.find(
      (m) =>
        breedSearch.includes(m.breed.toLowerCase()) ||
        breedSearch.includes(m.name.toLowerCase()) ||
        breedSearch.includes(m.id.toLowerCase()) ||
        m.breed.toLowerCase().includes(breedSearch)
    ) || (pet.petTypeName?.toLowerCase().includes('mèo') ? PET_3D_MODELS[12] : PET_3D_MODELS[0]);

  const petName = pet.name || 'Thú Cưng';
  const rawBreedName = pet.breedName || 'Thú Cưng';
  const typeName = pet.petTypeName || (rawBreedName.toLowerCase().includes('mèo') ? 'Mèo' : 'Chó');

  let fullBreedName = rawBreedName;
  if (!rawBreedName.toLowerCase().startsWith('chó') && !rawBreedName.toLowerCase().startsWith('mèo')) {
    fullBreedName = `${typeName} ${rawBreedName}`;
  }

  return {
    id: pet.id,
    name: fullBreedName,
    category: 'Thú Cưng',
    categorySlug: 'thu-cung',
    price: Number(pet.price),
    rating: 5.0,
    reviewsCount: pet.viewCount ? Math.floor(pet.viewCount / 2) + 5 : 24,
    badge: petName.toUpperCase(),
    isNew: true,
    image: imgUrl,
    hoverImage: imgUrl,
    description: `Bé ${pet.name} thuộc giống ${pet.breedName || 'cảnh'}, ${
      pet.ageInMonths ? `${pet.ageInMonths} tháng tuổi` : 'khoẻ mạnh'
    }, cân nặng khoảng ${pet.weight || '2.5'}kg. Đã được kiểm tra sức khỏe và tiêm chủng đầy đủ.`,
    tags: [
      pet.breedName || 'Thuần chủng',
      pet.gender === 'MALE' ? 'Giống Đực' : 'Giống Cái',
      pet.petTypeName || 'Thú cưng',
    ],
    inStock: isAvailable,
    specs: {
      'Giống': pet.breedName || 'Chó / Mèo cảnh',
      'Giới tính': pet.gender === 'MALE' ? 'Đực' : 'Cái',
      'Độ tuổi': `${pet.ageInMonths || 3} tháng tuổi`,
      'Cân nặng': `${pet.weight || 2.5} kg`,
      'Màu lông': pet.colors?.join(', ') || 'Tự nhiên',
      'Bảo hành': 'Sức khỏe & Tiêm phòng đầy đủ',
    },
    isPet: true,
    has3DModel: true,
    modelUrl: matched3D?.modelUrl,
    petName: pet.name,
    breedName: pet.breedName,
    petTypeId: pet.petTypeId,
    petTypeName: typeName,
  };
}
