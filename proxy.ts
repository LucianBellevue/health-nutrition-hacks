import { auth } from '@/lib/auth';

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Admin login page - redirect to dashboard if already logged in
  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return Response.redirect(new URL('/admin', req.url));
    }
    return;
  }

  // All other admin routes - require authentication
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return Response.redirect(loginUrl);
    }
    return;
  }

  // Admin API routes - require authentication
  if (pathname.startsWith('/api/admin')) {
    if (!isAuthenticated) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return;
  }
});

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
