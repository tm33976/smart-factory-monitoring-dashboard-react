export interface Device {
  id: number;
  name: string;
  temperature: number;
  vibration: number;
  energy: number;
  status: 'online' | 'offline';
  location: string;
  lastUpdate: Date;
}

export interface Alert {
  id: string;
  deviceId: number;
  deviceName: string;
  type: 'temperature' | 'vibration' | 'energy';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  active: boolean;
}

export interface Settings {
  temperatureThreshold: number;
  vibrationThreshold: number;
  energyThreshold: number;
  warningSound: 'beep' | 'chime' | 'siren';
  criticalSound: 'beep' | 'chime' | 'siren';
}
