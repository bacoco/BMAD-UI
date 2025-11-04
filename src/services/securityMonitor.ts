/**
 * Security Monitoring and Logging Service
 * Tracks and logs security-relevant events in the application
 */

export enum SecurityEventType {
  XSS_ATTEMPT = 'XSS_ATTEMPT',
  INVALID_FILE_UPLOAD = 'INVALID_FILE_UPLOAD',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  VALIDATION_FAILURE = 'VALIDATION_FAILURE',
  SANITIZATION_APPLIED = 'SANITIZATION_APPLIED',
  CSP_VIOLATION = 'CSP_VIOLATION',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
}

export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: SecurityEventType;
  severity: SecuritySeverity;
  message: string;
  details?: Record<string, any>;
  userAgent?: string;
  location?: string;
}

class SecurityMonitorService {
  private events: SecurityEvent[] = [];
  private maxEvents = 1000; // Keep last 1000 events in memory
  private listeners: ((event: SecurityEvent) => void)[] = [];

  /**
   * Log a security event
   */
  logEvent(
    type: SecurityEventType,
    severity: SecuritySeverity,
    message: string,
    details?: Record<string, any>
  ): void {
    const event: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      type,
      severity,
      message,
      details,
      userAgent: navigator.userAgent,
      location: window.location.pathname,
    };

    // Add to events array
    this.events.unshift(event);

    // Keep only max events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(0, this.maxEvents);
    }

    // Console logging based on severity
    this.consoleLog(event);

    // Notify listeners
    this.notifyListeners(event);

    // In production, this would send to a logging service
    this.sendToLoggingService(event);
  }

  /**
   * Log XSS attempt
   */
  logXSSAttempt(details: { code: string; issues: string[] }): void {
    this.logEvent(
      SecurityEventType.XSS_ATTEMPT,
      SecuritySeverity.HIGH,
      `XSS attempt detected with ${details.issues.length} security issues`,
      details
    );
  }

  /**
   * Log invalid file upload
   */
  logInvalidFileUpload(details: {
    fileName: string;
    fileType?: string;
    fileSize?: number;
    reason: string;
  }): void {
    this.logEvent(
      SecurityEventType.INVALID_FILE_UPLOAD,
      SecuritySeverity.MEDIUM,
      `Invalid file upload attempt: ${details.reason}`,
      details
    );
  }

  /**
   * Log rate limit exceeded
   */
  logRateLimitExceeded(details: { action: string; limit: number }): void {
    this.logEvent(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      SecuritySeverity.MEDIUM,
      `Rate limit exceeded for ${details.action}`,
      details
    );
  }

  /**
   * Log validation failure
   */
  logValidationFailure(details: { field: string; value: any; reason: string }): void {
    this.logEvent(
      SecurityEventType.VALIDATION_FAILURE,
      SecuritySeverity.LOW,
      `Validation failed for ${details.field}: ${details.reason}`,
      details
    );
  }

  /**
   * Log sanitization applied
   */
  logSanitization(details: { originalLength: number; sanitizedLength: number }): void {
    this.logEvent(
      SecurityEventType.SANITIZATION_APPLIED,
      SecuritySeverity.LOW,
      `Content sanitized: ${details.originalLength} → ${details.sanitizedLength} chars`,
      details
    );
  }

  /**
   * Get all logged events
   */
  getEvents(filter?: {
    type?: SecurityEventType;
    severity?: SecuritySeverity;
    since?: Date;
  }): SecurityEvent[] {
    let filtered = this.events;

    if (filter?.type) {
      filtered = filtered.filter((e) => e.type === filter.type);
    }

    if (filter?.severity) {
      filtered = filtered.filter((e) => e.severity === filter.severity);
    }

    if (filter?.since) {
      filtered = filtered.filter((e) => e.timestamp >= filter.since);
    }

    return filtered;
  }

  /**
   * Get event statistics
   */
  getStatistics(): {
    totalEvents: number;
    byType: Record<SecurityEventType, number>;
    bySeverity: Record<SecuritySeverity, number>;
    last24Hours: number;
  } {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const byType: Record<SecurityEventType, number> = {} as any;
    const bySeverity: Record<SecuritySeverity, number> = {} as any;

    // Initialize counts
    Object.values(SecurityEventType).forEach((type) => {
      byType[type] = 0;
    });
    Object.values(SecuritySeverity).forEach((severity) => {
      bySeverity[severity] = 0;
    });

    // Count events
    this.events.forEach((event) => {
      byType[event.type]++;
      bySeverity[event.severity]++;
    });

    const last24Hours = this.events.filter(
      (e) => e.timestamp >= oneDayAgo
    ).length;

    return {
      totalEvents: this.events.length,
      byType,
      bySeverity,
      last24Hours,
    };
  }

  /**
   * Clear old events
   */
  clearEvents(olderThan?: Date): void {
    if (olderThan) {
      this.events = this.events.filter((e) => e.timestamp >= olderThan);
    } else {
      this.events = [];
    }
  }

  /**
   * Subscribe to security events
   */
  subscribe(callback: (event: SecurityEvent) => void): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  /**
   * Console logging based on severity
   */
  private consoleLog(event: SecurityEvent): void {
    const message = `[Security ${event.severity}] ${event.type}: ${event.message}`;

    switch (event.severity) {
      case SecuritySeverity.CRITICAL:
      case SecuritySeverity.HIGH:
        console.error(message, event.details);
        break;
      case SecuritySeverity.MEDIUM:
        console.warn(message, event.details);
        break;
      default:
        // Only log in development
        if (import.meta.env.DEV) {
          console.info(message, event.details);
        }
    }
  }

  /**
   * Notify all subscribers
   */
  private notifyListeners(event: SecurityEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in security event listener:', error);
      }
    });
  }

  /**
   * Send to external logging service
   * In production, this would send to services like Sentry, DataDog, etc.
   */
  private sendToLoggingService(event: SecurityEvent): void {
    // Only send high/critical events in production
    if (
      !import.meta.env.DEV &&
      (event.severity === SecuritySeverity.HIGH ||
        event.severity === SecuritySeverity.CRITICAL)
    ) {
      // Example: Send to Sentry, DataDog, CloudWatch, etc.
      // This would be implemented based on your logging service
      /*
      fetch('/api/security-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(err => console.error('Failed to send security log:', err));
      */
    }
  }

  /**
   * Export events for analysis
   */
  exportEvents(): string {
    return JSON.stringify(this.events, null, 2);
  }
}

// Singleton instance
export const securityMonitor = new SecurityMonitorService();

// Export for testing
export { SecurityMonitorService };
