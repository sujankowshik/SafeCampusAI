import { getIncidentById } from '@/lib/firebase/firestore';
import { auth } from '@/lib/firebase/config';
import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { getRiskLevelColor, cn } from '@/lib/utils';
import Image from 'next/image';

type ReportDetailsPageProps = {
  params: { id: string };
};

export default async function ReportDetailsPage({ params }: ReportDetailsPageProps) {
  const incident = await getIncidentById(params.id);
  const userId = auth.currentUser?.uid;

  if (!incident || (incident.createdByUserId !== userId && !incident.isAnonymous)) {
    // Also check if the user is an admin in a real scenario
    notFound();
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-headline mb-2">{incident.title}</CardTitle>
              <CardDescription>
                Reported on {format(incident.createdAt.toDate(), 'PPP p')}
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-lg">{incident.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Incident Details</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Location:</strong> {incident.locationText}</p>
                <p><strong>Time of Incident:</strong> {format(incident.dateTime.toDate(), 'PPP p')}</p>
                <p><strong>Report Type:</strong> <span className="capitalize">{incident.reportType}</span></p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
            </div>
            {incident.adminNotes && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Admin Notes</h3>
                <p className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap">{incident.adminNotes}</p>
              </div>
            )}
            {incident.attachments && incident.attachments.length > 0 && (
                <div>
                    <h3 className="font-semibold text-lg mb-2">Attachments</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {incident.attachments.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                        <Image
                            src={url}
                            alt={`Attachment ${index + 1}`}
                            width={150}
                            height={150}
                            className="rounded-md object-cover aspect-square hover:opacity-80 transition-opacity"
                        />
                        </a>
                    ))}
                    </div>
                </div>
            )}
          </div>
          <div className="space-y-6">
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-xl font-headline">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Risk Level</h4>
                  <p className={cn('font-bold text-lg', getRiskLevelColor(incident.aiRiskLevel))}>
                    {incident.aiRiskLevel || 'Not available'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Category</h4>
                  <p className="capitalize">{incident.aiCategory || 'Not available'}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Summary</h4>
                  <p className="text-sm">{incident.aiSummary || 'Not available'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
