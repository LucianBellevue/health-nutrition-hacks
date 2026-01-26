import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import cloudinary from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary with optimization and compression
    // Cloudinary automatically optimizes images on upload
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'hnh-blog',
      resource_type: 'auto',
      // Image optimization - Cloudinary will automatically:
      // - Convert to modern formats (WebP, AVIF) when supported
      // - Compress while maintaining visual quality
      // - Strip EXIF data for privacy and smaller file sizes
      quality: 'auto:good', // Automatic quality optimization (good balance between quality and size)
      fetch_format: 'auto', // Automatically choose best format (WebP, AVIF, etc.) based on browser support
      // Limit maximum dimensions to prevent oversized images
      // This ensures images are resized if they exceed these dimensions
      transformation: [
        {
          width: 2000,
          height: 2000,
          crop: 'limit', // Maintain aspect ratio, don't crop - just limit size
        },
      ],
      // Additional optimization flags
      flags: ['progressive', 'strip_profile'], // Progressive JPEG loading, remove EXIF metadata
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
