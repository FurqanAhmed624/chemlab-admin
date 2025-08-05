'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Waste } from '../data/schema';

export function WasteHistoryModal({
                                    waste,
                                    onClose,
                                  }: {
  waste: Waste | null;
  onClose: () => void;
}) {
  if (!waste || !waste.versionHistory || waste.versionHistory.length === 0) {
    return null;
  }
  const latestVersion = waste.versionHistory[0];

  return (
    <Dialog open={!!waste} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl w-[90vw]">
        <DialogHeader>
          <DialogTitle>Version History for: {latestVersion.chemicalWasteName}</DialogTitle>
          <DialogDescription>
            Showing all changes for this waste record. Newest changes are at the top.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <div className="pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Date</TableHead>
                  <TableHead className="w-[150px]">Changed By</TableHead>
                  <TableHead className="w-[180px]">Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reason for Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waste.versionHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell>{new Date(history.created_at).toLocaleString()}</TableCell>
                    <TableCell>{history.changedBy.name}</TableCell>
                    <TableCell><Badge variant="secondary">{history.status.replace(/_/g, ' ')}</Badge></TableCell>
                    <TableCell>{history.placementLocation}</TableCell>
                    <TableCell className="break-words">{history.changeReason}</TableCell>
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