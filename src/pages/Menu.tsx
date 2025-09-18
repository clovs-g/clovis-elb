import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import { useProducts } from '../hooks/useProducts';
import { ShoppingCart, Info } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();

  const categories = ['All', 'Cakes', 'Cupcakes', 'Pastries', 'Cookies', 'Breads'];

  const { products, loading, error } = useProducts();

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => (product.categories?.name || product.category) === selectedCategory);

  const groupedProducts = categories.reduce((acc, category) => {
    if (category === 'All') return acc;
    acc[category] = products.filter(product => (product.categories?.name || product.category) === category);
    return acc;
  }, {} as Record<string, typeof products>);

  const handleAddToCart = (product: any, selectedSize?: string) => {
    const rawPrice = selectedSize && product.sizes
      ? product.sizes.find((s: any) => s.size === selectedSize)?.price ?? product.price ?? product.base_price ?? 0
      : product.price ?? product.base_price ?? 0;

    const priceNumber = typeof rawPrice === 'string' ? parseFloat(rawPrice) : Number(rawPrice);
    const price = isNaN(priceNumber) ? 0 : priceNumber;

    addToCart({
      productId: product.id,
      name: product.name,
      price,
      quantity: 1,
      image: product.signed_image_url || product.product_images?.[0]?.image_url || product.image || 'https://via.placeholder.com/400x300',
      selectedSize,
    });

    // Show a brief confirmation (you could enhance this with a toast notification)
    alert(`${product.name} added to cart!`);
  };

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Our Delectable Menu"
        subtitle="Discover your next sweet craving"
      />

      {/* Menu Categories Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-amber-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-amber-50 hover:text-amber-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedCategory === 'All' ? (
            // Show all categories
            Object.entries(groupedProducts).map(([category, items]) => (
              <div key={category} className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Show filtered category
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {selectedCategory}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const ProductCard = ({ 
  product, 
  onAddToCart 
}: { 
  product: any;
  onAddToCart: (product: any, selectedSize?: string) => void;
}) => {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes ? product.sizes[0].size : undefined
  );
  const currentPrice = product.base_price || product.price || 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="aspect-square overflow-hidden">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.signed_image_url || product.product_images?.[0]?.image_url || product.image || 'https://via.placeholder.com/400x300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="p-6">
        <Link to={`/products/${product.slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 hover:text-amber-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">{product.description}</p>
        
        {/* Size Selection */}
        {product.sizes && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Size:</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size.size}
                  onClick={() => setSelectedSize(size.size)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    selectedSize === size.size
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-amber-300'
                  }`}
                >
                  {size.size} - ${size.price}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-4">
          <div className="text-2xl font-bold text-amber-600">
            ${currentPrice.toFixed(2)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onAddToCart(product, selectedSize)}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
          <Link
            to={`/products/${product.slug}`}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
          >
            <Info className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Menu;