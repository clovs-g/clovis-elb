import { supabase, supabaseAdmin } from '../lib/supabase';
import { getSignedStorageUrl } from '../utils/imageUtils';
import type { Database } from '../lib/supabase';

type Tables = Database['public']['Tables'];

// Product API
export const productAPI = {
  // Get all products with optional filters
  async getProducts(filters?: {
    category?: string;
    status?: string;
    featured?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
  // Use supabaseAdmin for admin queries to ensure access to private buckets and bypass RLS
  const client = supabaseAdmin ?? supabase;
  let query = client
      .from('products')
      .select(`
        *,
        categories (name, slug),
        product_images (id, image_url, alt_text, is_primary, display_order),
        product_sizes (id, size_name, price_adjustment, display_order),
        inventory (quantity, low_stock_threshold)
      `)
      .eq('status', 'active')
      .order('display_order', { ascending: true });

    if (filters?.category) {
      query = query.eq('categories.slug', filters.category);
    }

    if (filters?.featured !== undefined) {
      query = query.eq('is_featured', filters.featured);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Get single product by slug
  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        product_images (id, image_url, alt_text, is_primary, display_order),
        product_sizes (id, size_name, price_adjustment, display_order),
        inventory (quantity, low_stock_threshold)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Get all products (including inactive)
  async getAllProducts(filters?: {
    category?: string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories (name, slug),
        product_images (id, image_url, alt_text, is_primary, display_order),
        product_sizes (id, size_name, price_adjustment, display_order),
        inventory (quantity, low_stock_threshold)
      `)
      .order('created_at', { ascending: false });

    if (filters?.category) {
      query = query.eq('categories.slug', filters.category);
    }

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Admin: Create product
  async createProduct(product: Tables['products']['Insert']) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update product
  async updateProduct(id: string, updates: Tables['products']['Update']) {
    const { data, error } = await supabase
      .from('products')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Delete product
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Category API
export const categoryAPI = {
  // Get all active categories
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Admin: Get all categories
  async getAllCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data;
  },

  // Admin: Create category
  async createCategory(category: Tables['categories']['Insert']) {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Admin: Update category
  async updateCategory(id: string, updates: Tables['categories']['Update']) {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Order API
export const orderAPI = {
  // Create new order
  async createOrder(order: Tables['orders']['Insert'], items: any[]) {
    // Start transaction
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: orderData.id,
      // Only include product_id if the value appears to be a valid UUID; otherwise leave null
      product_id:
        typeof item.productId === 'string' && /[0-9a-fA-F-]{36}/.test(item.productId)
          ? item.productId
          : null,
      product_name: item.name,
      product_sku: item.sku || null,
      size_name: item.selectedSize || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderData;
  },

  // Get order by ID with items & product info in a single query.
  async getOrder(id: string) {
    const client = supabaseAdmin ?? supabase;

    // Try full nested query first
    let { data, error } = await client
      .from('orders')
      .select(`*,
        order_items (*,
          products (id, name, slug, product_images (image_url, is_primary, display_order))
        )
      `)
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST200') { // invalid relationship or similar
      console.warn('Nested join failed, falling back to order_items without products', error);
      const fallback = await client
        .from('orders')
        .select(`*, order_items (*)`)
        .eq('id', id)
        .single();
      if (fallback.error) {
        console.error('Fallback getOrder error', fallback.error);
        throw fallback.error;
      }
      return fallback.data as any;
    }

    if (error) {
      console.error('getOrder error', error);
      throw error;
    }

    // Generate signed URLs for product images so the admin panel can display them
    if (data && (data as any).order_items) {
      const promises: Promise<void>[] = [];
      (data as any).order_items.forEach((item: any) => {
        const product = item.products;
        if (product && product.product_images && product.product_images.length > 0) {
          const primaryImg = product.product_images.find((img: any) => img.is_primary) || product.product_images[0];
          if (primaryImg?.image_url) {
            promises.push(
              getSignedStorageUrl('product-images', primaryImg.image_url).then((url) => {
                product.signed_image_url = url;
              })
            );
          }
        }
      });
      await Promise.all(promises);
    }

    return data as any;
  },

  // Admin: delete order (cascades to order_items)
  async deleteOrder(id: string) {
    const client = supabaseAdmin ?? supabase;
    const { error } = await client
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  // Get orders by user
  async getUserOrders(userId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, slug)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Admin: Get all orders
  async getAllOrders(filters?: {
    status?: string;
    delivery_type?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
  }) {
    const client = supabaseAdmin ?? supabase;

    let query = client
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (name, slug)
        )
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.delivery_type) {
      query = query.eq('delivery_type', filters.delivery_type);
    }

    if (filters?.date_from) {
      query = query.gte('created_at', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('created_at', filters.date_to);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Admin: Update order status
  async updateOrderStatus(id: string, status: string, notes?: string) {
    const updates: any = { 
      status, 
      updated_at: new Date().toISOString() 
    };
    
    if (notes) {
      updates.notes = notes;
    }

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Gallery API
export const galleryAPI = {
  // Get gallery images
  async getGalleryImages(category?: string) {
    let query = supabase
      .from('gallery_images')
      .select('*')
      .order('display_order', { ascending: true });

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Admin: Create gallery image
  // async createGalleryImage(image: any) {
  //   // Implementation needed: Add gallery_images to Database type in supabase.ts
  // },
  // async updateGalleryImage(id: string, updates: any) {
  //   // Implementation needed: Add gallery_images to Database type in supabase.ts
  // },

  // Admin: Delete gallery image
  async deleteGalleryImage(id: string) {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Analytics API
export const analyticsAPI = {
  // Get dashboard stats
  async getDashboardStats() {
    // Build start-of-day ISO for today and start-of-month ISO so PostgREST receives full timestamp strings
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const client = supabaseAdmin ?? supabase;

    // Get today's orders
    const { data: todayOrders, error: todayError } = await client
      .from('orders')
      .select('total_amount')
      .gte('created_at', todayStart);

    if (todayError) throw todayError;

    // Get this month's orders
    const { data: monthOrders, error: monthError } = await client
      .from('orders')
      .select('total_amount')
      .gte('created_at', monthStart);

    if (monthError) throw monthError;

    // Get total products
    const { count: totalProducts, error: productsError } = await client
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (productsError) throw productsError;

    // Get pending orders
    const { count: pendingOrders, error: pendingError } = await client
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) throw pendingError;

    // Supabase REST doesn't allow column-to-column comparison; fetch and filter client-side.
    const { data: allInventory, error: stockError } = await client
      .from('inventory')
      .select(`
        *,
        products (name)
      `);
    if (stockError) throw stockError;

    const lowStockItems = (allInventory || []).filter((i: any) =>
      typeof i.quantity === 'number' && typeof i.low_stock_threshold === 'number' && i.quantity < i.low_stock_threshold
    );

    /* Message stats */
    const { count: newMessages } = await client
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new');

    const { count: unresolvedMessages } = await client
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'resolved');

    // Average response time (difference between first reply and message created_at)
    let avgResponseTimeHours: number | null = null;
    const { data: firstReplies, error: firstRepliesErr } = await client
      .from('message_replies')
      .select('message_id, sent_at');
    if (!firstRepliesErr && firstReplies && firstReplies.length > 0) {
      // Build map of earliest reply per message
      const firstMap: Record<string, string> = {};
      firstReplies.forEach((r: any) => {
        if (!firstMap[r.message_id] || new Date(r.sent_at) < new Date(firstMap[r.message_id])) {
          firstMap[r.message_id] = r.sent_at;
        }
      });
      // Fetch messages corresponding
      const msgIds = Object.keys(firstMap);
      if (msgIds.length > 0) {
        const { data: msgs } = await client
          .from('messages')
          .select('id, created_at')
          .in('id', msgIds);
        if (msgs) {
          const totalHours = msgs.reduce((sum: number, m: any) => {
            const replyTime = new Date(firstMap[m.id]).getTime();
            const msgTime = new Date(m.created_at).getTime();
            return sum + (replyTime - msgTime) / (1000 * 60 * 60);
          }, 0);
          avgResponseTimeHours = totalHours / msgs.length;
        }
      }
    }

    return {
      todayRevenue: todayOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
      todayOrders: todayOrders?.length || 0,
      monthRevenue: monthOrders?.reduce((sum, order) => sum + order.total_amount, 0) || 0,
      monthOrders: monthOrders?.length || 0,
      totalProducts: totalProducts || 0,
      pendingOrders: pendingOrders || 0,
      lowStockItems: lowStockItems || [],
      newMessages: newMessages || 0,
      unresolvedMessages: unresolvedMessages || 0,
      avgResponseTimeHours,
    };
  },

  // Get sales analytics
  async getSalesAnalytics(period: 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const client = supabaseAdmin ?? supabase;

    const { data, error } = await client
      .from('orders')
      .select('created_at, total_amount, status')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },
};

// Authentication API
export const authAPI = {
  // Admin login
  async adminLogin(email: string, _password: string) {
    // This is a simplified version - in production, you'd want proper password hashing
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new Error('Invalid credentials');
    }

    // In production, verify password hash here
    // For demo purposes, we'll accept any password for admin@elbaker.com
    if (email === 'admin@elbaker.com') {
      return {
        user: {
          id: data.id,
          email: data.email,
          firstName: data.first_name,
          lastName: data.last_name,
          role: data.role,
        },
        token: 'mock-jwt-token-' + Date.now(),
      };
    }

    throw new Error('Invalid credentials');
  },

  // Customer registration
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // Customer login
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Logout
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};

// Cart API (for persistent carts)
export const cartAPI = {
  // Get cart items
  async getCartItems(userId?: string, sessionId?: string) {
    let query = supabase
      .from('cart_items')
      .select(`
        *,
        products (
          id,
          name,
          slug,
          base_price,
          product_images (image_url, is_primary)
        )
      `);

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId).is('user_id', null);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add item to cart
  async addToCart(item: {
    userId?: string;
    sessionId?: string;
    productId: string;
    sizeName?: string;
    quantity: number;
  }) {
    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: item.userId || null,
        session_id: item.sessionId || null,
        product_id: item.productId,
        size_name: item.sizeName || null,
        quantity: item.quantity,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update cart item quantity
  async updateCartItem(id: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ 
        quantity, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Remove item from cart
  async removeFromCart(id: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Clear cart
  async clearCart(userId?: string, sessionId?: string) {
    let query = supabase.from('cart_items').delete();

    if (userId) {
      query = query.eq('user_id', userId);
    } else if (sessionId) {
      query = query.eq('session_id', sessionId).is('user_id', null);
    }

    const { error } = await query;
    if (error) throw error;
  },
};