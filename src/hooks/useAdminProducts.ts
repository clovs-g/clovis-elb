import { useState, useEffect, useCallback } from 'react';
import { productAPI } from '../services/api';
import { getSignedStorageUrl } from '../utils/imageUtils';

export interface UseAdminProductsFilters {
  category?: string;
  status?: string;
  search?: string;
}

export const useAdminProducts = (filters?: UseAdminProductsFilters) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productAPI.getAllProducts({
        category: filters?.category,
        status: filters?.status,
        search: filters?.search,
        limit: 100,
      });
      // create signed URLs for primary image
      const mapped = await Promise.all(
        (data || []).map(async (p: any) => {
          const imgPath = p.product_images?.[0]?.image_url || (p as any).image_url || (p as any).image || null;
          if (imgPath) {
            p.signed_image_url = await getSignedStorageUrl('product-images', imgPath);
          }
          return p;
        })
      );
      setProducts(mapped);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters?.category, filters?.status, filters?.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}; 