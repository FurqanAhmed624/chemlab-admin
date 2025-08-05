'use server';

import { cookies } from 'next/headers';

export async function createAuthSession(token: string) {
  (await cookies()).set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
}

export async function clearAuthSession() {
  (await cookies()).delete('auth_token');
}