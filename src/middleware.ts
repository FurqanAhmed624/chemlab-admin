import { NextRequest, NextResponse } from 'next/server';

// The URL of your actual NestJS GraphQL backend
const GQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Part 1: GraphQL Proxy Logic ---
  // If the request is for our special /graphql path, act as a proxy.
  if (pathname.startsWith('/graphql')) {
    if (!GQL_ENDPOINT) {
      return new Response('GraphQL endpoint is not configured.', { status: 500 });
    }

    // 1. Get the auth token from the secure, httpOnly cookie.
    const authToken = request.cookies.get('auth_token')?.value;

    // 2. Create new headers, copying existing ones.
    const headers = new Headers(request.headers);
    if (authToken) {
      // 3. Add the Authorization header that the NestJS backend expects.
      headers.set('Authorization', `Bearer ${authToken}`);
    }

    // 4. Rewrite the URL to point to the real backend and forward the request.
    const response = await fetch(GQL_ENDPOINT, {
      method: request.method,
      headers,
      body: request.body,
    });

    // 5. Stream the response back to the client.
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  }

  // --- Part 2: Page Protection Logic (remains the same) ---
  const authToken = request.cookies.get('auth_token')?.value;
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboardPage = pathname.startsWith('/dashboard');

  if (isDashboardPage && !authToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /* Match all paths except for Next.js internal paths and static assets */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};