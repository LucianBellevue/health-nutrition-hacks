'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MDXEditor from './MDXEditor';
import {
  Save,
  Eye,
  EyeOff,
  Upload,
  Calendar,
  X,
  Loader2,
  ImagePlus,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface PostData {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  format: string;
  categoryId: string;
  tags: string[];
  image: string;
  published: boolean;
  scheduledAt: string;
  metaTitle: string;
  metaDescription: string;
}

interface PostEditorProps {
  initialData?: Partial<PostData> & { category?: { id: string } };
}

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageModalData, setImageModalData] = useState({
    file: null as File | null,
    altText: '',
    variant: 'section' as 'hero' | 'section' | 'inline',
    preview: '',
  });
  const [showFeaturedImageModal, setShowFeaturedImageModal] = useState(false);
  const [featuredImageData, setFeaturedImageData] = useState({
    file: null as File | null,
    preview: '',
    isDragging: false,
  });

  const [formData, setFormData] = useState<PostData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    format: 'mdx',
    categoryId: initialData?.categoryId || initialData?.category?.id || '',
    tags: initialData?.tags || [],
    image: initialData?.image || '',
    published: initialData?.published || false,
    scheduledAt: initialData?.scheduledAt || '',
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || '',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/admin/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (!formData.categoryId && data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }
    fetchCategories();
  }, []);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: initialData?.slug ? prev.slug : generateSlug(title),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleOpenFeaturedImageModal = () => {
    setShowFeaturedImageModal(true);
  };

  const handleFeaturedImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImageData({
        file,
        preview: reader.result as string,
        isDragging: false,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFeaturedImageData((prev) => ({ ...prev, isDragging: false }));

    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImageData({
        file,
        preview: reader.result as string,
        isDragging: false,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFeaturedImageData((prev) => ({ ...prev, isDragging: true }));
  };

  const handleFeaturedImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFeaturedImageData((prev) => ({ ...prev, isDragging: false }));
  };

  const handleConfirmFeaturedImage = async () => {
    if (!featuredImageData.file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', featuredImageData.file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, image: data.url }));
        setShowFeaturedImageModal(false);
        setFeaturedImageData({
          file: null,
          preview: '',
          isDragging: false,
        });
      } else {
        alert('Failed to upload image to Cloudinary');
      }
    } catch {
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleCancelFeaturedImage = () => {
    setShowFeaturedImageModal(false);
    setFeaturedImageData({
      file: null,
      preview: '',
      isDragging: false,
    });
  };

  const handleInsertInlineImage = () => {
    setShowImageModal(true);
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageModalData({
        file,
        altText: '',
        variant: 'section',
        preview: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmImageInsert = async () => {
    if (!imageModalData.file) return;

    setUploadingInline(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', imageModalData.file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (res.ok) {
        const data = await res.json();
        const imageUrl = data.url;
        
        const imageComponent = `\n\n<PostImage slug="${formData.slug || 'your-post-slug'}" src="${imageUrl}" alt="${imageModalData.altText || 'Image'}" variant="${imageModalData.variant}" />\n\n`;
        
        setFormData((prev) => ({
          ...prev,
          content: prev.content + imageComponent,
        }));

        // Close modal and reset
        setShowImageModal(false);
        setImageModalData({
          file: null,
          altText: '',
          variant: 'section',
          preview: '',
        });
      } else {
        alert('Failed to upload image to Cloudinary');
      }
    } catch {
      alert('Error uploading image');
    } finally {
      setUploadingInline(false);
    }
  };

  const handleCancelImageInsert = () => {
    setShowImageModal(false);
    setImageModalData({
      file: null,
      altText: '',
      variant: 'section',
      preview: '',
    });
  };

  const handleSubmit = async (publish: boolean) => {
    setSaving(true);
    try {
      const payload = {
        ...formData,
        published: publish,
        scheduledAt: formData.scheduledAt || null,
      };

      const url = initialData?.id
        ? `/api/admin/posts/${initialData.id}`
        : '/api/admin/posts';
      const method = initialData?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/posts');
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save post');
      }
    } catch {
      alert('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="post-url-slug"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder="Brief description for SEO and previews"
          />
        </div>
      </div>

      {/* MDX Editor */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Content (MDX Format)
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Write in Markdown with JSX component support
              </p>
            </div>
            <button
              type="button"
              onClick={handleInsertInlineImage}
              disabled={uploadingInline}
              className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingInline ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4" />
              )}
              {uploadingInline ? 'Uploading...' : 'Insert Image'}
            </button>
          </div>
        </div>
        <div className="p-4">
          <MDXEditor
            value={formData.content}
            onChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
          />
        </div>
      </div>

      {/* Metadata */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Featured Image
            </label>
            {formData.image ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                <img
                  src={formData.image}
                  alt="Featured"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2 opacity-0 hover:opacity-100">
                  <button
                    type="button"
                    onClick={handleOpenFeaturedImageModal}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleOpenFeaturedImageModal}
                className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex flex-col items-center justify-center gap-3 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-gray-50 dark:bg-gray-900/50"
              >
                <Upload className="h-8 w-8" />
                <div className="text-center">
                  <p className="text-sm font-medium">Upload Featured Image</p>
                  <p className="text-xs mt-1">Click to browse or drag and drop</p>
                </div>
              </button>
            )}
            <div className="mt-2">
              <input
                type="text"
                value={formData.image}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, image: e.target.value }))
                }
                className="w-full px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Or paste image URL directly"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (e.preventDefault(), handleAddTag())
              }
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* SEO Fields */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowSeoFields(!showSeoFields)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <span className="font-medium text-gray-900 dark:text-white">
            SEO Settings
          </span>
          <span className="text-gray-500">{showSeoFields ? '−' : '+'}</span>
        </button>
        {showSeoFields && (
          <div className="px-6 pb-6 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Title
                <span className="text-gray-500 font-normal ml-2">
                  ({formData.metaTitle.length}/60)
                </span>
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, metaTitle: e.target.value }))
                }
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Override the default title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Meta Description
                <span className="text-gray-500 font-normal ml-2">
                  ({formData.metaDescription.length}/160)
                </span>
              </label>
              <textarea
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
                maxLength={160}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Override the default description for search engines"
              />
            </div>
          </div>
        )}
      </div>

      {/* Scheduling */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setShowScheduling(!showScheduling)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700/50"
        >
          <span className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Post
          </span>
          <span className="text-gray-500">{showScheduling ? '−' : '+'}</span>
        </button>
        {showScheduling && (
          <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, scheduledAt: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-2">
              Leave empty to publish immediately when you click Publish.
            </p>
            {formData.scheduledAt && (
              <button
                onClick={() =>
                  setFormData((prev) => ({ ...prev, scheduledAt: '' }))
                }
                className="mt-2 text-sm text-red-500 hover:text-red-600"
              >
                Clear scheduled date
              </button>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          {formData.published ? (
            <>
              <Eye className="h-4 w-4 text-emerald-500" />
              <span>Published</span>
            </>
          ) : formData.scheduledAt ? (
            <>
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>
                Scheduled for{' '}
                {new Date(formData.scheduledAt).toLocaleString()}
              </span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-amber-500" />
              <span>Draft</span>
            </>
          )}
          <span className="ml-4 text-xs text-gray-500">MDX Format</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {formData.scheduledAt ? 'Schedule' : initialData?.published ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Featured Image Upload Modal */}
      {showFeaturedImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Upload Featured Image
            </h3>

            {/* Drag and Drop Zone */}
            <div
              onDrop={handleFeaturedImageDrop}
              onDragOver={handleFeaturedImageDragOver}
              onDragLeave={handleFeaturedImageDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 transition-all ${
                featuredImageData.isDragging
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {featuredImageData.preview ? (
                <div className="space-y-4">
                  <img
                    src={featuredImageData.preview}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg shadow-md"
                  />
                  <div className="flex items-center justify-center">
                    <label className="cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">
                      Choose Different Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFeaturedImageFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Supports: JPG, PNG, GIF, WebP (Max 10MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedImageFileSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Helper Text */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Tip:</strong> For best results, use images at least 1200px wide. The featured image appears at the top of your post and in preview cards.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelFeaturedImage}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmFeaturedImage}
                disabled={!featuredImageData.file || uploading}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading to Cloud...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload & Set as Featured
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Insert Inline Image
            </h3>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>

            {/* Image Preview */}
            {imageModalData.preview && (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                <img
                  src={imageModalData.preview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded"
                />
              </div>
            )}

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={imageModalData.altText}
                onChange={(e) =>
                  setImageModalData((prev) => ({ ...prev, altText: e.target.value }))
                }
                placeholder="Describe the image for accessibility"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Variant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Variant
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setImageModalData((prev) => ({ ...prev, variant: 'hero' }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    imageModalData.variant === 'hero'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Hero
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImageModalData((prev) => ({ ...prev, variant: 'section' }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    imageModalData.variant === 'section'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Section
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setImageModalData((prev) => ({ ...prev, variant: 'inline' }))
                  }
                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                    imageModalData.variant === 'inline'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-gray-400'
                  }`}
                >
                  Inline
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Hero: Full-width • Section: Standard • Inline: Small
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelImageInsert}
                disabled={uploadingInline}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmImageInsert}
                disabled={!imageModalData.file || !imageModalData.altText || uploadingInline}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploadingInline ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Insert Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
