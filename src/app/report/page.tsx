import { ReportForm } from './report-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ReportPage() {
  return (
    <div className="container py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Report an Incident</CardTitle>
          <CardDescription>
            Your report helps us maintain a safe campus environment. Please provide as much detail as possible.
            <br />
            All reports are treated with confidentiality.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportForm />
        </CardContent>
      </Card>
    </div>
  );
}
