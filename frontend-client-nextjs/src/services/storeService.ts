import { Product, Pet, StoreItem, Category, CategorySlug, PaginatedResult, PetType } from '../types';
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
  petType?: string;
}

/**
 * Fetch products and/or pets with server-side offset-based pagination and SQL filters.
 * Fully queries PostgreSQL database via API Gateway.
 */
export async function fetchStoreProductsPaginated(params: StorePaginationParams): Promise<PaginatedResult<StoreItem>> {
  const {
    categorySlug = 'all',
    page = 0,
    size = 8,
    keyword,
    priceRangeId,
    inStockOnly,
    petType,
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
    // 1. Pet Category: Queries /public/pets/filter
    if (categorySlug === 'thu-cung') {
      const isFilteringType = Boolean(petType && petType !== 'all');

      const petPage = await petService.getPetsWithFilters({
        minPrice,
        maxPrice,
        status: inStockOnly ? 'AVAILABLE' : undefined,
        keyword: cleanKeyword,
        page: isFilteringType ? 0 : page,
        size: isFilteringType ? 50 : size,
        sortBy,
        sortDirection,
      });

      let items = (petPage.content || []).map(mapBackendPetToProduct);

      if (isFilteringType) {
        const lowerType = (petType || '').trim().toLowerCase();
        items = items.filter((p) => {
          // 1. Direct match by petTypeId (UUID)
          if (p.petTypeId && p.petTypeId.toLowerCase() === lowerType) {
            return true;
          }
          // 2. Direct match by petTypeName (e.g. "Chó", "Mèo", "Chim", "Cá", "Hamster")
          const typeName = (p.petTypeName || '').toLowerCase();
          if (typeName && (typeName === lowerType || typeName.includes(lowerType) || lowerType.includes(typeName))) {
            return true;
          }
          // 3. Fallback compatibility with legacy slugs like 'cho' or 'meo'
          const breed = (p.breedName || '').toLowerCase();
          const name = p.name.toLowerCase();
          if (lowerType === 'cho') {
            return typeName.includes('chó') || breed.includes('chó') || name.startsWith('chó');
          }
          if (lowerType === 'meo') {
            return typeName.includes('mèo') || breed.includes('mèo') || name.startsWith('mèo');
          }
          return breed.includes(lowerType) || name.includes(lowerType);
        });

        const totalFiltered = items.length;
        const startIndex = page * size;
        const paginatedItems = items.slice(startIndex, startIndex + size);

        return {
          items: paginatedItems,
          totalElements: totalFiltered,
          totalPages: Math.ceil(totalFiltered / size) || 1,
          page,
          size,
        };
      }

      return {
        items,
        totalElements: petPage.totalElements ?? 0,
        totalPages: petPage.totalPages ?? 1,
        page: petPage.number ?? page,
        size: petPage.size ?? size,
      };
    }

    // 2. "All" Category: Queries BOTH pets and merchandise products
    if (categorySlug === 'all') {
      const [petPage, prodPage] = await Promise.all([
        petService
          .getPetsWithFilters({
            minPrice,
            maxPrice,
            status: inStockOnly ? 'AVAILABLE' : undefined,
            keyword: undefined, // Fetch all pets within price/stock range so we can match by breed & type name
            page: 0,
            size: 50,
            sortBy: sortBy === 'avgRating' ? 'viewCount' : sortBy,
            sortDirection,
          })
          .catch((err) => {
            console.warn('[storeService] Failed to load pets for "all" category:', err);
            return { content: [], totalElements: 0, totalPages: 0, size: 50, number: 0 };
          }),
        productService
          .getProductsWithFilters({
            minPrice,
            maxPrice,
            status: inStockOnly ? 'AVAILABLE' : undefined,
            keyword: cleanKeyword,
            page: 0,
            size: 50,
            sortBy: sortBy === 'viewCount' ? 'avgRating' : sortBy,
            sortDirection,
          })
          .catch((err) => {
            console.warn('[storeService] Failed to load products for "all" category:', err);
            return { content: [], totalElements: 0, totalPages: 0, size: 50, number: 0 };
          }),
      ]);

      let petItems = (petPage.content || []).map(mapBackendPetToProduct);
      if (cleanKeyword) {
        const kw = cleanKeyword.toLowerCase();
        petItems = petItems.filter(
          (p) =>
            p.name.toLowerCase().includes(kw) ||
            (p.petName || '').toLowerCase().includes(kw) ||
            (p.breedName || '').toLowerCase().includes(kw) ||
            (p.petTypeName || '').toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw)
        );
      }
      const prodItems = (prodPage.content || []).map(mapBackendProductToProduct);

      let allItems: StoreItem[] = [];

      if (params.sortBy === 'price-asc') {
        allItems = [...petItems, ...prodItems].sort((a, b) => a.price - b.price);
      } else if (params.sortBy === 'price-desc') {
        allItems = [...petItems, ...prodItems].sort((a, b) => b.price - a.price);
      } else if (params.sortBy === 'rating') {
        allItems = [...petItems, ...prodItems].sort((a, b) => b.rating - a.rating);
      } else {
        // Default: Interleave pets and merchandise products so page 1 displays a diverse mix of both
        const maxLen = Math.max(petItems.length, prodItems.length);
        for (let i = 0; i < maxLen; i++) {
          if (i < petItems.length) allItems.push(petItems[i]);
          if (i < prodItems.length) allItems.push(prodItems[i]);
        }
      }

      const totalFiltered = allItems.length;
      const startIndex = page * size;
      const paginatedItems = allItems.slice(startIndex, startIndex + size);

      return {
        items: paginatedItems,
        totalElements: totalFiltered,
        totalPages: Math.ceil(totalFiltered / size) || 1,
        page,
        size,
      };
    }

    // 3. Merchandise Categories: Query /public/products/filter
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
    console.error('[storeService] Failed to fetch paginated data from API Gateway:', error);
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
export async function fetchStoreProducts(categorySlug?: string | null): Promise<StoreItem[]> {
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
    console.error('[storeService] Failed to fetch category counts from backend:', error);
    return STORE_CATEGORIES;
  }
}

/**
 * Fetch dynamic active pet types from backend with fallback
 */
export async function fetchStorePetTypes(): Promise<PetType[]> {
  try {
    const types = await petService.getActivePetTypes();
    if (types && types.length > 0) {
      return types.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    }
  } catch (error) {
    console.warn('[storeService] Failed to fetch pet types from backend, using default fallback:', error);
  }

  // Fallback to active pet types from DB
  return [
    { id: '04a6180f-2e90-45eb-a841-4e23d5613046', name: 'Chó', displayOrder: 1 },
    { id: '92052781-7a60-49d5-a079-6855295b5c21', name: 'Mèo', displayOrder: 2 },
    { id: 'f483ca59-5c35-445a-a5e6-38dfd6d48f89', name: 'Chim', displayOrder: 3 },
    { id: '60ae1eee-fcb0-4335-a1a9-fbdc041da1a0', name: 'Cá', displayOrder: 4 },
    { id: 'a0d9673c-eb11-4ca6-80eb-82f7c6084072', name: 'Hamster', displayOrder: 5 },
  ];
}

/**
 * Fetch top products sorted by sold count (sold_count DESC)
 */
export async function fetchTopSellingProducts(limit = 10): Promise<Product[]> {
  try {
    return await productService.getTopSellingProducts(limit);
  } catch (error) {
    console.error('[storeService] Failed to fetch top selling products:', error);
    return [];
  }
}


