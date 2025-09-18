import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Minus, Plus } from 'lucide-react';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import HeroSection from '../components/HeroSection';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const { product, loading, error } = useProduct(slug || '');
  const [selectedSize, setSelectedSize] = useState(
    undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/menu" className="text-amber-600 hover:text-amber-700">
            Return to Menu
          </Link>
        </div>
      </div>
    );
  }

  const imageSrc = product.signed_image_url || product.product_images?.[0]?.image_url || product.image || 'https://via.placeholder.com/600x600';

  const dbSizes = (product.product_sizes as any[]) || [];
  const sizeOptions = dbSizes.map((s) => ({ size: s.size_name, price: (product.base_price ?? 0) + (s.price_adjustment ?? 0) }));

  const currentPrice = selectedSize && sizeOptions.length
    ? sizeOptions.find(s => s.size === selectedSize)?.price || product.base_price || 0
    : product.base_price || 0;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: typeof currentPrice === 'string' ? parseFloat(currentPrice) : currentPrice,
      quantity,
      image: product.image,
      selectedSize,
    });

    alert(`${quantity} x ${product.name} added to cart!`);
  };

  const relatedProducts: any[] = [];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title={product.name}
        subtitle={product.description}
      />

      {/* Product Details */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg shadow-lg">
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-rose-500 transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Rating (Mock) */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-amber-600">
                ${currentPrice.toFixed(2)}
              </div>

              {/* Size Selection */}
              {sizeOptions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Size Options</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {sizeOptions.map((size) => (
                      <button
                        key={size.size}
                        onClick={() => setSelectedSize(size.size)}
                        className={`flex justify-between items-center p-4 border rounded-lg transition-colors ${
                          selectedSize === size.size
                            ? 'border-amber-500 bg-amber-50'
                            : 'border-gray-300 hover:border-amber-300'
                        }`}
                      >
                        <span className="font-medium">{size.size}</span>
                        <span className="font-bold text-amber-600">${size.price.toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Add to Cart - ${(currentPrice * quantity).toFixed(2)}</span>
              </button>

              {/* Product Details */}
              <div className="space-y-4 pt-6 border-t">
                {product.ingredients && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Ingredients</h3>
                    <p className="text-gray-600">{product.ingredients.join(', ')}</p>
                  </div>
                )}

                {product.allergens && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Allergens</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.dietaryInfo && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dietary Information</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.dietaryInfo.map((info) => (
                        <span
                          key={info}
                          className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {info}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.slug}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                    <div className="text-xl font-bold text-amber-600">
                      ${relatedProduct.price.toFixed(2)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;