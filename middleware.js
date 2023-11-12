// Import necessary modules
import { NextRequest, NextResponse } from 'next/server';
import authMiddleware from 'next-auth/middleware';

// Middleware function
export async function middleware(request) {
  const retrievalPathPattern = /^\/api\/retrieval\/(.*)$/;
  // Check if the request URL matches "/api/retrieval/database" and the method is "POST"
  if (request.method == 'POST' && request.nextUrl.pathname === '/api/retrieval/database') {
  }
  // Check if the request URL matches the retrieval path pattern and the method is "GET"
  else if (retrievalPathPattern.test(request.nextUrl.pathname)) {
    // Your logic for handling GET requests to "/api/retrieval/" goes here
    return authMiddleware(request);
  }
  // For other cases, let NextAuth handle the middleware

}
