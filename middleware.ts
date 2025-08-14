import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isValidAdminToken(token: string): boolean {
  try {
    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString())
    
    // Check if token is expired
    if (tokenData.expires < Date.now()) {
      return false
    }
    
    // Check if it's an admin token
    return tokenData.admin === true
  } catch {
    return false
  }
}

export function middleware(request: NextRequest) {
  // Only protect admin operations (POST, PUT, DELETE, PATCH), not public GET requests
  const isAdminOperation = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)
  
  // Check if it's an admin API route that needs protection
  if (request.nextUrl.pathname.startsWith('/api/') && 
      request.nextUrl.pathname !== '/api/admin/login' &&
      isAdminOperation &&
      (request.nextUrl.pathname.includes('/magazines') ||
       request.nextUrl.pathname.includes('/articles') ||
       request.nextUrl.pathname.includes('/categories') ||
       request.nextUrl.pathname.includes('/brand-images') ||
       request.nextUrl.pathname.includes('/youtube-videos') ||
       request.nextUrl.pathname.includes('/cover-photos') ||
       request.nextUrl.pathname.includes('/homepage-content'))) {
    
    // Check for admin token in headers
    const adminToken = request.headers.get('x-admin-token')
    
    if (!adminToken || !isValidAdminToken(adminToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*'
}