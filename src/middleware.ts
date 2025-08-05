import { NextRequest, NextResponse } from 'next/server';

const GQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Part 1: GraphQL Proxy Logic ---
  if (pathname.startsWith('/graphql')) {
    if (!GQL_ENDPOINT) {
      console.error("GraphQL endpoint is not configured in middleware.");
      return new Response('GraphQL endpoint is not configured.', { status: 500 });
    }

    try {
      const authToken = request.cookies.get('auth_token')?.value;
      const headers = new Headers(request.headers);

      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }

      // --- THE FIX IS HERE ---
      // Read the request body as a buffer. This is a common and safe way to
      // handle incoming stream bodies in Node.js/Edge environments.
      let requestBody = null;
      if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
        // Read the body as ArrayBuffer to handle various content types
        requestBody = await request.arrayBuffer();
        // Ensure Content-Length is set correctly if sending ArrayBuffer
        headers.set('Content-Length', requestBody.byteLength.toString());
      }
      // --- END OF FIX ---

      const response = await fetch(GQL_ENDPOINT, {
        method: request.method,
        headers: headers,
        body: requestBody, // Pass the read body
      });

      return response; // Return the response directly

    } catch (error) {
      console.error("Error in GraphQL proxy middleware:", error);
      return new Response('Error proxying GraphQL request.', { status: 502 });
    }
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};