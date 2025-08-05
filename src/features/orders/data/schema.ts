import { z } from 'zod';

// Zod enum created from the OrderStatus enum you provided
export const orderStatusEnum = z.enum([
  'PENDING',
  'APPROVED',
  'ORDERED',
  'RECEIVED',
  // You can add 'CANCELLED', 'SHIPPED', etc. here if they exist in your backend
]);

// Zod schema for a single orders, based on your OrderEntity
export const orderSchema = z.object({
  id: z.string(),
  chemicalName: z.string(),
  vendor: z.string().nullable(),
  quantity: z.number(),
  unit: z.string(),
  status: orderStatusEnum,
  created_at: z.number(), // Unix timestamp
  updated_at: z.number().nullable(), // Unix timestamp
});

// Inferred TypeScript type for an Order
export type Order = z.infer<typeof orderSchema>;