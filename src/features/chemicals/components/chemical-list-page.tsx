'use client';

import React, { useState, useMemo } from 'react';
// UPDATED: Import useMutation and toast
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

// UI Component Imports
import { Badge } from '@/components/ui/badge';
// UPDATED: Import Button for the new revert button
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataTableSkeleton } from '@/components/ui/table/data-table-skeleton';
import { DataTablePagination } from '@/components/ui/table/data-table-pagination';

// Local project-specific imports
import { Chemical, VersionHistory } from '../data/schema';
import { ChemicalColumn, columns } from './columns';
// UPDATED: Import the new mutation and its types
import {
  GET_ALL_CHEMICALS_WITH_HISTORY as GET_ALL_CHEMICALS,
  GetAllChemicalsData,
  GetAllChemicalsVars,
  REVERT_CHEMICAL,
  RevertChemicalData,
  RevertChemicalVars,
} from '../graphql/queries';
import { IconHistory } from '@tabler/icons-react';


// =======================================================================
// === UPDATED: ChemicalHistoryModal Component ===
// =======================================================================
function ChemicalHistoryModal({
                                chemical,
                                onClose,
                                onRevert,
                                isReverting,
                              }: {
  chemical: Chemical | null;
  onClose: () => void;
  // --- NEW PROPS ---
  onRevert: (versionId: string) => void;
  isReverting: boolean;
}) {
  if (!chemical || !chemical.versionHistory || chemical.versionHistory.length === 0) {
    return null;
  }

  const activeVersionId = chemical.versionHistory[0]?.id;

  return (
    <Dialog open={!!chemical} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Version History for: {chemical.versionHistory[0].name}</DialogTitle>
          <DialogDescription>
            Showing all changes for this chemical. You can revert to a previous state.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[70vh]">
          <div className="pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead>Changed By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Vol./Mass</TableHead>
                  <TableHead>NFPA</TableHead>
                  <TableHead className="min-w-[200px]">Reason for Change</TableHead>
                  {/* --- NEW HEADER --- */}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chemical.versionHistory.map((history: VersionHistory) => (
                  <TableRow key={history.id}>
                    <TableCell>{new Date(history.created_at).toLocaleString()}</TableCell>
                    <TableCell>{history.changedBy.name}</TableCell>
                    <TableCell><Badge variant="secondary">{history.status.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell>{history.location}</TableCell>
                    <TableCell>{`${history.volumeOrMass} ${history.unit}`}</TableCell>
                    <TableCell className="font-mono">H:{history.health} F:{history.flammability} I:{history.instability}</TableCell>
                    <TableCell className="break-words">{history.changeReason}</TableCell>
                    {/* --- NEW CELL WITH REVERT BUTTON LOGIC --- */}
                    <TableCell className="text-right">
                      {history.id === activeVersionId ? (
                        <Badge>Active</Badge>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRevert(history.id)}
                          disabled={isReverting}
                        >
                          <IconHistory className="mr-2 h-4 w-4" />
                          {isReverting ? 'Reverting...' : 'Revert'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


// =======================================================================
// === UPDATED: ChemicalListPage Main Component ===
// =======================================================================
export default function ChemicalListPage() {
  const [selectedChemical, setSelectedChemical] = useState<Chemical | null>(null);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const queryVariables = useMemo<GetAllChemicalsVars>(() => ({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  }), [pagination]);

  // UPDATED: Added refetch to the useQuery hook
  const { data, loading, error, refetch } = useQuery<GetAllChemicalsData, GetAllChemicalsVars>(
    GET_ALL_CHEMICALS,
    { variables: queryVariables }
  );

  // --- NEW: useMutation hook for reverting a chemical ---
  const [revertChemical, { loading: revertLoading }] = useMutation<RevertChemicalData, RevertChemicalVars>(
    REVERT_CHEMICAL,
    {
      onCompleted: (data) => {
        toast.success(`Successfully reverted chemical to a previous version.`);
        refetch(); // Refetch the main list to show the updated state
        setSelectedChemical(null); // Close the modal on success
      },
      onError: (error) => {
        toast.error(`Failed to revert: ${error.message}`);
      }
    }
  );

  // --- NEW: Handler function to be passed to the modal ---
  const handleRevert = (versionId: string) => {
    if (!selectedChemical) return; // Safety check

    revertChemical({
      variables: {
        input: {
          chemicalId: selectedChemical.id,
          versionId: versionId,
        }
      }
    });
  };

  const viewHistory = (chemical: Chemical) => {
    setSelectedChemical(chemical);
  };

  const tableData = useMemo<ChemicalColumn[]>(() => {
    const chemicals = data?.getAllChemicalsWithHistory.items ?? [];
    return chemicals.map((chemical) => ({
      ...chemical,
      viewHistory,
    }));
  }, [data]);

  const pageCount = data ? Math.ceil(data.getAllChemicalsWithHistory.count / pagination.pageSize) : -1;

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
      {/* ... (The main table remains unchanged) ... */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: pagination.pageSize }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {columns.map((col, j) => (
                    <TableCell key={`skeleton-cell-${j}`}>
                      <div className="h-4 bg-muted rounded animate-pulse" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pageCount > 0 && <DataTablePagination table={table} />}
      batay
      <ChemicalHistoryModal
        chemical={selectedChemical}
        onClose={() => setSelectedChemical(null)}
        onRevert={handleRevert}
        isReverting={revertLoading}
      />
    </div>
  );
}