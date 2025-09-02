// features/reports/components/report-list-page.tsx

'use client';

import React, { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

import { ChemicalReport, reportStatusEnum } from '../data/schema';
import { ReportColumn, columns } from './columns';
import { FETCH_CHEMICAL_REPORTS, UPDATE_CHEMICAL_REPORT_STATUS, FetchChemicalReportsData, FetchChemicalReportsVars, UpdateChemicalReportStatusData, UpdateChemicalReportStatusVars } from '../graphql/queries';
import { DateRange } from 'react-day-picker';
import { IconCalendar, IconX } from '@tabler/icons-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

function UpdateStatusDialog({
                              report,
                              onClose,
                              onUpdate,
                              loading
                            }: {
  report: ChemicalReport | null;
  onClose: () => void;
  onUpdate: (reportId: string, status: string) => void;
  loading: boolean;
}) {
  const [newStatus, setNewStatus] = useState<string>(report?.status || '');

  if (!report) return null;

  const handleSubmit = () => {
    onUpdate(report.id, newStatus);
  };

  return (
    <Dialog open={!!report} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Report Status</DialogTitle>
          <DialogDescription>
            Change the status for the report on "{report.chemical.activeVersion.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select a new status" />
            </SelectTrigger>
            <SelectContent>
              {reportStatusEnum.options.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading || newStatus === report.status}>
            {loading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ReportListPage() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [reportToUpdate, setReportToUpdate] = useState<ChemicalReport | null>(null);

  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();


  const queryVariables = useMemo<FetchChemicalReportsVars>(() => {
    const filters: FetchChemicalReportsVars['filters'] = {};

    if (statusFilter) {
      filters.status = statusFilter;
    }
    if (dateFilter?.from) {
      filters.startDate = dateFilter.from.toISOString();
    }
    // Set end of day for the 'to' date for inclusive search
    if (dateFilter?.to) {
      const endDate = new Date(dateFilter.to);
      endDate.setHours(23, 59, 59, 999);
      filters.endDate = endDate.toISOString();
    }

    return {
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      // Only include the filters object if it has keys
      ...(Object.keys(filters).length > 0 && { filters }),
    };
  }, [pagination, statusFilter, dateFilter]);


  const { data, loading, error, refetch } = useQuery<FetchChemicalReportsData, FetchChemicalReportsVars>(
    FETCH_CHEMICAL_REPORTS,
    { variables: queryVariables }
  );

  const handleFilterChange = (updater: () => void) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    updater();
  };

  const isFiltered = statusFilter !== '' || !!dateFilter;

  const [updateReportStatus, { loading: updateLoading }] = useMutation<UpdateChemicalReportStatusData, UpdateChemicalReportStatusVars>(
    UPDATE_CHEMICAL_REPORT_STATUS,
    {
      onCompleted: () => {
        toast.success('Report status updated successfully!');
        refetch(); // Refetch the list to show the new status
        setReportToUpdate(null); // Close the dialog
      },
      onError: (err) => {
        toast.error(`Failed to update report: ${err.message}`);
      }
    }
  );

  const handleUpdate = (reportId: string, status: string) => {
    updateReportStatus({ variables: { reportId, status } });
  };

  const openUpdateDialog = (report: ChemicalReport) => {
    setReportToUpdate(report);
  };

  const tableData = useMemo<ReportColumn[]>(() => {
    const reports = data?.fetchReportChemicals.items ?? [];
    return reports.map((report) => ({
      ...report,
      openUpdateDialog, // Inject the function into each row's data
    }));
  }, [data]);

  const pageCount = data ? Math.ceil(data.fetchReportChemicals.count / pagination.pageSize) : -1;

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: { pagination },
    onPaginationChange: setPagination,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  if (error) {
    return (
      <div className='flex items-center justify-center h-48 rounded-md border'>
        <p className='text-red-500'>Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value) => handleFilterChange(() => setStatusFilter(value === 'ALL' ? '' : value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {reportStatusEnum.options.map((status) => (
              <SelectItem key={status} value={status}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'w-[280px] justify-start text-left font-normal',
                !dateFilter && 'text-muted-foreground'
              )}
            >
              <IconCalendar className="mr-2 h-4 w-4" />
              {dateFilter?.from ? (
                dateFilter.to ? (
                  <>
                    {format(dateFilter.from, 'LLL dd, y')} -{' '}
                    {format(dateFilter.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateFilter.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateFilter?.from}
              selected={dateFilter}
              onSelect={(range) => handleFilterChange(() => setDateFilter(range))}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => handleFilterChange(() => {
              setStatusFilter('');
              setDateFilter(undefined);
            })}
            className="h-9 px-2 lg:px-3"
          >
            Reset
            <IconX className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(pagination.pageSize)].map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col, j) => (
                    <TableCell key={`skeleton-cell-${j}`}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>No reports found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 0 && <DataTablePagination table={table} />}

      <UpdateStatusDialog
        report={reportToUpdate}
        onClose={() => setReportToUpdate(null)}
        onUpdate={handleUpdate}
        loading={updateLoading}
      />
    </div>
  );
}