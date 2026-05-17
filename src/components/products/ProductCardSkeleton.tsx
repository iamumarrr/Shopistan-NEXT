export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-1/3 bg-gray-200 rounded" />
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/4 bg-gray-200 rounded" />
        <div className="h-5 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}