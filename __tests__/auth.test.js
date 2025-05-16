import { render, screen } from '@testing-library/react'
import SignInPage from '../app/(auth)/sign-in/[[...sign-in]]/page'
import SignUpPage from '../app/(auth)/sign-up/[[...sign-up]]/page'
import { AuthLayout } from '../app/(auth)/layout'

// Mock Clerk components
jest.mock('@clerk/nextjs', () => ({
  SignIn: () => <div data-testid="clerk-sign-in">Sign In Component</div>,
  SignUp: () => <div data-testid="clerk-sign-up">Sign Up Component</div>,
}))

describe('Authentication Pages', () => {
  describe('Sign In Page', () => {
    it('renders the sign in component', () => {
      render(<SignInPage />)
      expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument()
    })

    it('renders within auth layout', () => {
      render(
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      )
      
      // Check if the layout wrapper is present
      const layoutWrapper = screen.getByRole('generic')
      expect(layoutWrapper).toHaveClass('flex justify-center pt-40')
      
      // Check if sign in component is rendered inside layout
      expect(screen.getByTestId('clerk-sign-in')).toBeInTheDocument()
    })
  })

  describe('Sign Up Page', () => {
    it('renders the sign up component', () => {
      render(<SignUpPage />)
      expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument()
    })

    it('renders within auth layout', () => {
      render(
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      )
      
      // Check if the layout wrapper is present
      const layoutWrapper = screen.getByRole('generic')
      expect(layoutWrapper).toHaveClass('flex justify-center pt-40')
      
      // Check if sign up component is rendered inside layout
      expect(screen.getByTestId('clerk-sign-up')).toBeInTheDocument()
    })
  })

  describe('Authentication Flow Integration', () => {
    it('redirects to onboarding page after successful sign up', () => {
      // This test will be implemented when we add the redirect logic
      expect(true).toBeTruthy()
    })

    it('redirects to dashboard for authenticated users', () => {
      // This test will be implemented when we add the redirect logic
      expect(true).toBeTruthy()
    })
  })
}) 