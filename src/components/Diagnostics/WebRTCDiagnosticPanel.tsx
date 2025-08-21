import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { webrtcDiagnostics, DiagnosticReport } from '@/utils/webrtcDiagnostics';
import { AlertTriangle, CheckCircle, XCircle, Play, Loader2 } from 'lucide-react';

interface WebRTCDiagnosticPanelProps {
  onClose?: () => void;
}

export function WebRTCDiagnosticPanel({ onClose }: WebRTCDiagnosticPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<DiagnosticReport | null>(null);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setReport(null);
    
    try {
      const diagnosticReport = await webrtcDiagnostics.runFullDiagnostics();
      setReport(diagnosticReport);
    } catch (error) {
      console.error('Failed to run diagnostics:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"} className="text-xs">
        {success ? "PASS" : "FAIL"}
      </Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              WebRTC Diagnostics
            </CardTitle>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!report && !isRunning && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Run comprehensive diagnostics to identify WebRTC connection issues
              </p>
              <Button onClick={runDiagnostics} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Run Diagnostics
              </Button>
            </div>
          )}

          {isRunning && (
            <div className="text-center py-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Running diagnostics...</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This may take up to 30 seconds to complete
              </p>
            </div>
          )}

          {report && (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">
                    {report.summary.totalTests}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Tests</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {report.summary.passed}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {report.summary.failed}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>

              {/* Critical Failures */}
              {report.summary.criticalFailures.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="font-semibold text-red-700 dark:text-red-300">
                      Critical Issues Detected
                    </span>
                  </div>
                  <ul className="text-sm text-red-600 dark:text-red-400 space-y-1">
                    {report.summary.criticalFailures.map((failure, index) => (
                      <li key={index}>• {failure}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Detailed Results */}
              <div className="space-y-3">
                <h3 className="font-semibold">Detailed Results</h3>
                {report.results.map((result, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(result.success)}
                        <span className="font-medium">{result.test}</span>
                        {result.duration && (
                          <span className="text-xs text-muted-foreground">
                            ({result.duration}ms)
                          </span>
                        )}
                      </div>
                      {getStatusBadge(result.success)}
                    </div>
                    
                    {result.error && (
                      <div className="text-sm text-red-600 dark:text-red-400 mb-2">
                        Error: {result.error}
                      </div>
                    )}
                    
                    {result.details && (
                      <details className="text-xs text-muted-foreground">
                        <summary className="cursor-pointer hover:text-foreground">
                          Show Details
                        </summary>
                        <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>

              {/* System Info */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">System Information</h4>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>Timestamp: {new Date(report.timestamp).toLocaleString()}</div>
                  <div>Network: {report.networkType}</div>
                  <div>User Agent: {report.userAgent}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button onClick={runDiagnostics} variant="outline" size="sm">
                  Run Again
                </Button>
                <Button 
                  onClick={() => {
                    const dataStr = JSON.stringify(report, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `webrtc-diagnostics-${Date.now()}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                  }}
                  variant="outline" 
                  size="sm"
                >
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}