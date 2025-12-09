'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || isAdmin)) {
      router.push('/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || isAdmin) {
    return (
        <div className="container py-8 space-y-4">
            <Skeleton className="h-12 w-1/4" />
            <Skeleton className="h-96 w-full" />
        </div>
    );
  }

  return <div>{children}</div>;
}
