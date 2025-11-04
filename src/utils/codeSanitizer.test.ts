import { describe, it, expect } from 'vitest';
import {
  sanitizeCode,
  sanitizePreviewCode,
  validateCodeSafety,
  escapeHtml,
  stripHtml,
} from './codeSanitizer';

describe('codeSanitizer', () => {
  describe('sanitizeCode', () => {
    it('should remove script tags', () => {
      const maliciousCode = '<div>Hello</div><script>alert("xss")</script>';
      const result = sanitizeCode(maliciousCode);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });

    it('should remove inline event handlers', () => {
      const maliciousCode = '<button onclick="alert(1)">Click</button>';
      const result = sanitizeCode(maliciousCode);
      expect(result).not.toContain('onclick');
    });

    it('should allow safe HTML tags', () => {
      const safeCode = '<div class="container"><h1>Title</h1><p>Content</p></div>';
      const result = sanitizeCode(safeCode);
      expect(result).toContain('<div');
      expect(result).toContain('<h1>');
      expect(result).toContain('<p>');
    });

    it('should remove iframe tags', () => {
      const maliciousCode = '<iframe src="evil.com"></iframe>';
      const result = sanitizeCode(maliciousCode);
      expect(result).not.toContain('<iframe');
    });

    it('should handle empty input', () => {
      expect(sanitizeCode('')).toBe('');
      expect(sanitizeCode(null as any)).toBe('');
      expect(sanitizeCode(undefined as any)).toBe('');
    });
  });

  describe('sanitizePreviewCode', () => {
    it('should allow SVG elements', () => {
      const svgCode = '<svg><circle cx="50" cy="50" r="40"/></svg>';
      const result = sanitizePreviewCode(svgCode);
      expect(result).toContain('<svg');
      expect(result).toContain('<circle');
    });

    it('should still remove dangerous tags', () => {
      const maliciousCode = '<div>Safe</div><script>alert(1)</script>';
      const result = sanitizePreviewCode(maliciousCode);
      expect(result).not.toContain('<script>');
    });
  });

  describe('validateCodeSafety', () => {
    it('should detect script tags', () => {
      const code = '<script>alert(1)</script>';
      const result = validateCodeSafety(code);
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('Script tags are not allowed');
    });

    it('should detect javascript: protocol', () => {
      const code = '<a href="javascript:alert(1)">Link</a>';
      const result = validateCodeSafety(code);
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('JavaScript protocol is not allowed');
    });

    it('should detect inline event handlers', () => {
      const code = '<div onclick="alert(1)">Click</div>';
      const result = validateCodeSafety(code);
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('Inline event handlers are not allowed');
    });

    it('should detect eval usage', () => {
      const code = '<div>eval("code")</div>';
      const result = validateCodeSafety(code);
      expect(result.safe).toBe(false);
      expect(result.issues).toContain('eval() function is not allowed');
    });

    it('should pass safe code', () => {
      const code = '<div class="safe"><p>Hello World</p></div>';
      const result = validateCodeSafety(code);
      expect(result.safe).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should detect multiple issues', () => {
      const code = '<script>eval(1)</script><iframe src="x"></iframe>';
      const result = validateCodeSafety(code);
      expect(result.safe).toBe(false);
      expect(result.issues.length).toBeGreaterThan(1);
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const result = escapeHtml(input);
      expect(result).toBe('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
    });

    it('should escape ampersands', () => {
      expect(escapeHtml('A & B')).toBe('A &amp; B');
    });

    it('should escape quotes', () => {
      expect(escapeHtml(`He said "hello"`)).toContain('&quot;');
      expect(escapeHtml(`It's nice`)).toContain('&#039;');
    });

    it('should handle empty input', () => {
      expect(escapeHtml('')).toBe('');
      expect(escapeHtml(null as any)).toBe('');
    });
  });

  describe('stripHtml', () => {
    it('should remove all HTML tags', () => {
      const html = '<div><p>Hello <strong>World</strong></p></div>';
      const result = stripHtml(html);
      expect(result).not.toContain('<div');
      expect(result).not.toContain('<p>');
      expect(result).not.toContain('<strong>');
      // DOMPurify with ALLOWED_TAGS: [] returns the text content
      expect(result.replace(/\s+/g, ' ').trim()).toBe('Hello World');
    });

    it('should handle empty input', () => {
      expect(stripHtml('')).toBe('');
      expect(stripHtml(null as any)).toBe('');
    });
  });
});
