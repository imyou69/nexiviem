import { render, screen } from '@testing-library/react'
import Header from '../components/header'
import { ThemeProvider } from 'next-themes'

// Mock the auth component
jest.mock('@clerk/nextjs', () => ({
  auth: () => ({ userId: 'test-user-id' }),
  ClerkProvider: ({ children }) => <div>{children}</div>,
  useUser: () => ({
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      fullName: 'Test User',
    },
  }),
}))

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Header />
      </ThemeProvider>
    )
  }

  it('renders the header component', () => {
    renderHeader()
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders the logo/brand name', () => {
    renderHeader()
    expect(screen.getByText(/NexiView/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    renderHeader()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
}) 