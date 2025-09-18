import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, MapPin, Clock, User, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import HeroSection from '../components/HeroSection';
import { orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import type { Database } from '../lib/supabase';

const Checkout = () => {
  const { state, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { state: authState } = useAuth();
  
  const [deliveryType, setDeliveryType] = useState<'pickup' | 'delivery'>('pickup');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '',
    city: '',
    zipCode: '',
    date: '',
    time: '',
    instructions: '',
  });

  const [mobilePayment, setMobilePayment] = useState<{
    provider: 'MTN' | 'AIRTEL';
    phone: string;
  }>({ provider: 'MTN', phone: '' });

  const subtotal = getCartTotal();
  const tax = subtotal * 0.08;
  const deliveryFee = deliveryType === 'delivery' ? 5.99 : 0;
  const total = subtotal + tax + deliveryFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate an order number (simple timestamp-based approach)
      const orderNumber = `EB${Date.now().toString().slice(-6)}`;

      // Build the order payload that matches the Supabase schema
      const orderPayload: Database['public']['Tables']['orders']['Insert'] = {
        order_number: orderNumber,
        user_id: authState.user?.id ?? null,
        delivery_type: deliveryType,
        subtotal,
        tax_amount: tax,
        delivery_fee: deliveryFee,
        total_amount: total,
        currency: 'USD',
        payment_status: 'pending',
        payment_method: `${mobilePayment.provider}_mobile_money`,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
        customer_phone: customerInfo.phone,
        delivery_address:
          deliveryType === 'delivery'
            ? JSON.stringify({
                address: deliveryInfo.address,
                city: deliveryInfo.city,
                zipCode: deliveryInfo.zipCode,
              })
            : null,
        delivery_date: deliveryInfo.date,
        delivery_time: deliveryInfo.time,
        special_instructions: deliveryInfo.instructions || null,
      };

      // Persist order and the associated items in Supabase
      const itemsSnapshot = [...state.items];
      await orderAPI.createOrder(orderPayload, itemsSnapshot);

      // Clear the cart and navigate to confirmation page
      clearCart();
      navigate('/order-confirmation', {
        state: {
          orderNumber,
          customerInfo,
          deliveryInfo: { ...deliveryInfo, type: deliveryType },
          total,
          items: itemsSnapshot,
        },
      });
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Sorry, something went wrong while processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (state.items.length === 0 && location.pathname !== '/cart') {
    navigate('/cart');
    return null;
  }

  return (
    <div>
      <HeroSection
        title="Checkout"
        subtitle="Complete your order"
      />

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Form */}
              <div className="lg:col-span-2 space-y-8">
                {/* Customer Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <User className="h-5 w-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="(123) 456-7890"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <MapPin className="h-5 w-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Options</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        deliveryType === 'pickup'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-semibold">Pickup</div>
                      <div className="text-sm text-gray-600">Free - Pick up at our bakery</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        deliveryType === 'delivery'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      <div className="font-semibold">Delivery</div>
                      <div className="text-sm text-gray-600">$5.99 - Delivered to your door</div>
                    </button>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Delivery Address *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryInfo.address}
                          onChange={(e) => setDeliveryInfo(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          placeholder="123 Main Street"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            value={deliveryInfo.city}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="Sweet City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP Code *
                          </label>
                          <input
                            type="text"
                            required
                            value={deliveryInfo.zipCode}
                            onChange={(e) => setDeliveryInfo(prev => ({ ...prev, zipCode: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            placeholder="12345"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={deliveryInfo.date}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Time *
                      </label>
                      <select
                        required
                        value={deliveryInfo.time}
                        onChange={(e) => setDeliveryInfo(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="">Select time</option>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="11:00 AM">11:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="1:00 PM">1:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:00 PM">3:00 PM</option>
                        <option value="4:00 PM">4:00 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={deliveryInfo.instructions}
                      onChange={(e) => setDeliveryInfo(prev => ({ ...prev, instructions: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      placeholder="Any special requests or delivery instructions..."
                    />
                  </div>
                </div>

                {/* Payment Information - Mobile Money */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-2 mb-6">
                    <Smartphone className="h-5 w-5 text-amber-600" />
                    <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
                  </div>

                  <div className="space-y-6">
                    {/* Provider selection */}
                    <div className="flex gap-4">
                      {(['MTN', 'AIRTEL'] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setMobilePayment(prev => ({ ...prev, provider: p }))}
                          className={`flex-1 p-4 border rounded-lg transition-colors ${
                            mobilePayment.provider === p ? 'border-amber-500 bg-amber-50' : 'border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          {p} Mobile Money
                        </button>
                      ))}
                    </div>

                    {/* Phone number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mobile Money Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={mobilePayment.phone}
                        onChange={(e) => setMobilePayment(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        placeholder="07XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
                  
                  <div className="space-y-4 mb-6">
                    {state.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          {item.selectedSize && (
                            <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                          )}
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (8%)</span>
                      <span className="font-semibold">${tax.toFixed(2)}</span>
                    </div>
                    {deliveryType === 'delivery' && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-lg font-bold text-amber-600">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-4 px-6 rounded-lg transition-colors mt-6 flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500">
                    <Lock className="h-4 w-4 inline mr-1" />
                    Your payment information is secure and encrypted
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Checkout;