import { inngest } from '@/lib/inngest/client'
import { generateIndustryInsights } from '@/lib/inngest/functions'
import { serve } from 'inngest/next'

// Mock Inngest
jest.mock('inngest/next', () => ({
  serve: jest.fn(),
  Inngest: jest.fn()
}))

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findMany: jest.fn(),
      update: jest.fn()
    },
    industryInsight: {
      create: jest.fn(),
      findFirst: jest.fn()
    }
  }
}))

describe('Inngest Functions', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('generateIndustryInsights', () => {
    it('should trigger industry insights generation', async () => {
      const mockEvent = {
        data: {
          userId: 'test-user-id',
          industry: 'technology'
        }
      }

      await generateIndustryInsights.fn({ event: mockEvent, step: jest.fn() })

      // Verify that the function was called with correct parameters
      expect(serve).toHaveBeenCalledWith({
        client: inngest,
        functions: expect.arrayContaining([generateIndustryInsights])
      })
    })

    it('should handle errors gracefully', async () => {
      const mockEvent = {
        data: {
          userId: 'test-user-id',
          industry: 'technology'
        }
      }

      // Mock a failure scenario
      const mockError = new Error('API Error')
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(mockError)

      await generateIndustryInsights.fn({ event: mockEvent, step: jest.fn() })

      // Verify error handling
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('Inngest API Routes', () => {
    it('should expose correct HTTP methods', () => {
      const { GET, POST, PUT } = require('@/app/api/inngest/route')
      expect(GET).toBeDefined()
      expect(POST).toBeDefined()
      expect(PUT).toBeDefined()
    })

    it('should handle incoming events', async () => {
      const mockRequest = new Request('http://localhost:3000/api/inngest', {
        method: 'POST',
        body: JSON.stringify({
          name: 'generate.industry.insights',
          data: {
            userId: 'test-user-id',
            industry: 'technology'
          }
        })
      })

      const { POST } = require('@/app/api/inngest/route')
      const response = await POST(mockRequest)
      expect(response.status).toBe(200)
    })
  })
}) 