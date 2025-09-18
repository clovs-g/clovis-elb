import { useState, useEffect, useCallback } from 'react';
import { galleryAPI } from '../services/api';
import { getSignedStorageUrl } from '../utils/imageUtils';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { galleryItems } from '../data/gallery';

export interface GalleryImage {
  id: string;
  image_url: string;
  title?: string;
  category?: string;
  signed_url?: string;
}

export const useAdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const data = await galleryAPI.getGalleryImages();
      const mapped = await Promise.all(
        (data || []).map(async (img: any) => {
          img.signed_url = await getSignedStorageUrl('gallery-images', img.image_url);
          return img;
        })
      );

      // Map static gallery items used in the public frontend so they also appear in the admin gallery.
      const staticMapped: GalleryImage[] = galleryItems.map((item) => ({
        id: `local-${item.id}`,
        image_url: item.image,
        title: item.title,
        category: item.category,
        signed_url: item.image, // For local assets we can use the raw path directly
      }));

      // Combine local/static images with those stored in Supabase.
      setImages([...staticMapped, ...mapped]);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  /* Upload new image */
  const uploadImage = async (file: File, category: string = 'custom') => {
    const filePath = `${Date.now()}_${file.name}`;
    const client = supabaseAdmin ?? supabase;
    const { error } = await client.storage.from('gallery-images').upload(filePath, file);
    if (error) throw error;
    // insert row
    // Derive a default title from the filename (without the extension) to satisfy the NOT NULL constraint.
    const defaultTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').trim();
    const { error: insertErr } = await client.from('gallery_images').insert({
      image_url: filePath,
      title: defaultTitle || file.name,
      category,
    });
    if (insertErr) throw insertErr;
    await fetchImages();
  };

  const deleteImage = async (id: string, path: string) => {
    const client = supabaseAdmin ?? supabase;
    await client.from('gallery_images').delete().eq('id', id);
    await client.storage.from('gallery-images').remove([path]);
    await fetchImages();
  };

  return { images, loading, error, uploadImage, deleteImage, refetch: fetchImages };
}; 