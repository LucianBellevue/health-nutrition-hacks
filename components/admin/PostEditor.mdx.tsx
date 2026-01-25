'use client';

import { useState, useEffect, useRef } from 'react';
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
  AlertCircle,
  CheckCircle,
  FileText,
  RefreshCw,
  Link as LinkIcon,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { extractFAQsFromMDX } from '@/lib/faqExtractor';
import { getAllAuthors } from '@/lib/authors';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

interface CustomAuthor {
  name: string;
  bio: string;
  avatarUrl: string;
  social?: {
    twitter?: string;
    website?: string;
    linkedin?: string;
  };
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
  authorId?: string; // Author ID from lib/authors.ts or 'custom'
  customAuthor?: CustomAuthor; // Custom author data if authorId is 'custom'
}

interface PostEditorProps {
  initialData?: Partial<PostData> & { category?: { id: string } };
}

export default function PostEditor({ initialData }: PostEditorProps) {
  const router = useRouter();
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingInline, setUploadingInline] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [showScheduling, setShowScheduling] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showImageManagement, setShowImageManagement] = useState(false);
  const [showFAQManagement, setShowFAQManagement] = useState(false);
  const [syncingFAQs, setSyncingFAQs] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [slugExists, setSlugExists] = useState(false);
  const [imageFileSize, setImageFileSize] = useState<number | null>(null);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [saveNotification, setSaveNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });
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
    authorId: initialData?.authorId || '', // Empty = default to editorial team
    customAuthor: initialData?.customAuthor,
  });
  const [showAuthorFields, setShowAuthorFields] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Character count helpers
  const titleLength = formData.title.length;
  const descLength = formData.description.length;
  const contentWordCount = formData.content.trim().split(/\s+/).filter(Boolean).length;

  // SEO indicators
  const titleSeoStatus = titleLength >= 50 && titleLength <= 60 ? 'good' : titleLength > 60 ? 'warning' : 'info';
  const descSeoStatus = descLength >= 150 && descLength <= 160 ? 'good' : descLength > 160 ? 'warning' : 'info';

  // Fetch categories and tags on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, postsRes] = await Promise.all([
          fetch('/api/admin/categories'),
          fetch('/api/admin/posts')
        ]);
        
        if (categoriesRes.ok) {
          const data = await categoriesRes.json();
          setCategories(data);
          if (!formData.categoryId && data.length > 0) {
            setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
          }
        }

        // Extract unique tags from all posts
        if (postsRes.ok) {
          const posts = await postsRes.json();
          const uniqueTags = Array.from(new Set(posts.flatMap((p: { tags: string[] }) => p.tags || [])));
          setAllTags(uniqueTags as string[]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save to localStorage every 30 seconds
  useEffect(() => {
    const autoSave = () => {
      try {
        localStorage.setItem('post-draft', JSON.stringify(formData));
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    };

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(autoSave, 30000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [formData]);

  // Load draft from localStorage on mount (only for new posts)
  useEffect(() => {
    if (!initialData?.id) {
      try {
        const draft = localStorage.getItem('post-draft');
        if (draft) {
          const parsed = JSON.parse(draft);
          if (parsed.title || parsed.content) {
            const shouldLoad = window.confirm('Found a saved draft. Would you like to load it?');
            if (shouldLoad) {
              setFormData(parsed);
            } else {
              localStorage.removeItem('post-draft');
            }
          }
        }
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check if slug exists
  useEffect(() => {
    if (formData.slug && formData.slug !== initialData?.slug) {
      const checkSlug = async () => {
        try {
          const res = await fetch('/api/admin/posts');
          if (res.ok) {
            const posts = await res.json();
            const exists = posts.some((p: PostData) => p.slug === formData.slug && p.id !== initialData?.id);
            setSlugExists(exists);
          }
        } catch (error) {
          console.error('Failed to check slug:', error);
        }
      };
      const timer = setTimeout(checkSlug, 500);
      return () => clearTimeout(timer);
    } else {
      setSlugExists(false);
    }
  }, [formData.slug, initialData?.slug, initialData?.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S: Save draft
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSubmit(false);
      }
      // Ctrl+Shift+P: Publish
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        e.preventDefault();
        handleSubmit(true);
      }
      // Ctrl+Shift+I: Insert image
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        handleInsertInlineImage();
      }
      // Escape: Close modals
      if (e.key === 'Escape') {
        setShowImageModal(false);
        setShowFeaturedImageModal(false);
        setShowTemplates(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

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
      // Auto-populate meta title if empty
      metaTitle: prev.metaTitle || title.slice(0, 60),
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    setFormData((prev) => ({
      ...prev,
      description,
      // Auto-populate meta description if empty
      metaDescription: prev.metaDescription || description.slice(0, 160),
    }));
  };

  const handleResetSlug = () => {
    setFormData((prev) => ({
      ...prev,
      slug: generateSlug(prev.title),
    }));
  };

  const applyTemplate = (template: string) => {
    const templates = {
      howto: `## Introduction\n\nBrief overview of what you'll learn in this guide.\n\n## What You'll Need\n\n- Item 1\n- Item 2\n- Item 3\n\n## Step-by-Step Guide\n\n### Step 1: [Title]\n\nDetailed instructions...\n\n### Step 2: [Title]\n\nDetailed instructions...\n\n### Step 3: [Title]\n\nDetailed instructions...\n\n## Tips & Best Practices\n\n- Tip 1\n- Tip 2\n- Tip 3\n\n## Conclusion\n\nSummary and next steps...`,
      listicle: `## Introduction\n\nWhy this list matters...\n\n## 1. [First Item]\n\nDetailed explanation of the first item...\n\n## 2. [Second Item]\n\nDetailed explanation of the second item...\n\n## 3. [Third Item]\n\nDetailed explanation of the third item...\n\n## 4. [Fourth Item]\n\nDetailed explanation of the fourth item...\n\n## 5. [Fifth Item]\n\nDetailed explanation of the fifth item...\n\n## Conclusion\n\nKey takeaways...`,
      review: `## Overview\n\nBrief introduction to the product/topic...\n\n## Pros\n\n- Benefit 1\n- Benefit 2\n- Benefit 3\n\n## Cons\n\n- Drawback 1\n- Drawback 2\n- Drawback 3\n\n## Key Features\n\n### Feature 1\nDetailed explanation...\n\n### Feature 2\nDetailed explanation...\n\n### Feature 3\nDetailed explanation...\n\n## Who Is This For?\n\nTarget audience description...\n\n## Final Verdict\n\nOverall recommendation and rating...`,
    };
    setFormData((prev) => ({ ...prev, content: templates[template as keyof typeof templates] || prev.content }));
    setShowTemplates(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
      setTagSuggestions([]);
    }
  };

  const handleTagInputChange = (value: string) => {
    setTagInput(value);
    if (value.trim()) {
      const suggestions = allTags.filter(
        tag => tag.toLowerCase().includes(value.toLowerCase()) && !formData.tags.includes(tag)
      ).slice(0, 5);
      setTagSuggestions(suggestions);
    } else {
      setTagSuggestions([]);
    }
  };

  const selectTagSuggestion = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
    setTagInput('');
    setTagSuggestions([]);
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

    // Check file size
    setImageFileSize(file.size);

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
        
        // Use standard Image component for Cloudinary URLs
        const imageComponent = `\n\n<Image src="${imageUrl}" alt="${imageModalData.altText || 'Image'}" width={800} height={450} className="rounded-xl my-8" />\n\n`;
        
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

  // Extract all Image components from content
  interface ExtractedImage {
    id: string;
    src: string;
    alt: string;
    width?: string;
    height?: string;
    className?: string;
    fullMatch: string;
    startIndex: number;
  }

  const extractImagesFromContent = (content: string): ExtractedImage[] => {
    const images: ExtractedImage[] = [];
    // Match Image components (handles multiline): <Image ... />
    // Using a more flexible regex that handles multiline attributes
    const imageRegex = /<Image\s+([\s\S]*?)\s*\/>/g;
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const attributes = match[1];
      const srcMatch = attributes.match(/src=["']([^"']+)["']/);
      const altMatch = attributes.match(/alt=["']([^"']*)["']/);
      const widthMatch = attributes.match(/width=\{?(\d+)\}?/);
      const heightMatch = attributes.match(/height=\{?(\d+)\}?/);
      const classNameMatch = attributes.match(/className=["']([^"']+)["']/);

      if (srcMatch) {
        // Create stable ID based on src and position
        const stableId = `img-${srcMatch[1].substring(0, 20).replace(/[^a-zA-Z0-9]/g, '')}-${match.index}`;
        images.push({
          id: stableId,
          src: srcMatch[1],
          alt: altMatch ? altMatch[1] : '',
          width: widthMatch ? widthMatch[1] : undefined,
          height: heightMatch ? heightMatch[1] : undefined,
          className: classNameMatch ? classNameMatch[1] : undefined,
          fullMatch: match[0],
          startIndex: match.index || 0,
        });
      }
    }

    return images;
  };

  // Update alt text for a specific image in content
  const updateImageAltText = (content: string, imageIndex: number, newAltText: string): string => {
    const images = extractImagesFromContent(content);
    if (imageIndex < 0 || imageIndex >= images.length) return content;

    const image = images[imageIndex];
    // Escape special characters in alt text for regex
    const escapedAlt = image.alt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Replace the alt attribute in the full match
    const altRegex = new RegExp(`(alt=["'])${escapedAlt}(["'])`, 'g');
    const newImageMatch = image.fullMatch.replace(altRegex, `$1${newAltText}$2`);
    
    // Replace the original match with the updated one
    return content.replace(image.fullMatch, newImageMatch);
  };

  // Get all images from current content (memoized to avoid re-extracting on every render)
  const contentImages = extractImagesFromContent(formData.content);

  // Extract FAQs from content
  const contentFAQs = extractFAQsFromMDX(formData.content);
  
  // Combine FAQs (currently only from content, metadata support can be added later)
  const allFAQs = contentFAQs;

  // Sync FAQs to database
  const handleSyncFAQs = async () => {
    if (!initialData?.id) {
      alert('Please save the post first before syncing FAQs');
      return;
    }

    setSyncingFAQs(true);
    try {
      const res = await fetch(`/api/admin/posts/${initialData.id}/sync-faqs`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        showNotification('success', `FAQs synced: ${data.created} created, ${data.updated} updated, ${data.deleted} deleted`);
      } else {
        const error = await res.json();
        showNotification('error', error.error || 'Failed to sync FAQs');
      }
    } catch {
      showNotification('error', 'Network error while syncing FAQs');
    } finally {
      setSyncingFAQs(false);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setSaveNotification({ show: true, type, message });
    
    // Clear existing timer
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    
    // Auto-dismiss after 4 seconds
    toastTimerRef.current = setTimeout(() => {
      setSaveNotification({ show: false, type: 'success', message: '' });
    }, 4000);
  };

  const handlePreview = async () => {
    if (!formData.slug) {
      alert('Please add a slug before previewing');
      return;
    }

    // Save as draft first (without publishing)
    setSaving(true);
    try {
      // Prepare author data for metadata
      const authorMetadata: {
        authorId?: string;
        customAuthor?: CustomAuthor;
      } = {};
      if (formData.authorId && formData.authorId !== 'custom') {
        authorMetadata.authorId = formData.authorId;
      } else if (formData.authorId === 'custom' && formData.customAuthor) {
        authorMetadata.authorId = 'custom';
        authorMetadata.customAuthor = formData.customAuthor;
      }

      const payload: Omit<PostData, 'scheduledAt'> & {
        published: boolean;
        scheduledAt: string | null;
        metadata?: {
          authorId?: string;
          customAuthor?: CustomAuthor;
        };
      } = {
        ...formData,
        published: false,
        scheduledAt: formData.scheduledAt || null,
        metadata: Object.keys(authorMetadata).length > 0 ? authorMetadata : undefined,
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
        // Open preview in new tab
        window.open(`/admin/preview/${formData.slug}`, '_blank');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save draft for preview');
      }
    } catch {
      alert('An error occurred while preparing preview');
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    setSaving(true);
    try {
      // Prepare author data for metadata
      const authorMetadata: {
        authorId?: string;
        customAuthor?: CustomAuthor;
      } = {};
      if (formData.authorId && formData.authorId !== 'custom') {
        authorMetadata.authorId = formData.authorId;
      } else if (formData.authorId === 'custom' && formData.customAuthor) {
        authorMetadata.authorId = 'custom';
        authorMetadata.customAuthor = formData.customAuthor;
      }
      // If authorId is empty/undefined, it defaults to editorial team (handled server-side)

      const payload: Omit<PostData, 'scheduledAt'> & {
        published: boolean;
        scheduledAt: string | null;
        metadata?: {
          authorId?: string;
          customAuthor?: CustomAuthor;
        };
      } = {
        ...formData,
        published: publish,
        scheduledAt: formData.scheduledAt || null,
        metadata: Object.keys(authorMetadata).length > 0 ? authorMetadata : undefined,
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
        const savedPost = await res.json();
        
        // Verify the save by checking the returned data
        if (!savedPost || !savedPost.id) {
          showNotification('error', 'Save verification failed. Please try again.');
          return;
        }
        
        // Only redirect when publishing, stay in editor when saving draft
        if (publish) {
          showNotification('success', 'Post published successfully!');
          setTimeout(() => {
            router.push('/admin/posts');
            router.refresh();
          }, 1000);
        } else {
          // Verify the draft was saved by fetching it back
          try {
            const verifyRes = await fetch(`/api/admin/posts/${savedPost.id}`);
            if (verifyRes.ok) {
              const verifiedPost = await verifyRes.json();
              if (verifiedPost && verifiedPost.id === savedPost.id) {
                setLastSaved(new Date());
                showNotification('success', '✓ Draft saved successfully!');
              } else {
                showNotification('error', 'Save verification failed. Please check your post.');
              }
            } else {
              showNotification('error', 'Could not verify save. Please refresh and check.');
            }
          } catch {
            // Post was saved but verification failed - show warning
            setLastSaved(new Date());
            showNotification('success', '✓ Draft saved (verification skipped)');
          }
        }
      } else {
        const data = await res.json();
        showNotification('error', data.error || 'Failed to save post');
      }
    } catch {
      showNotification('error', 'Network error occurred. Please check your connection.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Save Notification Toast */}
      {saveNotification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-2xl border-2 flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-5 ${
          saveNotification.type === 'success'
            ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 text-emerald-800 dark:text-emerald-200'
            : 'bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200'
        }`}>
          {saveNotification.type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <span>{saveNotification.message}</span>
          <button
            onClick={() => setSaveNotification({ show: false, type: 'success', message: '' })}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Auto-save indicator - Floating */}
      {lastSaved && !saveNotification.show && (
        <div className="fixed top-4 right-4 z-40 bg-black px-4 py-2 rounded-lg shadow-lg border border-emerald-500/30 flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <span className="text-white">
            Saved {new Date(lastSaved).toLocaleTimeString()}
          </span>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="bg-black border border-emerald-500/30 rounded-lg p-3 text-sm text-white">
        <strong className="text-emerald-400">Shortcuts:</strong> Ctrl+S (Save) • Ctrl+Shift+P (Publish) • Ctrl+Shift+I (Insert Image) • Esc (Close Modals)
      </div>

      {/* Preview Button - Prominent placement */}
      {formData.slug && (
        <div className="bg-black border border-emerald-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white mb-1">Preview Your Post</h3>
              <p className="text-sm text-emerald-400">See how your post will look before publishing</p>
            </div>
            <button
              onClick={handlePreview}
              disabled={saving || slugExists || !formData.slug}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-md">
              <Eye className="h-4 w-4" />
              Open Preview
            </button>
          </div>
        </div>
      )}

      {/* Title & Slug */}
      <div className="bg-black rounded-xl p-6 shadow-sm border border-emerald-500/30 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Title
            <span className={`ml-2 text-xs ${titleSeoStatus === 'good' ? 'text-emerald-600' : titleSeoStatus === 'warning' ? 'text-amber-600' : 'text-gray-500'}`}>
              ({titleLength} chars {titleLength >= 50 && titleLength <= 60 ? '✓ Optimal' : titleLength > 60 ? '⚠ Too long' : '→ Aim for 50-60'})
            </span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Slug
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              className={`flex-1 px-4 py-2 border ${slugExists ? 'border-red-500' : 'border-emerald-500/30'} rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent`}
              placeholder="post-url-slug"
            />
            <button
              type="button"
              onClick={handleResetSlug}
              className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 border border-emerald-500/30 transition-colors flex items-center gap-2"
              title="Generate from title"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          {slugExists && (
            <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              This slug already exists. Choose a unique one.
            </p>
          )}
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <LinkIcon className="h-3 w-3" />
            Preview: yourblog.com/blog/{formData.slug || 'your-slug'}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Description
            <span className={`ml-2 text-xs ${descSeoStatus === 'good' ? 'text-emerald-600' : descSeoStatus === 'warning' ? 'text-amber-600' : 'text-gray-500'}`}>
              ({descLength} chars {descLength >= 150 && descLength <= 160 ? '✓ Optimal' : descLength > 160 ? '⚠ Too long' : '→ Aim for 150-160'})
            </span>
          </label>
          <textarea
            value={formData.description}
            onChange={handleDescriptionChange}
            rows={3}
            className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
            placeholder="Brief description for SEO and previews"
          />
        </div>
      </div>

      {/* MDX Editor */}
      <div className="bg-black rounded-xl shadow-sm border border-emerald-500/20 overflow-hidden">
        <div className="p-4 border-b border-emerald-500/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-white">
                Content (MDX Format)
                <span className="ml-2 text-xs text-emerald-400">({contentWordCount} words)</span>
              </h3>
              <p className="text-xs text-emerald-400 mt-1">
                Write in Markdown with JSX component support
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Templates
              </button>
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
      <div className="bg-black rounded-xl p-6 shadow-sm border border-emerald-500/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-white mb-2">
              Featured Image
            </label>
            {formData.image ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-emerald-500/30">
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
                className="w-full h-48 border-2 border-dashed border-emerald-500/30 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors flex flex-col items-center justify-center gap-3 text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-400 bg-zinc-900/50"
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
                className="w-full px-3 py-2 text-xs border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Or paste image URL directly"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-2">
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
          <div className="relative">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => handleTagInputChange(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                }
                className="flex-1 px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Add a tag (start typing for suggestions)"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Add
              </button>
            </div>
            {/* Tag suggestions dropdown */}
            {tagSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-black border border-emerald-500/30 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                {tagSuggestions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => selectTagSuggestion(tag)}
                    className="w-full px-4 py-2 text-left hover:bg-emerald-500/10 text-white text-sm"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Fields */}
      <div className="bg-black rounded-xl shadow-sm border border-emerald-500/20 overflow-hidden">
        <button
          onClick={() => setShowSeoFields(!showSeoFields)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-500/10"
        >
          <span className="font-medium text-white">
            SEO Settings
          </span>
          <span className="text-gray-500">{showSeoFields ? '−' : '+'}</span>
        </button>
        {showSeoFields && (
          <div className="px-6 pb-6 space-y-4 border-t border-emerald-500/20 pt-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
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
                className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Override the default title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
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
                className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                placeholder="Override the default description for search engines"
              />
            </div>
          </div>
        )}

        {/* Author Selection */}
        <button
          type="button"
          onClick={() => setShowAuthorFields(!showAuthorFields)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-500/10"
        >
          <span className="font-medium text-white">
            Author Attribution
            {formData.authorId && formData.authorId !== 'custom' && (
              <span className="text-gray-500 font-normal ml-2">
                ({getAllAuthors().find(a => a.id === formData.authorId)?.name || 'Custom'})
              </span>
            )}
            {formData.authorId === 'custom' && formData.customAuthor?.name && (
              <span className="text-gray-500 font-normal ml-2">
                ({formData.customAuthor.name})
              </span>
            )}
            {!formData.authorId && (
              <span className="text-gray-500 font-normal ml-2">(Editorial Team - Default)</span>
            )}
          </span>
          <span className="text-gray-500">{showAuthorFields ? '−' : '+'}</span>
        </button>
        {showAuthorFields && (
          <div className="px-6 pb-6 space-y-4 border-t border-emerald-500/20 pt-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Select Author
                <span className="text-gray-400 text-xs font-normal ml-2">
                  (Leave empty for Editorial Team - Default)
                </span>
              </label>
              <select
                value={formData.authorId || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    authorId: value || undefined,
                    customAuthor: value === 'custom' ? (prev.customAuthor || {
                      name: '',
                      bio: '',
                      avatarUrl: '',
                      social: {},
                    }) : undefined,
                  }));
                }}
                className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Editorial Team (Default)</option>
                {getAllAuthors().map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
                <option value="custom">Custom Author</option>
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Select an existing author or choose &quot;Custom Author&quot; to enter details manually.
                Leave empty to use the default Editorial Team.
              </p>
            </div>

            {/* Custom Author Fields */}
            {formData.authorId === 'custom' && (
              <div className="space-y-4 pt-4 border-t border-emerald-500/20">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 mb-4">
                  <p className="text-sm text-emerald-300">
                    <strong>Google E-E-A-T Requirements:</strong> For best SEO, include author name, bio with credentials, and social links.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Author Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customAuthor?.name || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customAuthor: {
                          ...(prev.customAuthor || { name: '', bio: '', avatarUrl: '', social: {} }),
                          name: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="e.g., Dr. Jane Smith, RD"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Author Bio <span className="text-red-400">*</span>
                    <span className="text-gray-400 text-xs font-normal ml-2">
                      (Include credentials and expertise)
                    </span>
                  </label>
                  <textarea
                    value={formData.customAuthor?.bio || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customAuthor: {
                          ...(prev.customAuthor || { name: '', bio: '', avatarUrl: '', social: {} }),
                          bio: e.target.value,
                        },
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                    placeholder="e.g., Registered dietitian with 10+ years of experience in clinical nutrition..."
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Include professional credentials, years of experience, and areas of expertise.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.customAuthor?.avatarUrl || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        customAuthor: {
                          ...(prev.customAuthor || { name: '', bio: '', avatarUrl: '', social: {} }),
                          avatarUrl: e.target.value,
                        },
                      }))
                    }
                    className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-white mb-2">
                    Social Links (Optional but recommended for E-E-A-T)
                  </label>
                  
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Website</label>
                    <input
                      type="url"
                      value={formData.customAuthor?.social?.website || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customAuthor: {
                            ...(prev.customAuthor || { name: '', bio: '', avatarUrl: '', social: {} }),
                            social: {
                              ...(prev.customAuthor?.social || {}),
                              website: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Twitter/X</label>
                    <input
                      type="url"
                      value={formData.customAuthor?.social?.twitter || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customAuthor: {
                            ...(prev.customAuthor || { name: '', bio: '', avatarUrl: '', social: {} }),
                            social: {
                              ...(prev.customAuthor?.social || {}),
                              twitter: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      value={formData.customAuthor?.social?.linkedin || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          customAuthor: {
                            ...(prev.customAuthor || { name: '', bio: '', avatarUrl: '', social: {} }),
                            social: {
                              ...(prev.customAuthor?.social || {}),
                              linkedin: e.target.value,
                            },
                          },
                        }))
                      }
                      className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Management */}
      <div className="bg-black rounded-xl shadow-sm border border-emerald-500/20 overflow-hidden">
        <button
          onClick={() => setShowImageManagement(!showImageManagement)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-500/10"
        >
          <span className="font-medium text-white flex items-center gap-2">
            <ImagePlus className="h-4 w-4" />
            Manage Images ({contentImages.length})
          </span>
          <span className="text-gray-500">{showImageManagement ? '−' : '+'}</span>
        </button>
        {showImageManagement && (
          <div className="px-6 pb-6 border-t border-emerald-500/20 pt-4">
            {contentImages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <ImagePlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No images found in post content.</p>
                <p className="text-xs mt-1">Use the &quot;Insert Image&quot; button to add images to your post.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-emerald-400 mb-4">
                  Edit alt text for all images in your post. Good alt text improves accessibility and SEO.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentImages.map((img, index) => (
                    <div
                      key={img.id}
                      className="border border-emerald-500/30 rounded-lg p-4 bg-zinc-900/50 space-y-3"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800">
                        <img
                          src={img.src}
                          alt={img.alt || 'Image preview'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="450"%3E%3Crect fill="%23334155" width="800" height="450"/%3E%3Ctext fill="%2394a3b8" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="16"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          #{index + 1}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-white mb-1">
                          Alt Text <span className="text-gray-500">(required for SEO & accessibility)</span>
                        </label>
                        <textarea
                          value={img.alt}
                          onChange={(e) => {
                            const newAltText = e.target.value;
                            const imageIndex = contentImages.findIndex((i) => i.id === img.id);
                            const updatedContent = updateImageAltText(
                              formData.content,
                              imageIndex,
                              newAltText
                            );
                            setFormData((prev) => ({ ...prev, content: updatedContent }));
                          }}
                          rows={2}
                          className="w-full px-3 py-2 text-sm border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                          placeholder="Describe the image for accessibility and SEO..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {img.alt.length} characters
                          {img.alt.length < 10 && (
                            <span className="text-amber-500 ml-1">• Consider adding more detail</span>
                          )}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div className="truncate">
                          <span className="text-gray-500">Source:</span>{' '}
                          <a
                            href={img.src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 underline"
                          >
                            {img.src.length > 50 ? `${img.src.substring(0, 50)}...` : img.src}
                          </a>
                        </div>
                        {(img.width || img.height) && (
                          <div>
                            <span className="text-gray-500">Dimensions:</span>{' '}
                            {img.width} × {img.height}px
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-xs text-emerald-400">
                    <strong>💡 SEO Tip:</strong> Write descriptive alt text that explains what&apos;s in the image. 
                    Include relevant keywords naturally, but prioritize clarity and context for screen readers.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAQ Management */}
      <div className="bg-black rounded-xl shadow-sm border border-emerald-500/20 overflow-hidden">
        <button
          onClick={() => setShowFAQManagement(!showFAQManagement)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-500/10"
        >
          <span className="font-medium text-white flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Manage FAQs ({allFAQs.length})
          </span>
          <span className="text-gray-500">{showFAQManagement ? '−' : '+'}</span>
        </button>
        {showFAQManagement && (
          <div className="px-6 pb-6 border-t border-emerald-500/20 pt-4">
            {allFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <HelpCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No FAQs found in post content.</p>
                <p className="text-xs mt-1">
                  Add FAQSection components to your MDX content or add FAQs to metadata.
                </p>
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-left">
                  <p className="text-xs text-emerald-400 mb-2">
                    <strong>Example MDX usage:</strong>
                  </p>
                  <pre className="text-xs text-gray-300 bg-zinc-900 p-2 rounded overflow-x-auto">
{`<FAQSection
  items={[
    {
      question: "Your question?",
      answer: "Your answer."
    }
  ]}
/>`}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-emerald-400">
                    Found {allFAQs.length} FAQ{allFAQs.length !== 1 ? 's' : ''} in your content.
                  </p>
                  {initialData?.id && (
                    <button
                      onClick={handleSyncFAQs}
                      disabled={syncingFAQs}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {syncingFAQs ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Sync to Database
                        </>
                      )}
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {allFAQs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-emerald-500/30 rounded-lg p-4 bg-zinc-900/50 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                          #{index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white mb-1">
                            {faq.question}
                          </p>
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <p className="text-xs text-emerald-400">
                    <strong>💡 SEO Tip:</strong> FAQs are automatically extracted from your MDX content. 
                    Click &quot;Sync to Database&quot; to store them in the database for better performance and schema generation.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Scheduling */}
      <div className="bg-black rounded-xl shadow-sm border border-emerald-500/20 overflow-hidden">
        <button
          onClick={() => setShowScheduling(!showScheduling)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-emerald-500/10"
        >
          <span className="font-medium text-white flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Post
          </span>
          <span className="text-gray-500">{showScheduling ? '−' : '+'}</span>
        </button>
        {showScheduling && (
          <div className="px-6 pb-6 border-t border-emerald-500/20 pt-4">
            <label className="block text-sm font-medium text-white mb-2">
              Publish Date & Time
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, scheduledAt: e.target.value }))
              }
              className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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

      {/* Quick Actions - Floating Toolbar */}
      <div className="sticky bottom-0 z-30 bg-gradient-to-t from-zinc-950 to-transparent pt-8 pb-4">
        <div className="flex items-center justify-between bg-black rounded-xl p-4 shadow-lg border-2 border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-white">
              {formData.published ? (
                <>
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Published</span>
                </>
              ) : formData.scheduledAt ? (
                <>
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium text-blue-600 dark:text-blue-400">
                    Scheduled for{' '}
                    {new Date(formData.scheduledAt).toLocaleString()}
                  </span>
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 text-amber-500" />
                  <span className="font-medium text-amber-600 dark:text-amber-400">Draft</span>
                </>
              )}
            </div>
            <span className="text-xs text-emerald-400 border-l border-emerald-500/30 pl-4">MDX Format • {contentWordCount} words</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePreview}
              disabled={saving || slugExists || !formData.slug}
              className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium border border-emerald-500/30"
              title="Preview post in new tab"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={saving || slugExists}
              className="px-5 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium border border-emerald-500/30"
              title="Ctrl+S"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSubmit(true)}
              disabled={saving || slugExists}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium shadow-md"
              title="Ctrl+Shift+P"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  {formData.scheduledAt ? 'Schedule' : initialData?.published ? 'Update' : 'Publish Now'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image Upload Modal */}
      {showFeaturedImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">
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
                  : 'border-emerald-500/30'
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
                    <label className="cursor-pointer px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 border border-emerald-500/30 transition-colors text-sm font-medium">
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
                  <Upload className="h-12 w-12 text-emerald-400 mb-3" />
                  <p className="text-sm font-medium text-white mb-1">
                    Drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-emerald-400">
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

            {/* Helper Text & File Size Warning */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Tip:</strong> For best results, use images at least 1200px wide. The featured image appears at the top of your post and in preview cards.
              </p>
            </div>
            {imageFileSize && imageFileSize > 500000 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <strong>Large file:</strong> {(imageFileSize / (1024 * 1024)).toFixed(2)}MB. Consider compressing for faster page loads.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelFeaturedImage}
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
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
          <div className="bg-black rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">
              Insert Inline Image
            </h3>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileSelect}
                className="w-full px-3 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>

            {/* Image Preview */}
            {imageModalData.preview && (
              <div className="border-2 border-dashed border-emerald-500/30 rounded-lg p-4">
                <img
                  src={imageModalData.preview}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded"
                />
              </div>
            )}

            {/* Alt Text */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Alt Text <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={imageModalData.altText}
                onChange={(e) =>
                  setImageModalData((prev) => ({ ...prev, altText: e.target.value }))
                }
                placeholder="Describe the image for accessibility"
                className="w-full px-4 py-2 border border-emerald-500/30 rounded-lg bg-zinc-900 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Variant Selection */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
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
                      : 'border-emerald-500/30 text-white hover:border-gray-400'
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
                      : 'border-emerald-500/30 text-white hover:border-gray-400'
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
                      : 'border-emerald-500/30 text-white hover:border-gray-400'
                  }`}
                >
                  Inline
                </button>
              </div>
              <p className="text-xs text-emerald-400 mt-2">
                Hero: Full-width • Section: Standard • Inline: Small
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancelImageInsert}
                disabled={uploadingInline}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
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

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-xl shadow-xl max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">
                Content Templates
              </h3>
              <button
                onClick={() => setShowTemplates(false)}
                className="text-emerald-400 hover:text-emerald-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-sm text-emerald-400">
              Choose a template to start your post with a pre-structured format.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => applyTemplate('howto')}
                className="p-4 border-2 border-emerald-500/30 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      How-To Guide
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Step-by-step tutorial format with introduction, requirements, steps, and tips
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => applyTemplate('listicle')}
                className="p-4 border-2 border-emerald-500/30 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Listicle
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Numbered list format perfect for &quot;Top 5&quot; or &quot;10 Best&quot; style articles
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => applyTemplate('review')}
                className="p-4 border-2 border-emerald-500/30 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-emerald-600 mt-1" />
                  <div>
                    <h4 className="font-medium text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      Product Review
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Comprehensive review format with pros, cons, features, and verdict
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="pt-4 border-t border-emerald-500/20">
              <button
                onClick={() => setShowTemplates(false)}
                className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
