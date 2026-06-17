import { Product, Category, CategorySlug, PaginatedResult } from '../types';
import { petService } from './petService';
import { productService } from './productService';
import { mapBackendProductToProduct, mapBackendPetToProduct } from './dataMapper';
import { STORE_CATEGORIES } from '../constants/categories';


export interface StoreCounts {
  pets: number;
  food: number;
  clothing: number;
  housing: number;
  accessory: number;
  total: number;
}

export interface StorePaginationParams {
  categorySlug?: string;
  page?: number; // 0-based
  size?: number; // default 8
  keyword?: string;
  priceRangeId?: string; // 'all' | 'under-300' | '300-600' | 'above-600'
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  inStockOnly?: boolean;
}

/**
 * Fetch products and/or pets with server-side offset-based pagination and SQL filters.
 * Fully queries PostgreSQL database via API Gateway.
 */
export async function fetchStoreProductsPaginated(params: StorePaginationParams): Promise<PaginatedResult<Product>> {
  const {
    categorySlug = 'all',
    page = 0,
    size = 8,
    keyword,
    priceRangeId,
    inStockOnly,
  } = params;

  // Resolve minPrice / maxPrice from priceRangeId if provided
  let minPrice = params.minPrice;
  let maxPrice = params.maxPrice;
  if (priceRangeId) {
    if (priceRangeId === 'under-300') {
      maxPrice = 300000;
      minPrice = undefined;
    } else if (priceRangeId === '300-600') {
      minPrice = 300000;
      maxPrice = 600000;
    } else if (priceRangeId === 'above-600') {
      minPrice = 600000;
      maxPrice = undefined;
    }
  }

  // Resolve backend sorting parameters
  let sortBy = 'createdAt';
  let sortDirection = 'DESC';
  if (params.sortBy === 'price-asc') {
    sortBy = 'price';
    sortDirection = 'ASC';
  } else if (params.sortBy === 'price-desc') {
    sortBy = 'price';
    sortDirection = 'DESC';
  } else if (params.sortBy === 'rating') {
    sortBy = categorySlug === 'thu-cung' ? 'viewCount' : 'avgRating';
    sortDirection = 'DESC';
  }

  const cleanKeyword = keyword && keyword.trim() ? keyword.trim() : undefined;

  try {
    // 1. Tab Thú Cưng: Queries /public/pets/filter
    if (categorySlug === 'thu-cung') {
      const petPage = await petService.getPetsWithFilters({
        minPrice,
        maxPrice,
        status: inStockOnly ? 'AVAILABLE' : undefined,
        keyword: cleanKeyword,
        page,
        size,
        sortBy,
        sortDirection,
      });

      return {
        items: (petPage.content || []).map(mapBackendPetToProduct),
        totalElements: petPage.totalElements ?? 0,
        totalPages: petPage.totalPages ?? 1,
        page: petPage.number ?? page,
        size: petPage.size ?? size,
      };
    }

    // 2. Merchandise Categories: Query /public/products/filter
    let categoryParam: string | undefined = undefined;
    if (categorySlug === 'thuc-an') categoryParam = 'FOOD';
    else if (categorySlug === 'quan-ao') categoryParam = 'CLOTHING';
    else if (categorySlug === 'nha-chuong') categoryParam = 'HOUSING';
    else if (categorySlug === 'phu-kien') categoryParam = 'ACCESSORY';

    const prodPage = await productService.getProductsWithFilters({
      category: categoryParam,
      minPrice,
      maxPrice,
      status: inStockOnly ? 'AVAILABLE' : undefined,
      keyword: cleanKeyword,
      page,
      size,
      sortBy,
      sortDirection,
    });

    return {
      items: (prodPage.content || []).map(mapBackendProductToProduct),
      totalElements: prodPage.totalElements ?? 0,
      totalPages: prodPage.totalPages ?? 1,
      page: prodPage.number ?? page,
      size: prodPage.size ?? size,
    };
  } catch (error) {
    console.error('[storeService] Lỗi khi nạp dữ liệu phân trang từ API Gateway:', error);
    return {
      items: [],
      totalElements: 0,
      totalPages: 1,
      page,
      size,
    };
  }
}

/**
 * Backward compatible helper for featured section or initial loads
 */
export async function fetchStoreProducts(categorySlug?: string | null): Promise<Product[]> {
  const result = await fetchStoreProductsPaginated({
    categorySlug: categorySlug || 'all',
    page: 0,
    size: 24,
  });
  return result.items;
}

/**
 * Fetch dynamic category counts from database via API Gateway.
 */
export async function fetchStoreCategories(): Promise<Category[]> {
  try {
    const [petsRes, foodRes, clothRes, houseRes, accRes, otherRes] = await Promise.all([
      petService.getAllPets(0, 1).catch(() => null),
      productService.getProductsByCategory('FOOD', 0, 1).catch(() => null),
      productService.getProductsByCategory('CLOTHING', 0, 1).catch(() => null),
      productService.getProductsByCategory('HOUSING', 0, 1).catch(() => null),
      productService.getProductsByCategory('ACCESSORY', 0, 1).catch(() => null),
      productService.getProductsByCategory('OTHER', 0, 1).catch(() => null),
    ]);

    const petCount = petsRes?.totalElements ?? 19;
    const foodCount = foodRes?.totalElements ?? 10;
    const clothCount = clothRes?.totalElements ?? 5;
    const houseCount = houseRes?.totalElements ?? 6;
    const accCount = (accRes?.totalElements ?? 11) + (otherRes?.totalElements ?? 7);

    return [
      {
        ...STORE_CATEGORIES[0],
        count: `${petCount}+ bé thuần chủng`,
      },
      {
        ...STORE_CATEGORIES[1],
        count: `${foodCount}+ sản phẩm`,
      },
      {
        ...STORE_CATEGORIES[2],
        count: `${clothCount}+ mẫu thiết kế`,
      },
      {
        ...STORE_CATEGORIES[3],
        count: `${houseCount}+ mẫu decor`,
      },
      {
        ...STORE_CATEGORIES[4],
        count: `${accCount}+ phụ kiện`,
      },
    ];
  } catch (error) {
    console.error('[storeService] Không thể lấy số lượng danh mục từ backend:', error);
    return STORE_CATEGORIES;
  }
}
