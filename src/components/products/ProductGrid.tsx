'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import QuickViewModal from './QuickViewModal';
import { Package } from 'lucide-react';

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  columns?: 2 | 3 | 4 | 5;
}

export default function ProductGrid({ products, loading, columns = 4 }: ProductGridProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  const colClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  }[columns];

  if (loading) {
    return (
      <div className={`grid ${colClass} gap-4 md:gap-6`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Package size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
        <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${colClass} gap-4 md:gap-6`}>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onQuickView={setQuickViewProduct}
          />
        ))}
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}