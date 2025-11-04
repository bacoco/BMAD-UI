/**
 * CSP (Content Security Policy) Violation Reporter
 * Captures and reports CSP violations for security monitoring
 */

import { securityMonitor, SecurityEventType, SecuritySeverity } from './securityMonitor';
import { monitoring } from './monitoring';

export interface CSPViolation {
  'document-uri': string;
  'violated-directive': string;
  'effective-directive': string;
  'original-policy': string;
  'blocked-uri': string;
  'source-file'?: string;
  'line-number'?: number;
  'column-number'?: number;
  'status-code'?: number;
}

class CSPReporterService {
  private endpoint: string | null = null;
  private violations: CSPViolation[] = [];
  private maxViolations = 100;

  /**
   * Initialize CSP reporter
   */
  init(endpoint?: string): void {
    this.endpoint = endpoint || '/api/csp-report';

    // Listen for CSP violations
    if (typeof document !== 'undefined') {
      document.addEventListener('securitypolicyviolation', (e) => {
        this.handleViolation(e as SecurityPolicyViolationEvent);
      });
    }

    console.log('CSP Reporter initialized');
  }

  /**
   * Handle CSP violation event
   */
  private handleViolation(event: SecurityPolicyViolationEvent): void {
    const violation: CSPViolation = {
      'document-uri': event.documentURI,
      'violated-directive': event.violatedDirective,
      'effective-directive': event.effectiveDirective,
      'original-policy': event.originalPolicy,
      'blocked-uri': event.blockedURI,
      'source-file': event.sourceFile || undefined,
      'line-number': event.lineNumber || undefined,
      'column-number': event.columnNumber || undefined,
      'status-code': event.statusCode || undefined,
    };

    // Store violation
    this.violations.unshift(violation);
    if (this.violations.length > this.maxViolations) {
      this.violations = this.violations.slice(0, this.maxViolations);
    }

    // Log to security monitor
    securityMonitor.logEvent(
      SecurityEventType.CSP_VIOLATION,
      this.determineSeverity(violation),
      `CSP Violation: ${violation['violated-directive']}`,
      {
        violation,
        blockedUri: violation['blocked-uri'],
        directive: violation['violated-directive'],
      }
    );

    // Report to monitoring service
    monitoring.captureMessage(
      `CSP Violation: ${violation['violated-directive']}`,
      'warning'
    );

    // Send to reporting endpoint
    this.reportViolation(violation);

    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn('CSP Violation:', violation);
    }
  }

  /**
   * Determine severity based on violation type
   */
  private determineSeverity(violation: CSPViolation): SecuritySeverity {
    const directive = violation['violated-directive'];

    // High severity violations
    if (
      directive.includes('script-src') ||
      directive.includes('object-src') ||
      directive.includes('base-uri')
    ) {
      return SecuritySeverity.HIGH;
    }

    // Medium severity violations
    if (
      directive.includes('style-src') ||
      directive.includes('img-src') ||
      directive.includes('connect-src')
    ) {
      return SecuritySeverity.MEDIUM;
    }

    // Low severity violations
    return SecuritySeverity.LOW;
  }

  /**
   * Report violation to endpoint
   */
  private async reportViolation(violation: CSPViolation): Promise<void> {
    if (!this.endpoint) return;

    // In development, log instead of sending
    if (import.meta.env.DEV) {
      console.log('Would report CSP violation to:', this.endpoint, violation);
      return;
    }

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/csp-report',
        },
        body: JSON.stringify({
          'csp-report': violation,
        }),
      });
    } catch (error) {
      console.error('Failed to report CSP violation:', error);
    }
  }

  /**
   * Get all violations
   */
  getViolations(): CSPViolation[] {
    return [...this.violations];
  }

  /**
   * Get violations by directive
   */
  getViolationsByDirective(directive: string): CSPViolation[] {
    return this.violations.filter((v) =>
      v['violated-directive'].includes(directive)
    );
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = [];
  }

  /**
   * Get violation statistics
   */
  getStatistics(): {
    total: number;
    byDirective: Record<string, number>;
    byUri: Record<string, number>;
  } {
    const stats = {
      total: this.violations.length,
      byDirective: {} as Record<string, number>,
      byUri: {} as Record<string, number>,
    };

    this.violations.forEach((v) => {
      // Count by directive
      const directive = v['violated-directive'];
      stats.byDirective[directive] = (stats.byDirective[directive] || 0) + 1;

      // Count by blocked URI
      const uri = v['blocked-uri'];
      stats.byUri[uri] = (stats.byUri[uri] || 0) + 1;
    });

    return stats;
  }

  /**
   * Export violations for analysis
   */
  exportViolations(): string {
    return JSON.stringify(this.violations, null, 2);
  }
}

// Singleton instance
export const cspReporter = new CSPReporterService();

// Auto-initialize
if (typeof window !== 'undefined') {
  cspReporter.init();
}

export { CSPReporterService };
