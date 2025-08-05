// src/features/chemicals/data/schema.ts

import { z } from 'zod';

/**
 * Zod schemas provide runtime validation and TypeScript type inference.
 * These schemas are now updated to match the enriched data from the
 * `getAllChemicalsWithHistory` GraphQL query.
 */

const chemicalStatusEnum = z.enum([
  'PENDING_REVIEW',
  'REJECTED',
  'IN_STOCK',
  'LOW_STOCK',
  'OUT_OF_STOCK'
]);

// UPDATED: This schema now includes all fields from the versionHistory object.
export const versionHistorySchema = z.object({
  id: z.string(),
  name: z.string(),
  status: chemicalStatusEnum,
  location: z.string(),
  changeReason: z.string(),
  created_at: z.number(), // Unix timestamp in milliseconds
  percentage: z.number().nullable(),
  dateStarted: z.number().nullable(),
  dateEnded: z.number().nullable(),
  containerType: z.string(),
  volumeOrMass: z.string(), // Received as a string like "1"
  unit: z.string(),
  safetyInstructions: z.string().nullable(),
  rfidTag: z.string().nullable(),
  invoicePdfUrl: z.string().url().nullable(),
  health: z.string(), // Received as a string like "3"
  flammability: z.string(), // Received as a string like "2"
  instability: z.string(), // Received as a string like "1"
  specialHazard: z.string().nullable(),
  readyForCollection: z.boolean(),
  changedBy: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const chemicalSchema = z.object({
  id: z.string(),
  created_at: z.number(), // Unix timestamp in milliseconds
  updated_at: z.number(), // Unix timestamp in milliseconds
  createdBy: z.object({
    id: z.string(),
    name: z.string(),
  }),
  updatedBy: z.object({
    id: z.string(),
    name: z.string(),
  }).nullable(),
  versionHistory: z.array(versionHistorySchema),
});

// --- Inferred types are now updated automatically ---
export type Chemical = z.infer<typeof chemicalSchema>;
export type VersionHistory = z.infer<typeof versionHistorySchema>;