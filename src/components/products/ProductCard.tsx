'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Check } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useWishlist } from '@/store/wishlistStore';
import { useCart } from '@/store/cartStore';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  slug?: string;
  price: number;
  oldPrice?: number;
  images: string[];
  category: string;
  stock: number;
  rating?: number;
  numReviews?: number;
  featured?: boolean;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const { toggle, has } = useWishlist();
  const addItem = useCart((s) => s.addItem);

  const isWishlisted = has(product._id);
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const outOfStock = product.stock === 0;
  const lowStock = product.stock > 0 && product.stock < 5;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(product._id);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      stock: product.stock,
    });
    setAdded(true);
    toast.success('Added to cart');
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1.5 border border-slate-100"
    >
      <Link href={`/products/${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-slate-50 aspect-square border border-slate-100/50">
          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {discount > 0 && <Badge variant="danger">-{discount}%</Badge>}
            {product.isNew && <Badge variant="info">New</Badge>}
            {product.featured && <Badge variant="warning">⭐ Featured</Badge>}
            {outOfStock && <Badge variant="default">Sold Out</Badge>}
            {lowStock && <Badge variant="warning">Only {product.stock} left</Badge>}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 z-10 h-9 w-9 rounded-full flex items-center justify-center',
              'bg-white/90 backdrop-blur shadow-md transition-all',
              'hover:scale-110 active:scale-95',
              isWishlisted && 'bg-red-50'
            )}
            aria-label="Toggle wishlist"
          >
            <Heart
              size={18}
              className={cn(
                'transition-all',
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'
              )}
            />
          </button>

          {/* Skeleton while image loads */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
          )}

          {/* Product Image */}
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={cn(
              'object-cover transition-all duration-700',
              'group-hover:scale-110',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Second image on hover (if available) */}
          {product.images[1] && (
            <Image
              src={product.images[1]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Hover overlay with actions */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out p-3">
            <div className="flex gap-2">
              <button
                onClick={handleQuickAdd}
                disabled={outOfStock}
                className={cn(
                  'flex-1 h-11 rounded-xl font-medium text-sm flex items-center justify-center gap-2',
                  'bg-slate-900 text-white shadow-[0_4px_14px_0_rgb(0,0,0,0.2)]',
                  'hover:bg-indigo-600 active:scale-95 transition-all duration-300',
                  'disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none'
                )}
              >
                {added ? (
                  <>
                    <Check size={18} /> Added
                  </>
                ) : outOfStock ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>
              {onQuickView && (
                <button
                  onClick={handleQuickView}
                  className={cn(
                    'h-11 w-11 rounded-xl flex items-center justify-center',
                    'bg-white text-slate-700 shadow-[0_4px_14px_0_rgb(0,0,0,0.1)] hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all duration-300'
                  )}
                  aria-label="Quick view"
                >
                  <Eye size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 px-1 space-y-1.5">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{product.category}</p>
          <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
            {product.name}
          </h3>
          {product.rating !== undefined && (
            <Rating value={product.rating} count={product.numReviews} />
          )}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-slate-900 tracking-tight">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-slate-400 font-medium line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}