import { fetchStoreProductsPaginated, fetchStoreCategories } from '@/services/storeService';
import { CategoryClientView } from '@/components/category/CategoryClientView';


export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    page?: string;
    q?: string;
    price?: string;
    sort?: string;
    stock?: string;
  }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentSlug = slug || 'all';
  const page = Math.max(1, Number(sp.page ?? '1') || 1);

  // Fetch paginated products and categories directly on the server
  const [paginatedData, categoriesList] = await Promise.all([
    fetchStoreProductsPaginated({
      categorySlug: currentSlug,
      page: page - 1, // 0-based for backend
      size: 8,
      keyword: sp.q,
      priceRangeId: sp.price,
      sortBy: sp.sort,
      inStockOnly: sp.stock === 'true',
    }),
    fetchStoreCategories(),
  ]);

  return (
    <CategoryClientView
      currentSlug={currentSlug}
      categoriesList={categoriesList}
      paginatedData={paginatedData}
      currentPage={page}
      currentSearch={sp.q || ''}
      currentPriceRange={sp.price || 'all'}
      currentSort={sp.sort || 'default'}
      currentInStock={sp.stock === 'true'}
    />
  );
}
