import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeviceService } from "@/hooks/useDeviceService";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const Settings = () => {
  const { settings, updateSettings } = useDeviceService();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
    toast({
      title: "Settings Saved",
      description: "Alert thresholds have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Configure alert thresholds and system parameters</p>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Alert Thresholds</CardTitle>
          <CardDescription className="text-muted-foreground">
            Set the warning levels for various sensor readings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="temperature" className="text-foreground">
              Temperature Threshold (°C)
            </Label>
            <Input
              id="temperature"
              type="number"
              value={localSettings.temperatureThreshold}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  temperatureThreshold: Number(e.target.value),
                })
              }
              className="bg-background border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Alert when temperature exceeds this value
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vibration" className="text-foreground">
              Vibration Threshold (m/s²)
            </Label>
            <Input
              id="vibration"
              type="number"
              step="0.1"
              value={localSettings.vibrationThreshold}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  vibrationThreshold: Number(e.target.value),
                })
              }
              className="bg-background border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Alert when vibration exceeds this value
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="energy" className="text-foreground">
              Energy Threshold (kWh)
            </Label>
            <Input
              id="energy"
              type="number"
              value={localSettings.energyThreshold}
              onChange={(e) =>
                setLocalSettings({
                  ...localSettings,
                  energyThreshold: Number(e.target.value),
                })
              }
              className="bg-background border-border text-foreground"
            />
            <p className="text-xs text-muted-foreground">
              Alert when energy consumption exceeds this value
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="warningSound" className="text-foreground">
              Warning Alert Sound
            </Label>
            <Select
              value={localSettings.warningSound || 'beep'}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  warningSound: value as 'beep' | 'chime' | 'siren',
                })
              }
            >
              <SelectTrigger id="warningSound" className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select sound" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beep">Beep</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="siren">Siren</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Sound played for warning level alerts
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="criticalSound" className="text-foreground">
              Critical Alert Sound
            </Label>
            <Select
              value={localSettings.criticalSound || 'siren'}
              onValueChange={(value) =>
                setLocalSettings({
                  ...localSettings,
                  criticalSound: value as 'beep' | 'chime' | 'siren',
                })
              }
            >
              <SelectTrigger id="criticalSound" className="bg-background border-border text-foreground">
                <SelectValue placeholder="Select sound" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beep">Beep</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="siren">Siren</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Sound played for critical level alerts
            </p>
          </div>

          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">System Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Version</span>
            <span className="text-foreground font-medium">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Update Interval</span>
            <span className="text-foreground font-medium">3 seconds</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Data Retention</span>
            <span className="text-foreground font-medium">15 minutes</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Storage</span>
            <span className="text-foreground font-medium">Local Browser Storage</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
