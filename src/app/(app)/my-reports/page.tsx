import { getIncidentsForUser } from '@/lib/firebase/firestore';
import { auth } from '@/lib/firebase/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { format } from 'date-fns';
import { getRiskLevelColor, cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export default async function MyReportsPage() {
    // This is a server component, but auth state is needed.
    // In a real app, we'd get the user from a server-side session/cookie.
    // For this implementation, we will fetch on the client in a wrapper or rely on client-side routing protection.
    // The layout already protects this route client-side. We fetch assuming user is present.
    // A more robust solution would use server-side session management.

  const userId = auth.currentUser?.uid;
  if (!userId) {
    // This case should be handled by the layout redirecting, but as a fallback:
    return (
        <div className="container py-8">
            <Card>
                <CardHeader>
                    <CardTitle>My Reports</CardTitle>
                    <CardDescription>Please log in to see your reports.</CardDescription>
                </CardHeader>
            </Card>
        </div>
    );
  }

  const incidents = await getIncidentsForUser(userId);

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">My Reports</CardTitle>
          <CardDescription>
            Here is a list of incidents you have reported.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date Reported</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>AI Risk Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.length > 0 ? (
                incidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell className="font-medium">{incident.title}</TableCell>
                    <TableCell>
                      {format(incident.createdAt.toDate(), 'PPP')}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{incident.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn('font-semibold', getRiskLevelColor(incident.aiRiskLevel))}>
                        {incident.aiRiskLevel || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/reports/${incident.id}`} className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Report</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24">
                    You have not submitted any reports.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
