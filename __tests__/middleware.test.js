import { NextResponse } from 'next/server'
import middleware from '../middleware'
import { createRouteMatcher } from '@clerk/nextjs/server'

// Mock Clerk's createRouteMatcher
jest.mock('@clerk/nextjs/server', () => ({
  createRouteMatcher: jest.fn(),
  clerkMiddleware: (fn) => fn,
}))

describe('Authentication Middleware', () => {
  let mockAuth
  let mockReq

  beforeEach(() => {
    // Reset mocks before each test
    mockAuth = {
      userId: null,
      redirectToSignIn: jest.fn().mockResolvedValue({ url: '/sign-in' }),
    }

    mockReq = {
      url: 'http://localhost:3000/dashboard',
      nextUrl: new URL('http://localhost:3000/dashboard'),
    }

    // Mock the route matcher
    createRouteMatcher.mockReturnValue(() => true)
  })

  it('redirects to sign in for protected routes when user is not authenticated', async () => {
    mockAuth.userId = null
    mockAuth.redirectToSignIn.mockResolvedValue({ url: '/sign-in' })

    const response = await middleware(mockAuth, mockReq)
    expect(mockAuth.redirectToSignIn).toHaveBeenCalled()
  })

  it('allows access to protected routes for authenticated users', async () => {
    mockAuth.userId = 'test-user-id'
    
    const response = await middleware(mockAuth, mockReq)
    expect(response).toEqual(NextResponse.next())
  })

  it('allows access to public routes for non-authenticated users', async () => {
    mockAuth.userId = null
    createRouteMatcher.mockReturnValue(() => false)
    
    const response = await middleware(mockAuth, {
      ...mockReq,
      url: 'http://localhost:3000/',
      nextUrl: new URL('http://localhost:3000/'),
    })
    
    expect(response).toEqual(NextResponse.next())
  })

  describe('Protected Routes', () => {
    const protectedRoutes = [
      '/dashboard',
      '/resume',
      '/interview',
      '/ai-cover-letter',
      '/onboarding',
    ]

    protectedRoutes.forEach(route => {
      it(`requires authentication for ${route}`, async () => {
        mockAuth.userId = null
        mockReq.url = `http://localhost:3000${route}`
        mockReq.nextUrl = new URL(`http://localhost:3000${route}`)
        
        await middleware(mockAuth, mockReq)
        expect(mockAuth.redirectToSignIn).toHaveBeenCalled()
      })
    })
  })
}) 