// src/app/page.tsx

import { redirect } from 'next/navigation';

/**
 * The root page now simply redirects to the main dashboard overview.
 */
export default function RootPage() {
  redirect('/dashboard/overview');
}