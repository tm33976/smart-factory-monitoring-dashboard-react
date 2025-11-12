import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDeviceService } from "@/hooks/useDeviceService";
import { AlertTriangle, X, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Alerts = () => {
  const { alerts, clearAlert } = useDeviceService();
  const activeAlerts = alerts.filter(a => a.active);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'warning':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">System Alerts</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Active warnings and critical notifications</p>
      </div>

      {activeAlerts.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="py-12">
            <div className="flex flex-col items-center gap-3 text-center">
              <CheckCircle className="h-12 w-12 text-success" />
              <p className="text-xl font-semibold text-foreground">All Systems Normal</p>
              <p className="text-sm text-muted-foreground">No active alerts at this time</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <Card key={alert.id} className="bg-card border-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive mt-1 flex-shrink-0" />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-base sm:text-lg text-foreground truncate">
                          <Link 
                            to={`/devices/${alert.deviceId}`}
                            className="hover:text-primary transition-colors"
                          >
                            {alert.deviceName}
                          </Link>
                        </CardTitle>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)} Alert
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => clearAlert(alert.id)}
                    className="text-muted-foreground hover:text-foreground flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground mb-2">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  Triggered at {alert.timestamp.toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Alert Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-3 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Alerts</p>
            <p className="text-2xl font-bold text-foreground">{activeAlerts.length}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Critical</p>
            <p className="text-2xl font-bold text-destructive">
              {activeAlerts.filter(a => a.severity === 'critical').length}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-2xl font-bold text-warning">
              {activeAlerts.filter(a => a.severity === 'warning').length}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
