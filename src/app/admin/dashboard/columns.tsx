'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { Incident } from '@/lib/types';
import { format } from 'date-fns';
import { getRiskLevelColor, cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

export const columns: ColumnDef<Incident>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <Badge variant="secondary">{row.getValue('status')}</Badge>,
  },
  {
    accessorKey: 'aiRiskLevel',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Risk Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className={cn('font-medium', getRiskLevelColor(row.getValue('aiRiskLevel')))}>
        {row.getValue('aiRiskLevel')}
      </div>
    ),
  },
  {
    accessorKey: 'aiCategory',
    header: 'AI Category',
    cell: ({ row }) => <div className="capitalize">{row.getValue('aiCategory')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Reported On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as { toDate: () => Date };
      return <div>{format(date.toDate(), 'PP')}</div>;
    },
  },
  {
    accessorKey: 'isAnonymous',
    header: 'Anonymous',
    cell: ({ row }) => (row.getValue('isAnonymous') ? 'Yes' : 'No'),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const incident = row.original;
      return (
        <div className="text-right">
            <Link href={`/admin/incidents/${incident.id}`}>
                <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                </Button>
            </Link>
        </div>
      );
    },
  },
];
