import { getAllIncidents } from '@/lib/firebase/firestore';
import { columns } from './columns';
import { DataTable } from './data-table';
import type { Incident } from '@/lib/types';
import { REPORT_STATUSES, RISK_LEVELS, REPORT_TYPES } from '@/lib/constants';

type AdminDashboardPageProps = {
  searchParams: {
    status?: string;
    risk?: string;
    category?: string;
    sort?: 'newest' | 'oldest' | 'risk';
    q?: string;
  };
};

export default async function AdminDashboardPage({ searchParams }: AdminDashboardPageProps) {
  const filters = {
    status: searchParams.status,
    riskLevel: searchParams.risk,
    category: searchParams.category,
  };
  const sortBy = searchParams.sort || 'newest';
  const searchQuery = searchParams.q || '';

  const incidents = await getAllIncidents(filters, sortBy, searchQuery);

  const categories = REPORT_TYPES;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-headline font-bold">Incidents Dashboard</h1>
      <p className="text-muted-foreground">
        View, filter, and manage all reported incidents.
      </p>
      <DataTable
        columns={columns}
        data={incidents as Incident[]}
        statuses={REPORT_STATUSES}
        riskLevels={RISK_LEVELS}
        categories={categories}
      />
    </div>
  );
}
