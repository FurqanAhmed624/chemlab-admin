import { z } from 'zod';

/**
 * Zod schemas for the Waste module, updated with correct date handling.
 */

const wasteStatusEnum = z.enum([
  'PENDING_APPROVAL',
  'REJECTED',
  'READY_FOR_COLLECTION',
  'DISPOSED',
]);

export const wasteVersionHistorySchema = z.object({
  id: z.string(),
  chemicalWasteName: z.string(),
  status: wasteStatusEnum,
  percentage: z.number().nullable(),

  // --- THIS IS THE FIX ---
  // We explicitly check if the argument is a string or number before creating a Date.
  // This satisfies TypeScript's strict type checking.
  dateStarted: z.preprocess((arg) => {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return new Date(arg);
    }
    return null; // Return null for any other type
  }, z.date().nullable()),

  dateEnded: z.preprocess((arg) => {
    if (typeof arg === 'string' || typeof arg === 'number') {
      return new Date(arg);
    }
    return null;
  }, z.date().nullable()),
  // --- END OF FIX ---

  containerType: z.string(),
  volumeOrMass: z.string(),
  unit: z.string(),
  placementLocation: z.string().nullable(),
  notifyAdmin: z.boolean().nullable(),
  changeReason: z.string(),

  health: z.string().nullable(),
  flammability: z.string().nullable(),
  instability: z.string().nullable(),
  specialHazard: z.string().nullable(),

  created_at: z.number(),
  changedBy: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
});

export const wasteSchema = z.object({
  id: z.string(),
  created_at: z.number(),
  updated_at: z.number(),
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  updatedBy: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  versionHistory: z.array(wasteVersionHistorySchema),
});

export type Waste = z.infer<typeof wasteSchema>;
export type WasteVersionHistory = z.infer<typeof wasteVersionHistorySchema>;