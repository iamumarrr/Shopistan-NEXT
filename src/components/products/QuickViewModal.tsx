'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, Minus, Plus, Check } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useCart } from '@/store/cartStore';
import { useWishlist } from '@/store/wishlistStore';
import Rating from '@/components/ui/Rating';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

interface QuickViewModalProps {
  product: any;
  open: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, open, onClose }: QuickViewModalProps) {
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  const addItem = useCart((s) => s.addItem);
  const { toggle, has } = useWishlist();

  if (!product) return null;
  const isWishlisted = has(product._id);
  const outOfStock = product.stock === 0;

  const handleAddToCart = () => {
    addItem({
      product: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: qty,
      stock: product.stock,
    });
    toast.success(`Added ${qty} item(s) to cart`);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/40 max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto"
            >
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/90 backdrop-blur shadow-md hover:bg-gray-100 flex items-center justify-center transition"
              >
                <X size={20} />
              </button>

              <div className="grid md:grid-cols-2 max-h-[90vh] overflow-y-auto">
                {/* Image Gallery */}
                <div className="bg-slate-50/50 p-6 md:p-8">
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100">
                    <Image
                      src={product.images[activeImage]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                  {product.images.length > 1 && (
                    <div className="flex gap-2 mt-4 overflow-x-auto">
                      {product.images.map((img: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            'relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition',
                            activeImage === i ? 'border-indigo-600' : 'border-transparent hover:border-gray-300'
                          )}
                        >
                          <Image src={img} alt="" fill sizes="64px" className="object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 md:p-8 flex flex-col">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</p>
                  <h2 className="text-2xl font-bold mt-1">{product.name}</h2>

                  {product.rating !== undefined && (
                    <div className="mt-2">
                      <Rating value={product.rating} count={product.numReviews} size={16} />
                    </div>
                  )}

                  <div className="flex items-baseline gap-3 mt-4">
                    <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
                    {product.oldPrice && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.oldPrice)}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-gray-600 leading-relaxed line-clamp-4">{product.description}</p>

                  <div className="mt-4">
                    {outOfStock ? (
                      <Badge variant="danger">Out of stock</Badge>
                    ) : product.stock < 5 ? (
                      <Badge variant="warning">Only {product.stock} left in stock</Badge>
                    ) : (
                      <Badge variant="success">In Stock</Badge>
                    )}
                  </div>

                  {/* Quantity */}
                  {!outOfStock && (
                    <div className="mt-6">
                      <label className="text-sm font-medium text-gray-700">Quantity</label>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                          <button
                            onClick={() => setQty(Math.max(1, qty - 1))}
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-12 text-center font-medium">{qty}</span>
                          <button
                            onClick={() => setQty(Math.min(product.stock, qty + 1))}
                            className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-auto pt-6 flex gap-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={outOfStock}
                      className="flex-1 h-12 rounded-xl bg-gray-900 text-white font-medium hover:bg-indigo-600 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={18} />
                      {outOfStock ? 'Sold Out' : 'Add to Cart'}
                    </button>
                    <button
                      onClick={() => toggle(product._id)}
                      className={cn(
                        'h-12 w-12 rounded-xl flex items-center justify-center border-2 transition',
                        isWishlisted
                          ? 'bg-red-50 border-red-200'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Heart
                        size={20}
                        className={cn(isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700')}
                      />
                    </button>
                  </div>

                  <Link
                    href={`/products/${product._id}`}
                    onClick={onClose}
                    className="text-center text-sm text-indigo-600 hover:underline mt-4"
                  >
                    View full details →
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}