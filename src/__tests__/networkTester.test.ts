import { NetworkTester } from '../core/networkTester';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = jest.mocked(axios);

// Mock axios.isAxiosError
const mockIsAxiosError = jest.fn();
(axios as any).isAxiosError = mockIsAxiosError;

describe('NetworkTester', () => {
  let networkTester: NetworkTester;

  beforeEach(() => {
    networkTester = new NetworkTester();
    jest.clearAllMocks();
  });

  describe('test method', () => {
    it('should return successful result for valid response', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: { message: 'success' }
      };

      (mockedAxios as any).mockResolvedValueOnce(mockResponse);

      const result = await networkTester.test('https://api.example.com');

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.statusText).toBe('OK');
      expect(result.url).toBe('https://api.example.com');
      expect(result.responseTime).toBeGreaterThan(0);
      expect(result.timestamp).toBeInstanceOf(Date);
    });

    it('should return error result for failed request', async () => {
      const mockError = new Error('Network Error');
      (mockedAxios as any).mockRejectedValueOnce(mockError);

      const result = await networkTester.test('https://invalid-url.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
      expect(result.responseTime).toBeGreaterThan(0);
    });

    it('should handle different HTTP methods', async () => {
      const mockResponse = {
        status: 201,
        statusText: 'Created',
        data: { id: 1 }
      };

      (mockedAxios as any).mockResolvedValueOnce(mockResponse);

      const result = await networkTester.test('https://api.example.com', {
        method: 'POST',
        data: { name: 'test' }
      });

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'https://api.example.com',
          data: { name: 'test' }
        })
      );
      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(201);
    });

    it('should include custom headers', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {}
      };

      (mockedAxios as any).mockResolvedValueOnce(mockResponse);

      await networkTester.test('https://api.example.com', {
        headers: { 'Authorization': 'Bearer token' }
      });

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token'
          })
        })
      );
    });
  });

  describe('ping method', () => {
    it('should measure response time and DNS lookup', async () => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        data: {}
      };

      mockedAxios.get = jest.fn().mockResolvedValueOnce(mockResponse);

      const result = await networkTester.ping('https://example.com');

      expect(result.success).toBe(true);
      expect(result.statusCode).toBe(200);
      expect(result.responseTime).toBeGreaterThan(0);
      expect(result.dnsLookupTime).toBeGreaterThanOrEqual(0);
      expect(result.tlsHandshakeTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle ping errors', async () => {
      const mockError = {
        isAxiosError: true,
        code: 'ENOTFOUND',
        message: 'DNS resolution failed'
      };
      mockIsAxiosError.mockReturnValue(true);
      mockedAxios.get = jest.fn().mockRejectedValueOnce(mockError);

      const result = await networkTester.ping('https://invalid-domain.xyz');

      expect(result.success).toBe(false);
      expect(result.error).toBe('DNS resolution failed');
    });
  });
});
