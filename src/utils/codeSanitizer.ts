import DOMPurify from 'dompurify';

/**
 * Sanitizes generated code to prevent XSS attacks using DOMPurify
 * This provides comprehensive protection against XSS vulnerabilities
 */
export function sanitizeCode(code: string): string {
  if (!code) return '';

  // Configure DOMPurify with strict settings
  const config: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'button', 'input', 'textarea',
      'form', 'label', 'select', 'option', 'table', 'thead', 'tbody',
      'tr', 'td', 'th', 'nav', 'header', 'footer', 'section', 'article',
      'aside', 'main', 'figure', 'figcaption', 'strong', 'em', 'code',
      'pre', 'blockquote', 'br', 'hr'
    ],
    ALLOWED_ATTR: [
      'class', 'id', 'href', 'src', 'alt', 'title', 'type', 'value',
      'placeholder', 'name', 'for', 'role', 'aria-label', 'aria-labelledby',
      'aria-describedby', 'aria-hidden', 'tabindex', 'data-*'
    ],
    ALLOW_DATA_ATTR: true,
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
    FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed', 'link', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    RETURN_TRUSTED_TYPE: false,
  };

  try {
    return DOMPurify.sanitize(code, config);
  } catch (error) {
    console.error('Sanitization error:', error);
    return '';
  }
}

/**
 * Sanitizes HTML for display in preview with more permissive settings
 * Used when we need to render component previews
 */
export function sanitizePreviewCode(code: string): string {
  if (!code) return '';

  const config: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'button', 'input', 'textarea',
      'form', 'label', 'select', 'option', 'table', 'thead', 'tbody',
      'tr', 'td', 'th', 'nav', 'header', 'footer', 'section', 'article',
      'aside', 'main', 'figure', 'figcaption', 'strong', 'em', 'code',
      'pre', 'blockquote', 'br', 'hr', 'svg', 'path', 'circle', 'rect',
      'line', 'polyline', 'polygon'
    ],
    ALLOWED_ATTR: [
      'class', 'id', 'href', 'src', 'alt', 'title', 'type', 'value',
      'placeholder', 'name', 'for', 'role', 'aria-label', 'aria-labelledby',
      'aria-describedby', 'aria-hidden', 'tabindex', 'data-*', 'width', 'height',
      'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'cx', 'cy', 'r', 'x', 'y'
    ],
    ALLOW_DATA_ATTR: true,
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'link', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
    KEEP_CONTENT: true,
  };

  try {
    return DOMPurify.sanitize(code, config);
  } catch (error) {
    console.error('Preview sanitization error:', error);
    return '';
  }
}

/**
 * Validates if code is safe for preview
 * Returns detailed validation result
 */
export function validateCodeSafety(code: string): { safe: boolean; issues: string[] } {
  if (!code) return { safe: true, issues: [] };

  const issues: string[] = [];

  // Check for dangerous patterns
  const dangerousPatterns = [
    { pattern: /<script/i, message: 'Script tags are not allowed' },
    { pattern: /javascript:/i, message: 'JavaScript protocol is not allowed' },
    { pattern: /on\w+\s*=/i, message: 'Inline event handlers are not allowed' },
    { pattern: /<iframe/i, message: 'Iframe elements are not allowed' },
    { pattern: /eval\s*\(/i, message: 'eval() function is not allowed' },
    { pattern: /Function\s*\(/i, message: 'Function constructor is not allowed' },
    { pattern: /<object/i, message: 'Object tags are not allowed' },
    { pattern: /<embed/i, message: 'Embed tags are not allowed' },
    { pattern: /data:text\/html/i, message: 'Data URI with HTML is not allowed' },
    { pattern: /<link/i, message: 'Link tags are not allowed' },
    { pattern: /<base/i, message: 'Base tags are not allowed' },
  ];

  dangerousPatterns.forEach(({ pattern, message }) => {
    if (pattern.test(code)) {
      issues.push(message);
    }
  });

  return {
    safe: issues.length === 0,
    issues
  };
}

/**
 * Escapes HTML to prevent XSS when displaying user content as text
 */
export function escapeHtml(text: string): string {
  if (!text) return '';

  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Strips all HTML tags and returns plain text
 * Useful for displaying code in non-HTML contexts
 */
export function stripHtml(html: string): string {
  if (!html) return '';

  try {
    const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });

    if (typeof document !== 'undefined') {
      const container = document.createElement('div');
      container.innerHTML = sanitized;
      return container.textContent ?? '';
    }

    return sanitized.replace(/<[^>]+>/g, '');
  } catch (error) {
    console.error('Strip HTML error:', error);
    return '';
  }
}
