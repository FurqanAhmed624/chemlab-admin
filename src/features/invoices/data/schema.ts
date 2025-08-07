import { z } from 'zod';

// Zod schema for a single invoice, matching your InvoiceEntity
export const invoiceSchema = z.object({
  id: z.string(),
  s3Key: z.string(),
  originalFilename: z.string(),
  mimeType: z.string(),
  referenceText: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.number(), // Unix timestamp
});

// Inferred TypeScript type for an Invoice
export type Invoice = z.infer<typeof invoiceSchema>;