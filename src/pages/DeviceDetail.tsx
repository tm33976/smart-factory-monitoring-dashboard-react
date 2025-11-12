import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeviceService } from "@/hooks/useDeviceService";
import { ArrowLeft, Power, MapPin } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface DeviceDataPoint {
  time: string;
  value: number;
}

const DeviceDetail = () => {
  const { id } = useParams();
  const { devices, toggleDeviceStatus } = useDeviceService();
  const device = devices.find(d => d.id === Number(id));

  const [tempData, setTempData] = useState<DeviceDataPoint[]>([]);
  const [vibrationData, setVibrationData] = useState<DeviceDataPoint[]>([]);
  const [energyData, setEnergyData] = useState<DeviceDataPoint[]>([]);

  useEffect(() => {
    if (!device) return;

    const updateChart = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setTempData(prev => [...prev, { time: timeStr, value: device.temperature }].slice(-15));
      setVibrationData(prev => [...prev, { time: timeStr, value: device.vibration }].slice(-15));
      setEnergyData(prev => [...prev, { time: timeStr, value: device.energy }].slice(-15));
    };

    updateChart();
    const interval = setInterval(updateChart, 3000);
    return () => clearInterval(interval);
  }, [device]);

  if (!device) {
    return (
      <div className="space-y-6">
        <Link to="/devices">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Devices
          </Button>
        </Link>
        <Card className="bg-card border-border">
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">Device not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <Link to="/devices" className="w-full sm:w-auto">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <ArrowLeft className="h-4 w-4" />
            Back to Devices
          </Button>
        </Link>
        <Button
          onClick={() => {
            toggleDeviceStatus(device.id);
            toast({
              title: device.status === 'online' ? 'Device Stopped' : 'Device Started',
              description: `${device.name} is now ${device.status === 'online' ? 'offline' : 'online'}`,
            });
          }}
          variant={device.status === 'online' ? 'destructive' : 'default'}
          className="gap-2 w-full sm:w-auto"
        >
          <Power className="h-4 w-4" />
          {device.status === 'online' ? 'Stop Device' : 'Start Device'}
        </Button>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground mb-2">{device.name}</CardTitle>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{device.location}</span>
              </div>
            </div>
            <Badge 
              variant={device.status === 'online' ? 'default' : 'secondary'}
              className={device.status === 'online' ? 'bg-success text-success-foreground text-base px-4 py-1' : 'text-base px-4 py-1'}
            >
              {device.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Temperature</p>
            <p className="text-2xl font-bold text-foreground">{device.temperature.toFixed(1)}°C</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Vibration</p>
            <p className="text-2xl font-bold text-foreground">{device.vibration.toFixed(2)} m/s²</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Energy Consumption</p>
            <p className="text-2xl font-bold text-foreground">{device.energy.toFixed(0)} kWh</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Temperature History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tempData}>
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Vibration History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={vibrationData}>
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Energy Consumption History</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={energyData}>
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
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-2))" 
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

export default DeviceDetail;
