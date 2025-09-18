import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { ArrowLeft, Trash2 } from 'lucide-react';

const AdminOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const data = await orderAPI.getOrder(id);
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-red-600 text-center">{error}</div>;
  }

  if (!order) return null;

  return (
    <div className="p-6 space-y-6">
      <button as={Link as any} to="/admin/orders" className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 mb-4">
        <ArrowLeft className="h-5 w-5" /> <span>Back to Orders</span>
      </button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
        <button
          onClick={async () => {
            if (confirm('Delete this order?')) {
              await orderAPI.deleteOrder(order.id);
              window.location.href = '/admin/orders';
            }
          }}
          className="inline-flex items-center space-x-1 text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-5 w-5" />
          <span>Delete</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order info */}
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Customer</h2>
          <p>{order.customer_name}</p>
          <p>{order.customer_email}</p>
          <p>{order.customer_phone}</p>
          <h2 className="text-lg font-semibold text-gray-900 mt-4">Totals</h2>
          <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
          <p>Tax: ${order.tax_amount.toFixed(2)}</p>
          <p>Delivery: ${order.delivery_fee.toFixed(2)}</p>
          <p className="font-bold">Total: ${order.total_amount.toFixed(2)}</p>
        </div>
        {/* Items */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="divide-y divide-gray-200">
            {(order.order_items ?? []).map((item: any) => (
              <div key={item.id} className="py-4 flex justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      item.products?.signed_image_url ||
                      item.products?.product_images?.find((img:any)=>img.is_primary)?.image_url ||
                      item.products?.product_images?.[0]?.image_url ||
                      item.products?.image ||
                      'https://via.placeholder.com/100'
                    }
                    alt={item.product_name}
                    className="w-24 h-24 rounded object-cover"
                  />
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    {item.size_name && <p className="text-sm text-gray-500">Size: {item.size_name}</p>}
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p>${item.unit_price.toFixed(2)}</p>
                  <p className="font-semibold">${item.total_price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail; 