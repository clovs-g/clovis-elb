import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGallery } from '../hooks/useGallery';

interface GalleryItem {
  id: string;
  image_url: string; // for Supabase
  signed_url?: string;
  image?: string; // for static
  title?: string;
  category?: string;
  description?: string;
}

interface GalleryProps {
  showFilters?: boolean;
  itemsToShow?: number;
}

const Gallery = ({ showFilters = true, itemsToShow }: GalleryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = [
    { id: 'all', name: 'All', label: 'All Items' },
    { id: 'wedding', name: 'Wedding Cakes', label: 'Wedding Cakes' },
    { id: 'birthday', name: 'Birthday Cakes', label: 'Birthday Cakes' },
    { id: 'slices-cookies', name: 'Slices & Cookies', label: 'Slices & Cookies' },
    { id: 'graduation', name: 'Graduation Cakes', label: 'Graduation Cakes' },
    { id: 'custom', name: 'Custom Creations', label: 'Custom Creations' },
  ];

  const { images, loading } = useGallery(selectedCategory === 'all' ? undefined : selectedCategory);

  const displayItems = itemsToShow ? images.slice(0, itemsToShow) : images;

  const openLightbox = (item: GalleryItem) => {
    setSelectedImage(item);
    setCurrentImageIndex(displayItems.findIndex(i => i.id === item.id));
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    const nextIndex = (currentImageIndex + 1) % displayItems.length;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(displayItems[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentImageIndex - 1 + displayItems.length) % displayItems.length;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(displayItems[prevIndex]);
  };

  return (
    <div>
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
        </div>
      )}
      {/* Category Filters */}
      {showFilters && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-amber-500 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid - match admin sizing and spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => openLightbox(item)}
          >
            <div className="relative">
              <img
                src={item.signed_url || item.image_url || item.image}
                alt={item.title || 'Gallery'}
                className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-300 rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <p className="text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-4">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-amber-400 z-10 bg-black bg-opacity-50 rounded-full p-2"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Navigation Buttons */}
            {displayItems.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-400 z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-400 z-10 bg-black bg-opacity-50 rounded-full p-2"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Image */}
            <img
              src={selectedImage.signed_url || selectedImage.image_url || selectedImage.image}
              alt={selectedImage.title || 'Gallery'}
              className="max-w-full max-h-full object-contain"
            />

            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white bg-black bg-opacity-50 p-4 rounded-lg">
              <h3 className="text-xl font-semibold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-gray-300 mt-2">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;