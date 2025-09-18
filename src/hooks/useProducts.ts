import { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { getSignedStorageUrl } from '../utils/imageUtils';

export const useProducts = (filters?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
}) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getProducts(filters);
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
    };

    fetchProducts();
  }, [filters?.category, filters?.featured, filters?.search, filters?.limit]);

  return { products, loading, error, refetch: () => fetchProducts() };
};

export const useProduct = (slug: string) => {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productAPI.getProductBySlug(slug);
        const imgPath = data?.product_images?.[0]?.image_url || (data as any).image_url || (data as any).image || null;
        if (imgPath) {
          data.signed_image_url = await getSignedStorageUrl('product-images', imgPath);
        }
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  return { product, loading, error };
};