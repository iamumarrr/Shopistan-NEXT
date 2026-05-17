'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`).then((r) => r.json()).then((d) => setProduct(d.product));
  }, [id]);

  if (!product) return <div>Loading...</div>;
  return <ProductForm product={product} />;
}