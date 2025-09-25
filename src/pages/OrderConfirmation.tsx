import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Mail, MapPin, Clock } from 'lucide-react';
import HeroSection from '../components/HeroSection';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderData = location.state;

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link to="/" className="text-amber-600 hover:text-amber-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const { orderNumber, customerInfo, deliveryInfo, total, items } = orderData;

  return (
    <div>
      <HeroSection
        title="Order Confirmed!"
        subtitle="Thank you for your order"
      />

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Success Message */}
          <div className="text-center mb-12">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Successfully Placed!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              We've received your order and will begin preparing your delicious treats right away.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 inline-block">
              <p className="text-amber-800 font-semibold">
                Order Number: <span className="text-2xl">{orderNumber}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Details</h2>
              
              <div className="space-y-4">
                {items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      {item.selectedSize && (
                        <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-amber-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Name:</strong> {customerInfo.name}
                  </p>
                  <p className="text-gray-600">
                    <strong>Email:</strong> {customerInfo.email}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> {customerInfo.phone}
                  </p>
                </div>
              </div>

              {/* Delivery Information */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {deliveryInfo.type === 'pickup' ? 'Pickup' : 'Delivery'} Information
                </h3>
                <div className="space-y-3">
                  {deliveryInfo.type === 'pickup' ? (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Elbaker our Bakery</p>
                        <p className="text-gray-600">Makindye Mubaraka</p>
                        <p className="text-gray-600">Ug Kampala</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="font-medium">Delivery Address</p>
                        <p className="text-gray-600">{deliveryInfo.address}</p>
                        <p className="text-gray-600">{deliveryInfo.city}, {deliveryInfo.zipCode}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="font-medium">
                        {deliveryInfo.type === 'pickup' ? 'Pickup' : 'Delivery'} Time
                      </p>
                      <p className="text-gray-600">{deliveryInfo.date} at {deliveryInfo.time}</p>
                    </div>
                  </div>

                  {deliveryInfo.instructions && (
                    <div className="mt-4">
                      <p className="font-medium">Special Instructions</p>
                      <p className="text-gray-600">{deliveryInfo.instructions}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">What Happens Next?</h3>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 mt-0.5" />
                <p>You'll receive an email confirmation with your order details shortly.</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 mt-0.5" />
                <p>
                  We'll send you updates about your order status and notify you when it's ready for{' '}
                  {deliveryInfo.type === 'pickup' ? 'pickup' : 'delivery'}.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 mt-0.5" />
                <p>
                  If you have any questions, please call us at 0780746351 or email info@elbaker.com
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-center"
            >
              Continue Shopping
            </Link>
            <Link
              to="/contact"
              className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-500 font-bold py-3 px-8 rounded-lg transition-colors text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderConfirmation;