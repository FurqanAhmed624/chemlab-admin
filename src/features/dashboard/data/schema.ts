import { z } from 'zod';

const statCardSchema = z.object({
  totalChemicals: z.number(),
  lowStockCount: z.number(),
  outOfStockCount: z.number(),
});

const activityDataPointSchema = z.object({
  date: z.string(), // "YYYY-MM"
  newlyAdded: z.number(),
  updated: z.number(),
});

const wasteStatCardSchema = z.object({
  totalRecords: z.number(),
  pendingCollection: z.number(),
  disposedCount: z.number(),
});

const wasteActivityDataPointSchema = z.object({
  date: z.string(),
  newlyCreated: z.number(),
});

export const analyticsSchema = z.object({
  chemicalAnalytics: z.object({
    stats: statCardSchema,
    activityLast3Months: z.array(activityDataPointSchema),
  }),
  wasteAnalytics: z.object({
    stats: wasteStatCardSchema,
    activityLast3Months: z.array(wasteActivityDataPointSchema),
  }),
});

export type AnalyticsData = z.infer<typeof analyticsSchema>;