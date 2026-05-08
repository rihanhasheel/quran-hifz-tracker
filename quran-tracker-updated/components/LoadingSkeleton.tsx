export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="skeleton h-4 w-20 rounded mb-2" />
          <div className="skeleton h-5 w-40 rounded" />
        </div>
        <div className="skeleton h-6 w-16 rounded-full" />
      </div>
      <div className="divider-gradient mb-4" />
      <div className="skeleton h-4 w-32 rounded mb-4" />
      <div className="skeleton h-9 w-28 rounded-lg" />
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-bg-border border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-muted text-sm">Loading your dashboard...</p>
      </div>
    </div>
  );
}
