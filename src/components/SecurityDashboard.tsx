import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  AlertTriangle,
  Activity,
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { securityMonitor, SecurityEventType, SecuritySeverity } from '../services/securityMonitor';
import { rateLimiter } from '../services/rateLimiter';
import { cspReporter } from '../services/cspReporter';

export function SecurityDashboard() {
  const [stats, setStats] = useState(securityMonitor.getStatistics());
  const [rateLimitStats, setRateLimitStats] = useState(rateLimiter.getStatistics());
  const [cspStats, setCspStats] = useState(cspReporter.getStatistics());
  const [recentEvents, setRecentEvents] = useState(securityMonitor.getEvents().slice(0, 10));

  const refreshStats = () => {
    setStats(securityMonitor.getStatistics());
    setRateLimitStats(rateLimiter.getStatistics());
    setCspStats(cspReporter.getStatistics());
    setRecentEvents(securityMonitor.getEvents().slice(0, 10));
  };

  useEffect(() => {
    // Subscribe to security events
    const unsubscribe = securityMonitor.subscribe(() => {
      refreshStats();
    });

    // Refresh every 10 seconds
    const interval = setInterval(refreshStats, 10000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const exportLogs = () => {
    const data = {
      securityEvents: securityMonitor.getEvents(),
      cspViolations: cspReporter.getViolations(),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-logs-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSeverityBadge = (severity: SecuritySeverity) => {
    const variants: Record<SecuritySeverity, 'destructive' | 'default' | 'secondary' | 'outline'> =
      {
        [SecuritySeverity.CRITICAL]: 'destructive',
        [SecuritySeverity.HIGH]: 'destructive',
        [SecuritySeverity.MEDIUM]: 'default',
        [SecuritySeverity.LOW]: 'secondary',
      };

    return <Badge variant={variants[severity]}>{severity}</Badge>;
  };

  const getEventTypeIcon = (type: SecurityEventType) => {
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Security Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time security monitoring and analytics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshStats}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportLogs}>
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-3xl font-bold">{stats.totalEvents}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">{stats.last24Hours} in last 24h</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High/Critical</p>
              <p className="text-3xl font-bold">
                {stats.bySeverity[SecuritySeverity.HIGH] +
                  stats.bySeverity[SecuritySeverity.CRITICAL]}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-muted-foreground">Requires attention</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rate Limited</p>
              <p className="text-3xl font-bold">{rateLimitStats.blockedActions}</p>
            </div>
            <Shield className="h-8 w-8 text-yellow-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-muted-foreground">Actions blocked</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CSP Violations</p>
              <p className="text-3xl font-bold">{cspStats.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-muted-foreground">Policy violations</span>
          </div>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="events" className="w-full">
        <TabsList>
          <TabsTrigger value="events">Recent Events</TabsTrigger>
          <TabsTrigger value="severity">By Severity</TabsTrigger>
          <TabsTrigger value="type">By Type</TabsTrigger>
          <TabsTrigger value="csp">CSP Violations</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="mt-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Security Events</h3>
              <div className="space-y-3">
                {recentEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No security events recorded</p>
                ) : (
                  recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-1">{getEventTypeIcon(event.type)}</div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {getSeverityBadge(event.severity)}
                          <Badge variant="outline">{event.type}</Badge>
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">{event.message}</p>
                        {event.details && (
                          <p className="text-xs text-muted-foreground">
                            {JSON.stringify(event.details).slice(0, 100)}...
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="severity" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Events by Severity</h3>
            <div className="space-y-4">
              {Object.entries(stats.bySeverity).map(([severity, count]) => (
                <div key={severity} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(severity as SecuritySeverity)}
                    <span className="text-sm">{severity}</span>
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="type" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Events by Type</h3>
            <div className="space-y-4">
              {Object.entries(stats.byType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{type}</Badge>
                  </div>
                  <span className="text-2xl font-bold">{count}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="csp" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">CSP Violations</h3>
            <div className="space-y-4">
              {Object.entries(cspStats.byDirective).map(([directive, count]) => (
                <div key={directive} className="flex items-center justify-between">
                  <span className="text-sm font-mono">{directive}</span>
                  <Badge>{count}</Badge>
                </div>
              ))}
              {Object.keys(cspStats.byDirective).length === 0 && (
                <p className="text-center text-muted-foreground py-8">No CSP violations</p>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
