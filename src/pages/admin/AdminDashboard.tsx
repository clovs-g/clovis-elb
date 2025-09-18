import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle,
  Mail,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useDashboardStats } from '../../hooks/useAnalytics';
import { orderAPI } from '../../services/api';

const AdminDashboard = () => {
  const { state } = useAdminAuth();
  const user = state.user;
  const { stats, loading: statsLoading } = useDashboardStats();

  const statCards = stats ? [
    {
      name: 'Today Revenue',
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Orders Today',
      value: stats.todayOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      name: 'New Messages',
      value: stats.newMessages.toString(),
      icon: Mail,
      color: 'bg-amber-500',
    },
    {
      name: 'Unresolved Messages',
      value: stats.unresolvedMessages.toString(),
      icon: AlertTriangle,
      color: 'bg-red-500',
    },
  ] : [];

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'EB001234',
      customer: 'Sarah Johnson',
      items: 'Wedding Cake, Cupcakes x12',
      total: '$245.00',
      status: 'pending',
      time: '2 hours ago',
    },
    {
      id: 'EB001235',
      customer: 'Mike Davis',
      items: 'Birthday Cake, Cookies x24',
      total: '$89.50',
      status: 'completed',
      time: '4 hours ago',
    },
    {
      id: 'EB001236',
      customer: 'Emily Chen',
      items: 'Croissants x6, Coffee Cake',
      total: '$32.75',
      status: 'in-progress',
      time: '6 hours ago',
    },
  ]);

  const lowStockItems = [
    { name: 'Chocolate Chip Cookies', stock: 5, threshold: 20 },
    { name: 'Vanilla Cupcakes', stock: 8, threshold: 25 },
    { name: 'Sourdough Bread', stock: 3, threshold: 15 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* User Info Display */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Admin Info</h2>
        <p><strong>Name:</strong> {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {(user as any)?.role ?? user?.user_metadata?.role}</p>
      </div>
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
        <p className="text-amber-100">
          Here's what's happening at  Elbaker our Bakery today.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                View all
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-900">
                        Order #{order.id}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.items}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-gray-900">{order.total}</span>
                      <span className="text-xs text-gray-500">{order.time}</span>
                    </div>
                  </div>
                  {/* Delete button */}
                  <button
                    onClick={async () => {
                      if (confirm('Delete this order?')) {
                        try {
                          // Attempt deletion only if ID looks like a UUID (real order)
                          if (/^[0-9a-fA-F-]{36}$/.test(order.id)) {
                            await orderAPI.deleteOrder(order.id);
                          }
                          setRecentOrders((prev) => prev.filter((o) => o.id !== order.id));
                        } catch (err) {
                          console.error(err);
                          alert('Failed to delete order');
                        }
                      }
                    }}
                    className="text-red-600 hover:text-red-800 inline-flex items-center ml-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-600">
                      Current stock: {item.stock} (Threshold: {item.threshold})
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-red-600">
                      {item.stock} left
                    </span>
                    <button className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700">
                      Reorder
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/products/add"
            className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors"
          >
            <div className="text-center">
              <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Add Product</span>
            </div>
          </Link>
          <Link to="/admin/orders" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <div className="text-center">
              <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">View Orders</span>
            </div>
          </Link>
          <Link to="/admin/customers" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <div className="text-center">
              <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">Manage Customers</span>
            </div>
          </Link>
          <Link to="/admin/analytics" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-amber-500 hover:bg-amber-50 transition-colors">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600">View Analytics</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;