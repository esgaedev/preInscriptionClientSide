interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = 'h-4 w-full' }: SkeletonProps) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export function FieldSkeleton() {
  return (
    <div className="w-full">
      <Skeleton className="mb-1.5 h-3.5 w-24" />
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  );
}
