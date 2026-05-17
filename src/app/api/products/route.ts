import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Product } from '@/models/Product';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 999999;
  const sort = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;

  const query: any = { price: { $gte: minPrice, $lte: maxPrice } };
  if (search) query.$text = { $search: search };
  if (category) query.category = category;

  const [products, total] = await Promise.all([
    Product.find(query).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(query),
  ]);

  return NextResponse.json({
    products,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await connectDB();
  const data = await req.json();
  data.slug = data.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const product = await Product.create(data);
  return NextResponse.json({ product });
}