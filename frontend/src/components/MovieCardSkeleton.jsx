export default function MovieCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-dark-800"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-800 rounded w-3/4"></div>
        <div className="h-3 bg-dark-800 rounded w-1/2"></div>
      </div>
    </div>
  );
}
