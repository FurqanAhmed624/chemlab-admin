
import { z } from 'zod';

/**
 * Zod schemas provide runtime validation and TypeScript type inference for your data.
 * These schemas should precisely match the structure of the data returned by your GraphQL queries.
 */

// Schema for a single Permission object
export const permissionSchema = z.object({
  id: z.string().optional(), // id might not always be queried
  name: z.string(),
});

// Schema for a single Role object, which includes its permissions
export const roleSchema = z.object({
  id: z.string().optional(), // id might not always be queried
  name: z.string(),
  permissions: z.array(permissionSchema).optional(), // Permissions are optional
});

// Schema for the main User object, which includes its roles
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().url().nullable(),
  phone: z.string().nullable().optional(),
  is_active: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  roles: z.array(roleSchema).optional(), // Roles are optional
  created_at: z.preprocess((arg) => {
    if (typeof arg === 'number') return new Date(arg);
    return null; // Return null for any other type
  }, z.date().nullable()).optional(),

  updated_at: z.preprocess((arg) => {
    if (typeof arg === 'number') return new Date(arg);
    return null;
  }, z.date().nullable()).optional(),
});

// This creates a TypeScript type from the Zod schema, which you can use throughout your app.
export type User = z.infer<typeof userSchema>;