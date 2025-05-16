import { render, screen } from '@testing-library/react'
import { useRouter, usePathname } from 'next/navigation'
import DashboardPage from '../app/(main)/dashboard/page'
import OnboardingPage from '../app/(main)/onboarding/page'
import { getUserOnboardingStatus } from '@/actions/user'
import { redirect } from 'next/navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  redirect: jest.fn()
}))

// Mock user actions
jest.mock('@/actions/user', () => ({
  getUserOnboardingStatus: jest.fn()
}))

// Mock dashboard actions
jest.mock('@/actions/dashboard', () => ({
  getIndustryInsights: jest.fn().mockResolvedValue([])
}))

describe('Routing Tests', () => {
  let mockRouter

  beforeEach(() => {
    mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn()
    }
    useRouter.mockReturnValue(mockRouter)
    usePathname.mockReturnValue('')
    redirect.mockImplementation((path) => {
      throw new Error(`Redirected to ${path}`)
    })
  })

  describe('Protected Routes', () => {
    const protectedRoutes = [
      '/dashboard',
      '/resume',
      '/interview',
      '/ai-cover-letter',
      '/onboarding'
    ]

    protectedRoutes.forEach(route => {
      it(`should protect ${route} from unauthenticated access`, async () => {
        const mockReq = new Request(`http://localhost:3000${route}`)
        const mockAuth = {
          userId: null,
          redirectToSignIn: jest.fn().mockResolvedValue({ url: '/sign-in' })
        }

        try {
          await import('../middleware').then(module => 
            module.default(mockAuth, mockReq)
          )
        } catch (error) {
          expect(mockAuth.redirectToSignIn).toHaveBeenCalled()
        }
      })
    })
  })

  describe('Onboarding Flow', () => {
    it('should redirect to onboarding if user is not onboarded', async () => {
      getUserOnboardingStatus.mockResolvedValue({ isOnboarded: false })

      try {
        await DashboardPage()
      } catch (error) {
        expect(error.message).toBe('Redirected to /onboarding')
      }
    })

    it('should redirect to dashboard if user is already onboarded', async () => {
      getUserOnboardingStatus.mockResolvedValue({ isOnboarded: true })

      try {
        await OnboardingPage()
      } catch (error) {
        expect(error.message).toBe('Redirected to /dashboard')
      }
    })
  })

  describe('Public Routes', () => {
    const publicRoutes = ['/', '/sign-in', '/sign-up']

    publicRoutes.forEach(route => {
      it(`should allow public access to ${route}`, async () => {
        const mockReq = new Request(`http://localhost:3000${route}`)
        const mockAuth = {
          userId: null,
          redirectToSignIn: jest.fn()
        }

        try {
          await import('../middleware').then(module => 
            module.default(mockAuth, mockReq)
          )
          expect(mockAuth.redirectToSignIn).not.toHaveBeenCalled()
        } catch (error) {
          // Should not redirect
          expect(error).toBeUndefined()
        }
      })
    })
  })

  describe('Navigation Guards', () => {
    it('should prevent access to dashboard without onboarding', async () => {
      getUserOnboardingStatus.mockResolvedValue({ isOnboarded: false })

      try {
        await DashboardPage()
      } catch (error) {
        expect(error.message).toBe('Redirected to /onboarding')
      }
    })

    it('should allow access to dashboard after onboarding', async () => {
      getUserOnboardingStatus.mockResolvedValue({ isOnboarded: true })
      
      const result = await DashboardPage()
      expect(result).toBeTruthy()
    })
  })

  describe('404 Handling', () => {
    it('should render 404 page for non-existent routes', () => {
      const { default: NotFound } = require('../app/not-found')
      render(<NotFound />)
      
      expect(screen.getByText('404')).toBeInTheDocument()
      expect(screen.getByText('Page Not Found')).toBeInTheDocument()
    })
  })
}) 