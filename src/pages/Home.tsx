import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Gallery from '../components/Gallery';
import { products } from '../data/products';
import { Star, Heart, Award } from 'lucide-react';
import welcomeImg from '../../images/wedding cakes/welcome.jpg';

const Home = () => {
  const navigate = useNavigate();

  const featuredProducts = products.slice(0, 4);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      text: 'The wedding cake from Elbaker was absolutely perfect! Every guest complimented how delicious it was.',
      rating: 5
    },
    {
      id: 2,
      name: 'Mike Davis',
      text: 'Best croissants in town! I come here every morning for my coffee and pastry.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Chen',
      text: 'Their custom birthday cakes are amazing. My daughter was so happy with her princess cake!',
      rating: 5
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Elbaker Artisan Bakes"
        subtitle="Where Every Bite is a Delight"
        ctaText="Explore Our Menu"
        ctaAction={() => navigate('/menu')}
      />

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Welcome to Elbaker our Bakery
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                At Elbaker, we believe that baking is an art form that brings people together. 
                For over a decade, we've been crafting exceptional baked goods using time-honored 
                techniques and the finest ingredients. Every loaf, cake, and pastry is made with 
                passion and dedication to create moments of pure joy.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From our signature artisan breads to custom celebration cakes, we take pride 
                in creating treats that not only taste amazing but also tell a story. 
                Come experience the difference that handcrafted quality makes.
              </p>
              <div className="flex items-center space-x-8 mt-8">
                <div className="flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-rose-500" />
                  <span className="text-gray-700 font-medium">Made with Love</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-amber-500" />
                  <span className="text-gray-700 font-medium">Award Winning</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={welcomeImg}
                alt="Bakery interior"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-white p-4 rounded-lg shadow-lg">
                <p className="font-bold text-2xl">6+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Specialties</h2>
            <p className="text-lg text-gray-600">Discover our most popular and seasonal treats</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">${product.price.toFixed(2)}</span>
                    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unified Gallery */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Masterpieces</h2>
            <p className="text-lg text-gray-600">A gallery of our finest creations</p>
          </div>
          
          <Gallery itemsToShow={6} />
          
          <div className="text-center mt-8">
            <button 
              onClick={() => navigate('/gallery')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              View Full Gallery
            </button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Don't just take our word for it</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-900">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;