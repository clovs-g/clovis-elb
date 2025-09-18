// Utility functions for image handling

import { supabase, supabaseAdmin } from '../lib/supabase';

export const validateImageFile = (file: File): string[] => {
  const errors: string[] = [];
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    errors.push('Only JPEG, PNG, and WebP images are allowed');
  }

  if (file.size > maxSize) {
    errors.push('Image size must be less than 5MB');
  }

  return errors;
};

export const resizeImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const generateImageUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  // This is a placeholder for Cloudinary upload
  // In production, you would implement actual Cloudinary upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error('Failed to upload image');
  }
};

// Generate a signed URL for a file stored in a private bucket (1-hour expiry by default)
export const getSignedStorageUrl = async (
  bucket: string,
  path: string,
  expirySeconds: number = 3600,
): Promise<string | null> => {
  if (!path) return null;

  // 0) If the path already appears to be an absolute HTTP(S) URL that doesn't belong to Supabase storage,
  // simply return it as-is (after encoding). This covers cases where images are hosted on a CDN like
  // Cloudinary or when the `image_url` column already stores a fully-qualified public URL.
  if (path.startsWith('http')) {
    try {
      const url = new URL(path);
      // Detect whether the host belongs to Supabase storage or not. If it's NOT Supabase, we don't
      // need to sign it – just return the original URL so the <img> tag can load it directly.
      if (!url.hostname.includes('.supabase.co')) {
        return path;
      }
      // If it *is* a Supabase URL we'll fall through to the signed-url logic below which will trim
      // the bucket prefix and create a temporary signed URL.
    } catch {
      // Malformed URL? Just return it as-is – better to attempt to load than to break.
      return encodeURI(path);
    }
  }

  // 1) If the path is already a site-relative path (e.g. "/images/cakes/cake.jpg") we can also
  // return it as-is because the asset is expected to be served by the web server rather than
  // Supabase Storage. This prevents us from incorrectly attempting to generate a signed URL.
  if (path.startsWith('/')) {
    return encodeURI(path);
  }

  // 2) Prepare the object path for Supabase Storage. Remove any leading slashes and a possible
  // bucket prefix (e.g. "product-images/...") so that we pass *only* the internal object key to
  // createSignedUrl().
  let objectPath = path.replace(/^\//, ''); // trim leading slash if present
  if (objectPath.startsWith(`${bucket}/`)) {
    objectPath = objectPath.substring(bucket.length + 1);
  }

  try {
    // If a full URL was stored, extract the path segment after the bucket name.
    // (We re-assign objectPath inside this block if we detect a Supabase URL.)
    // Note: This only triggers for absolute URLs; for relative strings we've already handled above.
    if (path.startsWith('http')) {
      try {
        const url = new URL(path);
        const idx = url.pathname.indexOf(`/${bucket}/`);
        if (idx !== -1) {
          objectPath = url.pathname.substring(idx + bucket.length + 2); // skip "/bucket/"
        }
      } catch {}
    }

    const client = supabaseAdmin ?? supabase;

    // If we only have the anon client (supabaseAdmin is null) **and** the bucket is public, skip
    // the expensive signed-URL call and directly return the public URL.
    if (!supabaseAdmin) {
      const { data: pub } = client.storage.from(bucket).getPublicUrl(objectPath);
      return pub.publicUrl ?? null;
    }

    const { data, error } = await client.storage
      .from(bucket)
      .createSignedUrl(objectPath, expirySeconds);

    if (error) {
      console.warn('Signed-url generation failed, attempting publicUrl fallback →', error.message);
      const publicRes = await client.storage.from(bucket).getPublicUrl(objectPath);
      return publicRes?.data?.publicUrl ?? null;
    }

    return data?.signedUrl ?? null;
  } catch (err) {
    console.error('Signed-url error', err);
    return null;
  }
};