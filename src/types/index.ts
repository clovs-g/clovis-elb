export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  sizes?: { size: string; price: number }[];
  slug: string;
  ingredients?: string[];
  allergens?: string[];
  dietaryInfo?: string[];
}

export interface GalleryItem {
  id: string;
  image: string;
  title: string;
  category: 'wedding' | 'birthday' | 'slices-cookies' | 'graduation';
  description?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedOptions?: Record<string, string>;
}

export interface OrderDetails {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryInfo: {
    type: 'pickup' | 'delivery';
    address?: string;
    date: string;
    time: string;
    instructions?: string;
  };
  paymentMethod: string;
  orderNumber: string;
}