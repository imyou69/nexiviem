import { prisma } from '@/lib/prisma'
import { getUserOnboardingStatus } from '@/actions/user'
import { getIndustryInsights } from '@/actions/dashboard'

// Mock Prisma client
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    industryInsight: {
      findFirst: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn()
    }
  }
}))

describe('Database Operations', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  describe('User Operations', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      isOnboarded: true,
      industry: 'technology'
    }

    it('should check user onboarding status', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser)
      
      const result = await getUserOnboardingStatus()
      expect(result.isOnboarded).toBe(true)
      expect(prisma.user.findUnique).toHaveBeenCalled()
    })

    it('should handle non-existent user', async () => {
      prisma.user.findUnique.mockResolvedValue(null)
      
      const result = await getUserOnboardingStatus()
      expect(result.isOnboarded).toBe(false)
    })

    it('should update user information', async () => {
      const updateData = {
        industry: 'healthcare',
        isOnboarded: true
      }

      prisma.user.update.mockResolvedValue({ ...mockUser, ...updateData })
      
      const result = await prisma.user.update({
        where: { id: mockUser.id },
        data: updateData
      })

      expect(result.industry).toBe('healthcare')
      expect(result.isOnboarded).toBe(true)
    })
  })

  describe('Industry Insights Operations', () => {
    const mockInsight = {
      id: 'insight-1',
      userId: 'test-user-id',
      industry: 'technology',
      content: 'Test insight content'
    }

    it('should fetch industry insights', async () => {
      prisma.industryInsight.findMany.mockResolvedValue([mockInsight])
      
      const insights = await getIndustryInsights()
      expect(insights).toHaveLength(1)
      expect(insights[0].industry).toBe('technology')
    })

    it('should create new industry insight', async () => {
      prisma.industryInsight.create.mockResolvedValue(mockInsight)
      
      const result = await prisma.industryInsight.create({
        data: {
          userId: 'test-user-id',
          industry: 'technology',
          content: 'Test insight content'
        }
      })

      expect(result).toEqual(mockInsight)
      expect(prisma.industryInsight.create).toHaveBeenCalled()
    })

    it('should handle empty insights', async () => {
      prisma.industryInsight.findMany.mockResolvedValue([])
      
      const insights = await getIndustryInsights()
      expect(insights).toHaveLength(0)
    })
  })

  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      const mockError = new Error('Database connection failed')
      prisma.user.findUnique.mockRejectedValue(mockError)
      
      try {
        await getUserOnboardingStatus()
      } catch (error) {
        expect(error.message).toBe('Database connection failed')
      }
    })

    it('should handle query errors', async () => {
      const mockError = new Error('Query failed')
      prisma.industryInsight.findMany.mockRejectedValue(mockError)
      
      try {
        await getIndustryInsights()
      } catch (error) {
        expect(error.message).toBe('Query failed')
      }
    })
  })
}) 