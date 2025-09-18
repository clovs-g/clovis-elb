import { useState, useEffect, useCallback } from 'react';
import { galleryAPI } from '../services/api';
import { galleryItems } from '../data/gallery';
import { getSignedStorageUrl } from '../utils/imageUtils';

export const useGallery = (category?: string) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await galleryAPI.getGalleryImages(category);
      // Build merged list with static items
      const supabaseImages = await Promise.all(
        (data || []).map(async (img: any) => {
          img.signed_url = await getSignedStorageUrl('gallery-images', img.image_url);
          return img;
        })
      );
      const staticMapped = galleryItems
        .filter((it) => !category || category === 'all' || it.category === category)
        .map((item) => ({
        id: `local-${item.id}`,
        title: item.title,
        category: item.category,
        image_url: item.image,
        signed_url: item.image,
      }));
      const merged = [...staticMapped, ...supabaseImages];
      setImages(merged);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return { images, loading, error, refetch: fetchImages };
};