import { getIncidentById } from '@/lib/firebase/firestore';
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
import { UpdateIncidentForm } from './update-form';

type AdminIncidentDetailsPageProps = {
  params: { id: string };
};

export default async function AdminIncidentDetailsPage({ params }: AdminIncidentDetailsPageProps) {
  const incident = await getIncidentById(params.id);

  if (!incident) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
            <h1 className="text-3xl font-headline font-bold mb-1">{incident.title}</h1>
            <p className="text-muted-foreground">
                Reported on {format(incident.createdAt.toDate(), 'PPP p')}
            </p>
        </div>
        <Badge variant="secondary" className="text-lg">{incident.status}</Badge>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Incident Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <p><strong>Location:</strong> {incident.locationText}</p>
                        <p><strong>Time of Incident:</strong> {format(incident.dateTime.toDate(), 'PPP p')}</p>
                        <p><strong>Report Type:</strong> <span className="capitalize">{incident.reportType}</span></p>
                        <p><strong>Submitted Anonymously:</strong> {incident.isAnonymous ? 'Yes' : 'No'}</p>
                        {!incident.isAnonymous && incident.allowFollowUp && (
                            <p><strong>Contact Email:</strong> {incident.contactEmail}</p>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-base mb-2">Description</h3>
                        <p className="text-sm whitespace-pre-wrap">{incident.description}</p>
                    </div>
                    {incident.attachments && incident.attachments.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-base mb-2">Attachments</h3>
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
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <UpdateIncidentForm incident={incident} />
                </CardContent>
            </Card>
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
      </div>
    </div>
  );
}
