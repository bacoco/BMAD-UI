/**
 * Monitoring and Error Tracking Service
 * Integration with Sentry for production error tracking
 */

import * as Sentry from '@sentry/react';
import { securityMonitor, SecurityEventType, SecuritySeverity } from './securityMonitor';

export interface MonitoringConfig {
  dsn?: string;
  environment: string;
  release?: string;
  sampleRate: number;
  enableInDevelopment?: boolean;
}

class MonitoringService {
  private isInitialized = false;
  private config: MonitoringConfig | null = null;

  /**
   * Initialize monitoring service
   */
  init(config: MonitoringConfig): void {
    this.config = config;

    // Don't initialize in development unless explicitly enabled
    if (import.meta.env.DEV && !config.enableInDevelopment) {
      console.log('Monitoring disabled in development');
      return;
    }

    // Don't initialize if no DSN provided
    if (!config.dsn) {
      console.warn('No Sentry DSN provided, monitoring disabled');
      return;
    }

    try {
      Sentry.init({
        dsn: config.dsn,
        environment: config.environment,
        release: config.release,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],

        // Performance Monitoring
        tracesSampleRate: config.sampleRate,

        // Session Replay
        replaysSessionSampleRate: 0.1, // 10% of sessions
        replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

        // Filter out sensitive data
        beforeSend(event) {
          // Remove any potential PII
          if (event.request?.data) {
            event.request.data = '[Filtered]';
          }
          return event;
        },

        // Ignore specific errors
        ignoreErrors: [
          // Browser extensions
          'top.GLOBALS',
          // Network errors
          'NetworkError',
          'Failed to fetch',
        ],
      });

      this.isInitialized = true;
      console.log(`Monitoring initialized for ${config.environment}`);

      // Subscribe to security events
      this.subscribeToSecurityEvents();
    } catch (error) {
      console.error('Failed to initialize monitoring:', error);
    }
  }

  /**
   * Subscribe to security monitor events and send to Sentry
   */
  private subscribeToSecurityEvents(): void {
    securityMonitor.subscribe((event) => {
      // Only send high and critical events to Sentry
      if (
        event.severity === SecuritySeverity.HIGH ||
        event.severity === SecuritySeverity.CRITICAL
      ) {
        this.captureSecurityEvent(event);
      }
    });
  }

  /**
   * Capture a security event
   */
  private captureSecurityEvent(event: any): void {
    if (!this.isInitialized) return;

    Sentry.captureMessage(event.message, {
      level: this.mapSeverityToSentryLevel(event.severity),
      tags: {
        type: event.type,
        severity: event.severity,
      },
      extra: {
        eventId: event.id,
        timestamp: event.timestamp,
        details: event.details,
        location: event.location,
      },
    });
  }

  /**
   * Map security severity to Sentry level
   */
  private mapSeverityToSentryLevel(severity: SecuritySeverity): Sentry.SeverityLevel {
    switch (severity) {
      case SecuritySeverity.CRITICAL:
        return 'fatal';
      case SecuritySeverity.HIGH:
        return 'error';
      case SecuritySeverity.MEDIUM:
        return 'warning';
      case SecuritySeverity.LOW:
        return 'info';
      default:
        return 'info';
    }
  }

  /**
   * Capture an exception
   */
  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.isInitialized) {
      console.error('Monitoring not initialized, error:', error);
      return;
    }

    Sentry.captureException(error, {
      extra: context,
    });
  }

  /**
   * Capture a message
   */
  captureMessage(message: string, level: Sentry.SeverityLevel = 'info'): void {
    if (!this.isInitialized) {
      console.log('Monitoring not initialized, message:', message);
      return;
    }

    Sentry.captureMessage(message, level);
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email?: string; username?: string }): void {
    if (!this.isInitialized) return;

    Sentry.setUser(user);
  }

  /**
   * Clear user context
   */
  clearUser(): void {
    if (!this.isInitialized) return;

    Sentry.setUser(null);
  }

  /**
   * Set custom tags
   */
  setTag(key: string, value: string): void {
    if (!this.isInitialized) return;

    Sentry.setTag(key, value);
  }

  /**
   * Set custom context
   */
  setContext(name: string, context: Record<string, any>): void {
    if (!this.isInitialized) return;

    Sentry.setContext(name, context);
  }

  /**
   * Start a performance transaction
   */
  startTransaction(name: string, op: string): Sentry.Transaction | null {
    if (!this.isInitialized) return null;

    return Sentry.startTransaction({
      name,
      op,
    });
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(breadcrumb: {
    message: string;
    category?: string;
    level?: Sentry.SeverityLevel;
    data?: Record<string, any>;
  }): void {
    if (!this.isInitialized) return;

    Sentry.addBreadcrumb(breadcrumb);
  }

  /**
   * Check if monitoring is initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }

  /**
   * Get current configuration
   */
  get configuration(): MonitoringConfig | null {
    return this.config;
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

// Initialize with default config (can be overridden)
monitoring.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  sampleRate: import.meta.env.PROD ? 1.0 : 0.1,
  enableInDevelopment: false,
});

// Export Sentry for direct use if needed
export { Sentry };
