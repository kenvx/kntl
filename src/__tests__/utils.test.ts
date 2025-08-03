import {
  validateUrl,
  normalizeUrl,
  formatResponseTime,
  parseJsonData,
  parseHeaders
} from '../commands/utils';

describe('Utils', () => {
  describe('validateUrl', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://api.test.com/endpoint')).toBe(true);
      expect(validateUrl('https://subdomain.example.com:8080/path')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('http://')).toBe(false);
      expect(validateUrl('')).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    it('should add https:// to URLs without protocol', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
      expect(normalizeUrl('api.test.com/endpoint')).toBe('https://api.test.com/endpoint');
    });

    it('should not modify URLs with protocol', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });
  });

  describe('formatResponseTime', () => {
    it('should format milliseconds for small values', () => {
      expect(formatResponseTime(123)).toBe('123ms');
      expect(formatResponseTime(999)).toBe('999ms');
    });

    it('should format seconds for large values', () => {
      expect(formatResponseTime(1000)).toBe('1.00s');
      expect(formatResponseTime(1500)).toBe('1.50s');
      expect(formatResponseTime(2345)).toBe('2.35s');
    });
  });

  describe('parseJsonData', () => {
    it('should parse valid JSON', () => {
      expect(parseJsonData('{"name":"test"}')).toEqual({ name: 'test' });
      expect(parseJsonData('[1,2,3]')).toEqual([1, 2, 3]);
    });

    it('should throw error for invalid JSON', () => {
      expect(() => parseJsonData('invalid json')).toThrow('Invalid JSON data provided');
      expect(() => parseJsonData('{"incomplete":')).toThrow('Invalid JSON data provided');
    });
  });

  describe('parseHeaders', () => {
    it('should parse header strings correctly', () => {
      const headers = ['Content-Type: application/json', 'Authorization: Bearer token'];
      const result = parseHeaders(headers);
      
      expect(result).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token'
      });
    });

    it('should handle headers with colons in values', () => {
      const headers = ['Date: Mon, 01 Jan 2024 12:00:00 GMT'];
      const result = parseHeaders(headers);
      
      expect(result).toEqual({
        'Date': 'Mon, 01 Jan 2024 12:00:00 GMT'
      });
    });

    it('should ignore malformed headers', () => {
      const headers = ['Valid-Header: value', 'InvalidHeader', 'Another-Valid: test'];
      const result = parseHeaders(headers);
      
      expect(result).toEqual({
        'Valid-Header': 'value',
        'Another-Valid': 'test'
      });
    });
  });
});
