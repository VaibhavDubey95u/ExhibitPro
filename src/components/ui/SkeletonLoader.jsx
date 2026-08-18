export function SkeletonBox({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-white/10 rounded-xl ${className}`} />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <SkeletonBox className="h-56 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <SkeletonBox className="h-5 w-16 rounded-full" />
          <SkeletonBox className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function BlockSkeleton({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBox key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}
