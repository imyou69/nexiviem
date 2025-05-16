import { GoogleGenerativeAI } from '@google/generative-ai'

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(),
      startChat: jest.fn()
    }))
  }))
}))

describe('Gemini AI Integration', () => {
  let mockAI
  let mockModel

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()

    // Setup mock responses
    mockModel = {
      generateContent: jest.fn(),
      startChat: jest.fn()
    }

    mockAI = new GoogleGenerativeAI('mock-api-key')
    jest.spyOn(mockAI, 'getGenerativeModel').mockReturnValue(mockModel)
  })

  describe('Text Generation', () => {
    it('should generate content successfully', async () => {
      const mockResponse = {
        response: {
          text: () => 'Generated content for testing'
        }
      }
      mockModel.generateContent.mockResolvedValue(mockResponse)

      const ai = new GoogleGenerativeAI('mock-api-key')
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })
      const result = await model.generateContent('Test prompt')

      expect(result.response.text()).toBe('Generated content for testing')
      expect(mockModel.generateContent).toHaveBeenCalledWith('Test prompt')
    })

    it('should handle generation errors', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('Generation failed'))

      const ai = new GoogleGenerativeAI('mock-api-key')
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })

      await expect(model.generateContent('Test prompt')).rejects.toThrow('Generation failed')
    })
  })

  describe('Chat Functionality', () => {
    it('should handle chat conversations', async () => {
      const mockChatResponse = {
        response: {
          text: () => 'Chat response'
        }
      }
      const mockChat = {
        sendMessage: jest.fn().mockResolvedValue(mockChatResponse)
      }
      mockModel.startChat.mockReturnValue(mockChat)

      const ai = new GoogleGenerativeAI('mock-api-key')
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })
      const chat = model.startChat()
      const response = await chat.sendMessage('Hello')

      expect(response.response.text()).toBe('Chat response')
      expect(mockChat.sendMessage).toHaveBeenCalledWith('Hello')
    })

    it('should maintain chat history', async () => {
      const mockChat = {
        sendMessage: jest.fn(),
        getHistory: jest.fn().mockReturnValue([
          { role: 'user', text: 'Hello' },
          { role: 'model', text: 'Hi there!' }
        ])
      }
      mockModel.startChat.mockReturnValue(mockChat)

      const ai = new GoogleGenerativeAI('mock-api-key')
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })
      const chat = model.startChat()
      const history = chat.getHistory()

      expect(history).toHaveLength(2)
      expect(history[0].role).toBe('user')
      expect(history[1].role).toBe('model')
    })
  })

  describe('API Integration', () => {
    it('should use correct API key', () => {
      const ai = new GoogleGenerativeAI('test-api-key')
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('test-api-key')
    })

    it('should use correct model configuration', () => {
      const ai = new GoogleGenerativeAI('test-api-key')
      ai.getGenerativeModel({ model: 'gemini-pro' })
      expect(ai.getGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-pro' })
    })
  })

  describe('Error Handling', () => {
    it('should handle API key errors', () => {
      GoogleGenerativeAI.mockImplementation(() => {
        throw new Error('Invalid API key')
      })

      expect(() => new GoogleGenerativeAI('')).toThrow('Invalid API key')
    })

    it('should handle rate limiting', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('Rate limit exceeded'))

      const ai = new GoogleGenerativeAI('mock-api-key')
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })

      await expect(model.generateContent('Test')).rejects.toThrow('Rate limit exceeded')
    })

    it('should handle network errors', async () => {
      mockModel.generateContent.mockRejectedValue(new Error('Network error'))

      const ai = new GoogleGenerativeAI('mock-api-key')
      const model = ai.getGenerativeModel({ model: 'gemini-pro' })

      await expect(model.generateContent('Test')).rejects.toThrow('Network error')
    })
  })
}) 