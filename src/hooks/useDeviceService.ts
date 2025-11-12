import { useState, useEffect, useCallback } from 'react';
import { Device, Alert, Settings } from '@/models/device.model';

const initialDevices: Device[] = [
  { id: 1, name: 'Production Line A', temperature: 45, vibration: 1.2, energy: 120, status: 'online', location: 'Building A', lastUpdate: new Date() },
  { id: 2, name: 'Assembly Unit B', temperature: 52, vibration: 2.1, energy: 95, status: 'online', location: 'Building A', lastUpdate: new Date() },
  { id: 3, name: 'Packaging Machine C', temperature: 38, vibration: 0.8, energy: 75, status: 'online', location: 'Building B', lastUpdate: new Date() },
  { id: 4, name: 'Quality Control D', temperature: 42, vibration: 1.5, energy: 60, status: 'online', location: 'Building B', lastUpdate: new Date() },
  { id: 5, name: 'Storage Unit E', temperature: 35, vibration: 0.5, energy: 45, status: 'offline', location: 'Building C', lastUpdate: new Date() },
];

const defaultSettings: Settings = {
  temperatureThreshold: 60,
  vibrationThreshold: 3.0,
  energyThreshold: 200,
  warningSound: 'beep',
  criticalSound: 'siren',
};

export const useDeviceService = () => {
  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('factoryDevices');
    if (saved) {
      const savedDevices = JSON.parse(saved) as Device[];
      return savedDevices.map(d => ({
        ...d,
        lastUpdate: new Date(d.lastUpdate)
      }));
    }
    return initialDevices;
  });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('factorySettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const checkForAlerts = useCallback((device: Device) => {
    const newAlerts: Alert[] = [];

    if (device.temperature > settings.temperatureThreshold) {
      newAlerts.push({
        id: `alert-temp-${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        type: 'temperature',
        severity: device.temperature > settings.temperatureThreshold + 10 ? 'critical' : 'warning',
        message: `Temperature at ${device.temperature.toFixed(1)}°C exceeds threshold of ${settings.temperatureThreshold}°C`,
        timestamp: new Date(),
        active: true,
      });
    }

    if (device.vibration > settings.vibrationThreshold) {
      newAlerts.push({
        id: `alert-vib-${device.id}`,
        deviceId: device.id,
        deviceName: device.name,
        type: 'vibration',
        severity: device.vibration > settings.vibrationThreshold + 1 ? 'critical' : 'warning',
        message: `Vibration at ${device.vibration.toFixed(2)} m/s² exceeds threshold of ${settings.vibrationThreshold} m/s²`,
        timestamp: new Date(),
        active: true,
      });
    }

    return newAlerts;
  }, [settings]);

  const updateDeviceData = useCallback(() => {
    setDevices(prevDevices => {
      const updated = prevDevices.map(device => {
        if (device.status === 'offline') {
          // Clear alerts for offline devices
          setAlerts(prev => prev.filter(a => a.deviceId !== device.id));
          return device;
        }

        const newDevice = {
          ...device,
          temperature: Math.max(30, Math.min(80, device.temperature + (Math.random() - 0.5) * 10)),
          vibration: Math.max(0, Math.min(5, device.vibration + (Math.random() - 0.5) * 1)),
          energy: device.energy + Math.random() * 5,
          lastUpdate: new Date(),
        };

        const deviceAlerts = checkForAlerts(newDevice);
        
        setAlerts(prev => {
          // Remove old alerts for this device
          const filtered = prev.filter(a => a.deviceId !== device.id);
          
          if (deviceAlerts.length > 0) {
            // Add new alerts, preserving timestamp if alert already existed
            const mergedAlerts = deviceAlerts.map(newAlert => {
              const existing = prev.find(a => a.id === newAlert.id);
              return existing ? { ...newAlert, timestamp: existing.timestamp } : newAlert;
            });
            return [...filtered, ...mergedAlerts];
          }
          
          return filtered;
        });

        return newDevice;
      });

      return updated;
    });
  }, [checkForAlerts]);

  // Re-evaluate alerts when settings change
  useEffect(() => {
    devices.forEach(device => {
      if (device.status === 'online') {
        const deviceAlerts = checkForAlerts(device);
        setAlerts(prev => {
          const filtered = prev.filter(a => a.deviceId !== device.id);
          if (deviceAlerts.length > 0) {
            const mergedAlerts = deviceAlerts.map(newAlert => {
              const existing = prev.find(a => a.id === newAlert.id);
              return existing ? { ...newAlert, timestamp: existing.timestamp } : newAlert;
            });
            return [...filtered, ...mergedAlerts];
          }
          return filtered;
        });
      }
    });
  }, [settings, devices, checkForAlerts]);

  useEffect(() => {
    const interval = setInterval(updateDeviceData, 3000);
    return () => clearInterval(interval);
  }, [updateDeviceData]);

  const toggleDeviceStatus = (deviceId: number) => {
    setDevices(prev => {
      const updated = prev.map(d =>
        d.id === deviceId
          ? { ...d, status: (d.status === 'online' ? 'offline' : 'online') as 'online' | 'offline' }
          : d
      );
      // Persist to localStorage
      localStorage.setItem('factoryDevices', JSON.stringify(updated));
      return updated;
    });
  };

  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('factorySettings', JSON.stringify(newSettings));
  };

  const clearAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
  };

  const addDevice = (device: Omit<Device, 'id' | 'lastUpdate'>) => {
    const newDevice: Device = {
      ...device,
      id: Math.max(...devices.map(d => d.id), 0) + 1,
      lastUpdate: new Date(),
    };
    setDevices(prev => {
      const updated = [...prev, newDevice];
      localStorage.setItem('factoryDevices', JSON.stringify(updated));
      return updated;
    });
  };

  const updateDevice = (deviceId: number, updates: Partial<Omit<Device, 'id' | 'lastUpdate'>>) => {
    setDevices(prev => {
      const updated = prev.map(d =>
        d.id === deviceId
          ? { ...d, ...updates, lastUpdate: new Date() }
          : d
      );
      localStorage.setItem('factoryDevices', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteDevice = (deviceId: number) => {
    setDevices(prev => {
      const updated = prev.filter(d => d.id !== deviceId);
      localStorage.setItem('factoryDevices', JSON.stringify(updated));
      return updated;
    });
    setAlerts(prev => prev.filter(a => a.deviceId !== deviceId));
  };

  return {
    devices,
    alerts,
    settings,
    toggleDeviceStatus,
    updateSettings,
    clearAlert,
    addDevice,
    updateDevice,
    deleteDevice,
  };
};
