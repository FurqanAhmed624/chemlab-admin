// features/reports/data/schema.ts

import { z } from 'zod';

// Zod enum for the report status
export const reportStatusEnum = z.enum([
  'PENDING',
  'REVIEWED',
  'RESOLVED',
]);

// Zod schema for a single chemical report
export const reportSchema = z.object({
  id: z.string(),
  status: reportStatusEnum,
  createdAt: z.string(), // ISO date string
  user: z.object({
    id: z.string(),
    email: z.string(),
  }),
  chemical: z.object({
    id: z.string(),
    activeVersion: z.object({
      name: z.string(),
      status: z.string(),
      location: z.string(),
    }),
  }),
});

// Inferred TypeScript type for a ChemicalReport
export type ChemicalReport = z.infer<typeof reportSchema>;