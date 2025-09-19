import React, { useRef, useState } from 'react';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { useAdminGallery } from '../../hooks/useAdminGallery';

const AdminGallery: React.FC = () => {
  const { images, loading, error, uploadImage, deleteImage } = useAdminGallery();
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'birthday', label: 'Birthday' },
    { id: 'slices-cookies', label: 'Slices & Cookies' },
    { id: 'graduation', label: 'Graduation' },
    { id: 'custom', label: 'Custom' },
  ];

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [uploadCategory, setUploadCategory] = useState<string>('birthday');
  const [uploadName, setUploadName] = useState<string>('');
  const fileInput = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      await uploadImage(file, uploadCategory, uploadName);
      setUploadName('');
      // Optionally reset category to the last selected filter
      // setUploadCategory(selectedCategoryFilter !== 'all' ? selectedCategoryFilter : 'birthday');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Upload & Filters header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-4 sm:space-y-0">
        {/* Left side: Title */}
        <h1 className="text-2xl font-bold text-gray-900">Gallery</h1>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryFilter(cat.id)}
              className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategoryFilter === cat.id
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Upload controls */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Image name/title"
            value={uploadName}
            onChange={e => setUploadName(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
            style={{ minWidth: 150 }}
          />
          <select
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
          >
            {categories.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <button
            onClick={() => fileInput.current?.click()}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600" />
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {/* Filter images by selected category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images
            .filter((img) => {
              if (selectedCategoryFilter === 'all') return true;
              // Normalize both sides for comparison
              const normalize = (val: string | undefined) => (val || '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
              return normalize(img.category) === normalize(selectedCategoryFilter);
            })
            .map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.signed_url || img.image_url}
                alt={img.title || 'Gallery'}
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <div className="mt-2 text-center text-xs text-gray-700">
                <strong>{img.title}</strong>
                <div>cat: <span style={{color:'red'}}>{img.category}</span></div>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Delete this image?')) {
                    deleteImage(img.id, img.image_url);
                  }
                }}
                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-red-100 transition"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
          ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminGallery; 