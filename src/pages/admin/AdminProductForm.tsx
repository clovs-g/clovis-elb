import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Upload,
  X,
  Plus,
  Minus,
  Save,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { supabase, supabaseAdmin } from '../../lib/supabase';
import { productAPI } from '../../services/api';
import { v4 as uuidv4 } from 'uuid';

const AdminProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Cakes',
    price: '',
    description: '',
    shortDescription: '',
    ingredients: [''],
    allergens: [''],
    dietaryInfo: [''],
    stockQuantity: '',
    lowStockThreshold: '',
    status: 'active',
    featured: false,
    displayOrder: '',
    metaTitle: '',
    metaDescription: '',
    altText: '',
    tags: [''],
  });

  const [images, setImages] = useState<File[]>([]);
  const [sizes, setSizes] = useState([
    { size: '6-inch', price: '' },
    { size: '8-inch', price: '' },
    { size: '10-inch', price: '' },
  ]);

  const categories = ['Cakes', 'Cupcakes', 'Pastries', 'Cookies', 'Breads'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((item: string, i: number) => 
        i === index ? value : item
      )
    }));
  };

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field as keyof typeof prev], '']
    }));
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].filter((_: any, i: number) => i !== index)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index: number, field: 'size' | 'price', value: string) => {
    setSizes(prev => prev.map((size, i) => 
      i === index ? { ...size, [field]: value } : size
    ));
  };

  const addSize = () => {
    setSizes(prev => [...prev, { size: '', price: '' }]);
  };

  const removeSize = (index: number) => {
    setSizes(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1) Upload primary image (first selected) – store in Supabase bucket "product-images"
      let imageUrl: string | null = null;
      if (images.length > 0) {
        const file = images[0];
        const filePath = `${Date.now()}_${file.name}`;
        const storageClient = supabaseAdmin ?? supabase;
        try {
          const { error: uploadError } = await storageClient.storage
            .from('product-images')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });
          if (!uploadError) {
            imageUrl = filePath; // store relative path; signed url generated on read
          }
        } catch (uploadErr) {
          console.warn('Image upload skipped:', uploadErr);
        }
      }

      // 2) Resolve category_id
      const { data: catRow, error: catErr } = await supabase
        .from('categories')
        .select('id')
        .eq('name', formData.category)
        .single();
      if (catErr || !catRow) {
        throw new Error('Selected category not found in database');
      }

      // 3) Build product payload
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        base_price: parseFloat(formData.price) || 0,
        category_id: catRow.id,
        status: 'active' as const,
        is_featured: formData.featured,
      } as any;

      // 4) Insert product
      const newProduct = await productAPI.createProduct(payload);

      // 4b) Insert size options
      const validSizes = sizes.filter(s => s.size.trim() !== '' && s.price !== '');
      if (validSizes.length) {
        const sizeRows = validSizes.map(s => ({
          id: uuidv4(),
          product_id: newProduct.id,
          size_name: s.size,
          price_adjustment: parseFloat(s.price) || 0,
          display_order: 0,
        }));
        const { error: sizeErr } = await (supabaseAdmin ?? supabase)
          .from('product_sizes')
          .insert(sizeRows);
        if (sizeErr) {
          console.error('Failed to insert sizes:', sizeErr);
        }
      }

      // 5) Insert image record if upload succeeded
      if (imageUrl) {
        const { error: imgInsertError } = await (supabaseAdmin ?? supabase).from('product_images').insert({
          product_id: newProduct.id,
          image_url: imageUrl,
          is_primary: true,
        });
        if (imgInsertError) {
          console.error('Failed to insert product image:', imgInsertError);
          alert('Product created, but failed to save product image.');
        }
      }

      // Success → redirect back
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      alert((err as Error).message || 'Failed to save product');
    }
  };

  const handlePreview = () => {
    if (!formData.slug) {
      alert('Please enter a product name to generate preview.');
      return;
    }
    window.open(`/products/${formData.slug}`, '_blank');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update product information' : 'Create a new product for your bakery'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Product Images */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images (Max 5)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, WebP up to 5MB each</p>
                </label>
              </div>
            </div>

            {/* Image Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Preview
              </label>
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 bg-amber-500 text-white text-xs px-1 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Product Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h2>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg p-3 h-28 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>

        {/* Size Options */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Size Options</h2>
            <button
              type="button"
              onClick={addSize}
              className="flex items-center space-x-1 text-amber-600 hover:text-amber-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Size</span>
            </button>
          </div>

          <div className="space-y-3">
            {sizes.map((size, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={size.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="Size name (e.g., 6-inch)"
                />
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    step="0.01"
                    value={size.price}
                    onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                    className="w-24 pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="0.00"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                >
                  <Minus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Management</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stockQuantity}
                onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                value={formData.lowStockThreshold}
                onChange={(e) => handleInputChange('lowStockThreshold', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Featured Product</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center space-x-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            
            <button
              type="submit"
              className="flex items-center space-x-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>{isEditing ? 'Update Product' : 'Save Product'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;