import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeviceService } from "@/hooks/useDeviceService";
import { Link } from "react-router-dom";
import { Thermometer, Activity, Zap, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Device } from "@/models/device.model";

const DeviceList = () => {
  const { devices, addDevice, updateDevice, deleteDevice } = useDeviceService();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deletingDevice, setDeletingDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    temperature: '45',
    vibration: '1.2',
    energy: '100',
    status: 'online' as 'online' | 'offline',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDevice({
      name: formData.name,
      location: formData.location,
      temperature: parseFloat(formData.temperature),
      vibration: parseFloat(formData.vibration),
      energy: parseFloat(formData.energy),
      status: formData.status,
    });
    toast({
      title: "Device Added",
      description: `${formData.name} has been added successfully`,
    });
    setOpen(false);
    setFormData({
      name: '',
      location: '',
      temperature: '45',
      vibration: '1.2',
      energy: '100',
      status: 'online',
    });
  };

  const handleEdit = (device: Device) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      location: device.location,
      temperature: device.temperature.toString(),
      vibration: device.vibration.toString(),
      energy: device.energy.toString(),
      status: device.status,
    });
    setEditOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDevice) return;
    
    updateDevice(editingDevice.id, {
      name: formData.name,
      location: formData.location,
      temperature: parseFloat(formData.temperature),
      vibration: parseFloat(formData.vibration),
      energy: parseFloat(formData.energy),
      status: formData.status,
    });
    toast({
      title: "Device Updated",
      description: `${formData.name} has been updated successfully`,
    });
    setEditOpen(false);
    setEditingDevice(null);
    setFormData({
      name: '',
      location: '',
      temperature: '45',
      vibration: '1.2',
      energy: '100',
      status: 'online',
    });
  };

  const handleDelete = (device: Device) => {
    setDeletingDevice(device);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deletingDevice) return;
    
    deleteDevice(deletingDevice.id);
    toast({
      title: "Device Deleted",
      description: `${deletingDevice.name} has been removed`,
      variant: "destructive",
    });
    setDeleteOpen(false);
    setDeletingDevice(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Connected Devices</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Monitor all production units and equipment</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Device Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Production Line F"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Building C"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vibration">Vibration (m/s²)</Label>
                  <Input
                    id="vibration"
                    type="number"
                    step="0.1"
                    value={formData.vibration}
                    onChange={(e) => setFormData({ ...formData, vibration: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="energy">Energy (kWh)</Label>
                  <Input
                    id="energy"
                    type="number"
                    step="1"
                    value={formData.energy}
                    onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: 'online' | 'offline') => setFormData({ ...formData, status: value })}>
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Add Device</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card key={device.id} className="bg-card border-border hover:border-primary transition-colors h-full">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Link to={`/devices/${device.id}`} className="flex-1">
                  <CardTitle className="text-lg text-foreground hover:text-primary transition-colors">{device.name}</CardTitle>
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(device);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(device);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Badge 
                    variant={device.status === 'online' ? 'default' : 'secondary'}
                    className={device.status === 'online' ? 'bg-success text-success-foreground' : ''}
                  >
                    {device.status}
                  </Badge>
                </div>
              </div>
              <Link to={`/devices/${device.id}`}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{device.location}</span>
                </div>
              </Link>
            </CardHeader>
            <Link to={`/devices/${device.id}`}>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Thermometer className="h-4 w-4 text-warning" />
                    <span>Temperature</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {device.temperature.toFixed(1)}°C
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Activity className="h-4 w-4 text-primary" />
                    <span>Vibration</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {device.vibration.toFixed(2)} m/s²
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Zap className="h-4 w-4 text-accent" />
                    <span>Energy</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {device.energy.toFixed(0)} kWh
                  </span>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Last update: {device.lastUpdate.toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Edit Device Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Device Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Production Line F"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Building C"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-temperature">Temperature (°C)</Label>
                <Input
                  id="edit-temperature"
                  type="number"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-vibration">Vibration (m/s²)</Label>
                <Input
                  id="edit-vibration"
                  type="number"
                  step="0.1"
                  value={formData.vibration}
                  onChange={(e) => setFormData({ ...formData, vibration: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-energy">Energy (kWh)</Label>
                <Input
                  id="edit-energy"
                  type="number"
                  step="1"
                  value={formData.energy}
                  onChange={(e) => setFormData({ ...formData, energy: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'online' | 'offline') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">Update Device</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deletingDevice?.name}</strong>? This action cannot be undone and will remove all associated data and alerts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeviceList;
