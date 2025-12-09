import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { REPORT_STATUSES, RISK_LEVELS, REPORT_TYPES } from '@/lib/constants';
import { AnalyticsCharts } from './charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart2, AlertTriangle, CheckCircle, List } from 'lucide-react';


async function getAnalyticsData() {
  const incidentsCol = collection(db, 'incidents');
  
  const totalSnap = await getCountFromServer(incidentsCol);
  const totalIncidents = totalSnap.data().count;

  const statusCounts = await Promise.all(
    REPORT_STATUSES.map(async (status) => {
      const q = query(incidentsCol, where('status', '==', status));
      const snap = await getCountFromServer(q);
      return { name: status, count: snap.data().count };
    })
  );

  const riskCounts = await Promise.all(
    RISK_LEVELS.map(async (level) => {
      const q = query(incidentsCol, where('aiRiskLevel', '==', level));
      const snap = await getCountFromServer(q);
      return { name: level, count: snap.data().count };
    })
  );

  const categoryCounts = await Promise.all(
    REPORT_TYPES.map(async (category) => {
      const q = query(incidentsCol, where('aiCategory', '==', category));
      const snap = await getCountFromServer(q);
      return { name: category, count: snap.data().count };
    })
  );

  return { totalIncidents, statusCounts, riskCounts, categoryCounts };
}


export default async function AnalyticsPage() {
  const { totalIncidents, statusCounts, riskCounts, categoryCounts } = await getAnalyticsData();
  const criticalAndHighCount = (riskCounts.find(r => r.name === 'Critical')?.count || 0) + (riskCounts.find(r => r.name === 'High')?.count || 0);
  const newAndReviewCount = (statusCounts.find(r => r.name === 'New')?.count || 0) + (statusCounts.find(r => r.name === 'Under Review')?.count || 0);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold">Analytics</h1>
      <p className="text-muted-foreground">
        An overview of incident reporting trends on campus.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
                <List className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalIncidents}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High/Critical Risk</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{criticalAndHighCount}</div>
            </CardContent>
        </Card>
         <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{newAndReviewCount}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{statusCounts.find(r => r.name === 'Resolved')?.count || 0}</div>
            </CardContent>
        </Card>
      </div>

      <AnalyticsCharts 
        categoryData={categoryCounts}
        riskData={riskCounts}
        statusData={statusCounts}
      />
    </div>
  );
}
