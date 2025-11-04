/**
 * Sanitizes generated code to prevent XSS attacks
 * NOTE: This is a basic sanitizer. For production, consider using a library like DOMPurify
 */
export function sanitizeCode(code: string): string {
  if (!code) return '';

  // Remove potentially dangerous patterns
  const dangerousPatterns = [
    /<script[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onload, etc.
    /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /<object[^>]*>[\s\S]*?<\/object>/gi,
    /<embed[^>]*>/gi,
  ];

  let sanitized = code;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  return sanitized;
}

/**
 * Validates if code is safe for preview
 */
export function isCodeSafe(code: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /eval\(/i,
    /Function\(/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(code));
}

/**
 * Escapes HTML to prevent XSS when displaying user content
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}
