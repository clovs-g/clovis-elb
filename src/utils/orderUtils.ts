// Utility functions for order management

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `EB${timestamp}${random}`;
};

export const calculateOrderTotals = (items: any[], deliveryType: 'pickup' | 'delivery' = 'pickup') => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8% tax
  const taxAmount = subtotal * taxRate;
  const deliveryFee = deliveryType === 'delivery' ? 5.99 : 0;
  const total = subtotal + taxAmount + deliveryFee;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    taxAmount: Number(taxAmount.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    total: Number(total.toFixed(2)),
  };
};

export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    ready: 'Ready',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };

  return statusMap[status] || status;
};

export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-purple-100 text-purple-800',
    out_for_delivery: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return colorMap[status] || 'bg-gray-100 text-gray-800';
};

export const validateOrderData = (orderData: any): string[] => {
  const errors: string[] = [];

  if (!orderData.customer_name?.trim()) {
    errors.push('Customer name is required');
  }

  if (!orderData.customer_email?.trim()) {
    errors.push('Customer email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(orderData.customer_email)) {
    errors.push('Invalid email format');
  }

  if (!orderData.customer_phone?.trim()) {
    errors.push('Customer phone is required');
  }

  if (!orderData.delivery_date) {
    errors.push('Delivery/pickup date is required');
  }

  if (!orderData.delivery_time) {
    errors.push('Delivery/pickup time is required');
  }

  if (orderData.delivery_type === 'delivery') {
    if (!orderData.delivery_address?.address) {
      errors.push('Delivery address is required');
    }
    if (!orderData.delivery_address?.city) {
      errors.push('City is required');
    }
    if (!orderData.delivery_address?.zipCode) {
      errors.push('ZIP code is required');
    }
  }

  return errors;
};