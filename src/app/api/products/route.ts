import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, mapProduct } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

function toSnakeCase(field: string) {
  return field.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get('search')?.trim() || '';
  const category = searchParams.get('category')?.trim() || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 999999;
  const sort = searchParams.get('sort') || '-createdAt';
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;

  const start = (page - 1) * limit;
  const orderDirection = sort.startsWith('-') ? 'desc' : 'asc';
  const orderField = sort.replace(/^[-+]/, '');
  const orderColumn = orderField === 'createdAt' ? 'created_at' : toSnakeCase(orderField);

  let query = supabaseAdmin.from('products').select('*', { count: 'exact' });

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  if (category) {
    query = query.eq('category', category);
  }

  const { data, count, error } = await query
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .order(orderColumn, { ascending: orderDirection === 'asc' })
    .range(start, start + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    products: (data ?? []).map(mapProduct),
    pagination: {
      page,
      limit,
      total: count ?? 0,
      pages: Math.ceil((count ?? 0) / limit),
    },
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const payload = await req.json();
  const slug = `${payload.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({ ...payload, slug })
    .select('*')
    .single();

  if (error || !product) {
    return NextResponse.json({ error: error?.message ?? 'Product creation failed' }, { status: 500 });
  }

  return NextResponse.json({ product: mapProduct(product) });
}
