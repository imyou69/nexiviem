import { render, screen } from '@testing-library/react'
import Header from '../components/header'
import { ThemeProvider } from 'next-themes'

// Mock Clerk components and hooks
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }) => <div data-testid="signed-out">{children}</div>,
  SignInButton: ({ children }) => (
    <button data-testid="sign-in-button">{children}</button>
  ),
  UserButton: () => <button data-testid="user-button">User Menu</button>,
  auth: () => ({ userId: 'test-user-id' }),
}))

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('Authentication UI Components', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {component}
      </ThemeProvider>
    )
  }

  describe('Header Authentication Elements', () => {
    it('shows sign in button for unauthenticated users', () => {
      renderWithTheme(<Header />)
      const signInButton = screen.getByTestId('sign-in-button')
      expect(signInButton).toBeInTheDocument()
      expect(signInButton).toHaveTextContent('Sign in')
    })

    it('shows user button for authenticated users', () => {
      renderWithTheme(<Header />)
      const userButton = screen.getByTestId('user-button')
      expect(userButton).toBeInTheDocument()
    })

    it('shows dashboard link for authenticated users', () => {
      renderWithTheme(<Header />)
      const dashboardLink = screen.getByRole('link', { name: /industry insights/i })
      expect(dashboardLink).toBeInTheDocument()
    })

    it('shows growth tools dropdown for authenticated users', () => {
      renderWithTheme(<Header />)
      const growthTools = screen.getByText(/growth tools/i)
      expect(growthTools).toBeInTheDocument()
    })
  })

  describe('Authentication State Visibility', () => {
    it('renders SignedIn content when user is authenticated', () => {
      renderWithTheme(<Header />)
      const signedInContent = screen.getByTestId('signed-in')
      expect(signedInContent).toBeInTheDocument()
    })

    it('renders SignedOut content when user is not authenticated', () => {
      renderWithTheme(<Header />)
      const signedOutContent = screen.getByTestId('signed-out')
      expect(signedOutContent).toBeInTheDocument()
    })
  })
}) 