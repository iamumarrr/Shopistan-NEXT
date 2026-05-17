import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getCurrentUser } from '@/lib/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Check for placeholder credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
      return NextResponse.json({ 
        error: 'Cloudinary is not configured. Please update your .env.local file with real credentials.' 
      }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, { 
      folder: 'shopistan',
      resource_type: 'auto'
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ 
      error: 'Upload failed: ' + (error.message || 'Internal server error') 
    }, { status: 500 });
  }
}