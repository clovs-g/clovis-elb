import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero Section */}
      <HeroSection
        title="Our Creative Confections"
        subtitle="A visual feast of our finest baking"
        ctaText="View Our Full Menu"
        ctaAction={() => navigate('/menu')}
      />

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Gallery of Delights
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our complete collection of handcrafted masterpieces. From elegant wedding cakes 
              to delightful birthday celebrations and artisan pastries, each creation tells a unique story.
            </p>
          </div>
          
          <Gallery />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-50 to-orange-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Love What You See?
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            Ready to create something special for your next celebration? 
            Let's bring your vision to life with our custom design services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/contact')}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Request Custom Order
            </button>
            <button 
              onClick={() => navigate('/menu')}
              className="bg-white hover:bg-gray-50 text-amber-600 border-2 border-amber-500 font-bold py-3 px-8 rounded-full transition-all duration-300"
            >
              Browse Menu
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GalleryPage;