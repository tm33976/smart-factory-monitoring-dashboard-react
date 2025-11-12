import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Thermometer, Wind, Zap, AlertTriangle } from "lucide-react";
import { useDeviceService } from "@/hooks/useDeviceService";
import { useAlertSound } from "@/hooks/useAlertSound";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useEffect, useState } from "react";

interface DataPoint {
  time: string;
  temperature: number;
  vibration: number;
  energy: number;
}

const Dashboard = () => {
  const { devices, alerts, settings } = useDeviceService();
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  
  // Play alert sound when there are active alerts
  useAlertSound(alerts, settings);

  const activeDevices = devices.filter(d => d.status === 'online').length;
  const avgTemp = devices.reduce((acc, d) => acc + d.temperature, 0) / devices.length;
  const avgVibration = devices.reduce((acc, d) => acc + d.vibration, 0) / devices.length;
  const totalEnergy = devices.reduce((acc, d) => acc + d.energy, 0);
  const activeAlerts = alerts.filter(a => a.active).length;

  useEffect(() => {
    const updateChart = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      setChartData(prev => {
        const newData = [
          ...prev,
          {
            time: timeStr,
            temperature: avgTemp,
            vibration: avgVibration,
            energy: totalEnergy / 10,
          }
        ].slice(-20); // Keep last 20 data points
        return newData;
      });
    };

    updateChart();
    const interval = setInterval(updateChart, 3000);
    return () => clearInterval(interval);
  }, [avgTemp, avgVibration, totalEnergy]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Factory Overview</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Real-time monitoring of all production units</p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Devices</CardTitle>
            <Activity className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeDevices}/{devices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Online units</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Across all devices</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Vibration</CardTitle>
            <Wind className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{avgVibration.toFixed(2)} m/s²</div>
            <p className="text-xs text-muted-foreground mt-1">System stability</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Energy</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalEnergy.toFixed(0)} kWh</div>
            <p className="text-xs text-muted-foreground mt-1">Cumulative consumption</p>
          </CardContent>
        </Card>
      </div>

      {activeAlerts > 0 && (
        <Card className="bg-destructive/10 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts: {activeAlerts}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">
              There are {activeAlerts} active alert{activeAlerts !== 1 ? 's' : ''} requiring attention.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Live Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '6px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--chart-3))" 
                name="Temperature (°C)"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="vibration" 
                stroke="hsl(var(--chart-1))" 
                name="Vibration (m/s²)"
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="hsl(var(--chart-2))" 
                name="Energy (kWh/10)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
