import { Skeleton } from '@/components/ui/skeleton';

export function BuildCardSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border clip-corner overflow-hidden">
      <Skeleton className="w-full h-52 rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4 rounded-none" />
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-5/6 rounded-none" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-full rounded-none" />
          <Skeleton className="h-3 w-2/3 rounded-none" />
        </div>
        <Skeleton className="h-9 w-full rounded-none mt-2" />
      </div>
    </div>
  );
}

export function BuildsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 items-stretch">
      {Array.from({ length: count }).map((_, i) => (
        <BuildCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col bg-card border border-border clip-corner overflow-hidden">
      <Skeleton className="w-full h-44 rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-4/5 rounded-none" />
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-2/3 rounded-none" />
        <div className="flex justify-between pt-3">
          <Skeleton className="h-3 w-24 rounded-none" />
          <Skeleton className="h-3 w-16 rounded-none" />
        </div>
      </div>
    </div>
  );
}

export function ArticlesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-3/4 rounded-none" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-28 rounded-none" />
        <Skeleton className="h-4 w-28 rounded-none" />
      </div>
      <Skeleton className="w-full h-72 rounded-none" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-5/6 rounded-none" />
        <Skeleton className="h-4 w-full rounded-none" />
        <Skeleton className="h-4 w-2/3 rounded-none" />
      </div>
    </div>
  );
}
