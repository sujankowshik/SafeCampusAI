'use client';

import Link from 'next/link';
import { Shield } from 'lucide-react';
import { UserNav } from './user-nav';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 mr-8">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-headline font-bold text-lg">SafeCampus AI</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-4">
          {!loading && (
            <>
              {user ? (
                <UserNav />
              ) : (
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
