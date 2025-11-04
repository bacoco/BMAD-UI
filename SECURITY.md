# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it by emailing the maintainers. Please do not create public GitHub issues for security vulnerabilities.

**Please include:**
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We take all security reports seriously and will respond within 48 hours.

## Security Features

### 1. XSS Protection

#### Implementation
- **DOMPurify Integration**: All user-generated HTML content is sanitized using DOMPurify
- **Content Security Policy**: Strict CSP headers prevent inline script execution
- **Input Validation**: All user inputs are validated before processing

#### Files
- `src/utils/codeSanitizer.ts` - Core sanitization logic
- `src/components/preview/LivePreview.tsx` - Preview security
- `src/components/builder/VisualBuilder.tsx` - File upload security

#### Testing
```bash
npm run test -- codeSanitizer.test.ts
```

### 2. File Upload Security

#### Implementation
- **MIME Type Validation**: Checks file MIME types against allowlist
- **Magic Bytes Validation**: Validates actual file content using magic bytes
- **File Size Limits**: Maximum 5MB per file
- **Rate Limiting**: Maximum 5 uploads per minute per user

#### Configuration
```typescript
// src/config/constants.ts
export const VALIDATION = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};
```

### 3. Rate Limiting

#### Implementation
- **Client-Side Rate Limiting**: Prevents abuse before reaching server
- **Action-Specific Limits**: Different limits for different actions
- **Automatic Blocking**: Temporary blocks after limit exceeded

#### Configuration
```typescript
// src/services/rateLimiter.ts
rateLimiter.configure('message', {
  maxRequests: 10,
  windowMs: 60000, // 10 messages per minute
  blockDurationMs: 30000,
});
```

### 4. Security Monitoring

#### Implementation
- **Event Logging**: All security events are logged
- **Real-time Monitoring**: Security events trigger immediate alerts
- **Audit Trail**: Complete history of security events

#### Usage
```typescript
import { securityMonitor } from '@/services/securityMonitor';

// Log security event
securityMonitor.logXSSAttempt({
  code: maliciousCode,
  issues: ['Script tags detected'],
});

// Get statistics
const stats = securityMonitor.getStatistics();
```

## Security Checklist

### Pre-Deployment
- [ ] All dependencies updated to latest secure versions
- [ ] npm audit shows no high/critical vulnerabilities
- [ ] All security tests passing
- [ ] CSP headers properly configured
- [ ] HTTPS enforced in production
- [ ] Environment variables properly secured
- [ ] No sensitive data in client-side code
- [ ] Error messages don't leak sensitive information

### Code Review
- [ ] All user inputs sanitized
- [ ] No eval() or Function() usage
- [ ] No innerHTML without sanitization
- [ ] No inline event handlers
- [ ] File uploads properly validated
- [ ] Rate limiting implemented
- [ ] Security logging in place

### Testing
- [ ] XSS attack vectors tested
- [ ] File upload validation tested
- [ ] Rate limiting tested
- [ ] Security monitoring tested
- [ ] E2E security scenarios tested

## Security Best Practices

### For Developers

1. **Never Trust User Input**
   - Always validate and sanitize
   - Use allowlists, not denylists
   - Validate on both client and server

2. **Use Security Headers**
   ```typescript
   Content-Security-Policy: default-src 'self'; script-src 'self'
   X-Content-Type-Options: nosniff
   X-Frame-Options: DENY
   X-XSS-Protection: 1; mode=block
   ```

3. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm update
   npx npm-check-updates -u
   ```

4. **Use HTTPS Only**
   - Enforce HTTPS in production
   - Use secure cookies
   - Enable HSTS

5. **Implement Proper Error Handling**
   - Don't expose stack traces
   - Log errors securely
   - Return generic error messages to users

### For Reviewers

1. **Check for Common Vulnerabilities**
   - XSS (Cross-Site Scripting)
   - CSRF (Cross-Site Request Forgery)
   - Injection attacks
   - Insecure deserialization
   - Using components with known vulnerabilities

2. **Verify Security Controls**
   - Input validation present
   - Output encoding used
   - Authentication/Authorization implemented
   - Security logging enabled

3. **Review Third-Party Code**
   - Audit all dependencies
   - Check for known vulnerabilities
   - Verify update frequency
   - Review permissions

## Automated Security Scanning

### GitHub Actions
Our CI/CD pipeline includes:
- **npm audit**: Dependency vulnerability scanning
- **Trivy**: Container and filesystem scanning
- **CodeQL**: Semantic code analysis
- **Semgrep**: SAST (Static Application Security Testing)
- **Dependency Review**: PR dependency scanning

### Local Scanning
```bash
# Run security audit
npm audit

# Run all tests including security tests
npm run test:all

# Check for outdated packages
npm outdated

# Update dependencies
npm update
```

## Vulnerability Disclosure Timeline

1. **T+0**: Vulnerability reported
2. **T+48h**: Initial response and acknowledgment
3. **T+7d**: Vulnerability assessment completed
4. **T+30d**: Fix developed and tested
5. **T+45d**: Security patch released
6. **T+90d**: Public disclosure (if appropriate)

## Security Contacts

- **Security Team**: [security@example.com](mailto:security@example.com)
- **Emergency**: [urgent-security@example.com](mailto:urgent-security@example.com)

## Compliance

This project follows:
- OWASP Top 10 Web Application Security Risks
- CWE Top 25 Most Dangerous Software Weaknesses
- NIST Cybersecurity Framework

## External Security Audit

### Last Audit
- **Date**: TBD
- **Auditor**: TBD
- **Findings**: TBD
- **Status**: TBD

### Recommended Audit Frequency
- **Quarterly**: Automated scanning
- **Bi-annually**: Internal security review
- **Annually**: External security audit

## Security Roadmap

### Q1 2025
- [x] Implement DOMPurify for XSS protection
- [x] Add file upload validation
- [x] Implement rate limiting
- [x] Add security monitoring
- [x] Set up automated security scanning

### Q2 2025
- [ ] Conduct external security audit
- [ ] Implement CSP reporting
- [ ] Add security headers middleware
- [ ] Implement CSRF protection
- [ ] Add security training for team

### Q3 2025
- [ ] Penetration testing
- [ ] Security certification
- [ ] Bug bounty program
- [ ] Security dashboard

## License

This security policy is part of the BMAD-UI project and is subject to the same license terms.

---

**Last Updated**: November 2025
**Version**: 1.0.0
