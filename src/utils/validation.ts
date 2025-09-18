// Validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return errors;
};

export const validateProductData = (product: any): string[] => {
  const errors: string[] = [];

  if (!product.name?.trim()) {
    errors.push('Product name is required');
  }

  if (!product.description?.trim()) {
    errors.push('Product description is required');
  }

  if (!product.base_price || product.base_price <= 0) {
    errors.push('Valid base price is required');
  }

  if (!product.category_id) {
    errors.push('Product category is required');
  }

  if (!product.slug?.trim()) {
    errors.push('Product slug is required');
  } else if (!/^[a-z0-9-]+$/.test(product.slug)) {
    errors.push('Slug can only contain lowercase letters, numbers, and hyphens');
  }

  return errors;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

export const validateImageUpload = (files: FileList): string[] => {
  const errors: string[] = [];
  const maxFiles = 5;
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (files.length > maxFiles) {
    errors.push(`Maximum ${maxFiles} images allowed`);
  }

  Array.from(files).forEach((file, index) => {
    if (!allowedTypes.includes(file.type)) {
      errors.push(`File ${index + 1}: Only JPEG, PNG, and WebP images are allowed`);
    }

    if (file.size > maxSize) {
      errors.push(`File ${index + 1}: Image size must be less than 5MB`);
    }
  });

  return errors;
};