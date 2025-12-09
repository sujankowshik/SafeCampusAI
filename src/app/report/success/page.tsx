'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export default function ReportSuccessPage() {
  const searchParams = useSearchParams();
  const reportId = searchParams.get('id');
  const isAnonymous = searchParams.get('anonymous') === 'true';

  return (
    <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="items-center">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-headline">Report Submitted</CardTitle>
          <CardDescription>
            Thank you for helping us keep our campus safe.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Your report has been received and will be reviewed shortly.</p>
          {!isAnonymous && reportId && (
            <div className="border bg-muted/50 p-4 rounded-md">
              <p className="text-sm text-muted-foreground">Your Tracking ID is:</p>
              <p className="font-mono text-lg font-semibold">{reportId}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAnonymous && (
              <Button asChild>
                <Link href="/my-reports">View My Reports</Link>
              </Button>
            )}
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
