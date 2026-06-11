import React, { useState } from "react";
import { useScheduler } from "@/contexts/SchedulerContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Users,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { TuningType, Station } from "@/lib/mockData";
import { nanoid } from "nanoid";

export default function AdminPanel() {
  const {
    stations,
    tuningTypes,
    bookings,
    settings,
    updateStation,
    updateSettings,
    addTuningType,
    updateTuningType,
    deleteTuningType,
  } = useScheduler();

  const [editingStation, setEditingStation] = useState<Station | null>(null);
  const [editingTuning, setEditingTuning] = useState<TuningType | null>(null);
  const [newTuning, setNewTuning] = useState<Partial<TuningType>>({});
  const [newSettings, setNewSettings] = useState(settings);

  const handleUpdateStation = (stationId: string, field: string, value: any) => {
    updateStation(stationId, { [field]: value });
    toast.success("Station updated");
  };

  const handleAddTuning = () => {
    if (
      !newTuning.name ||
      !newTuning.duration ||
      newTuning.basePrice === undefined
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    const tuning: TuningType = {
      id: `tuning-${nanoid()}`,
      name: newTuning.name,
      description: newTuning.description || "",
      duration: newTuning.duration,
      basePrice: newTuning.basePrice,
    };

    addTuningType(tuning);
    setNewTuning({});
    toast.success("Tuning type added");
  };

  const handleUpdateTuning = (
    tuningId: string,
    field: string,
    value: any
  ) => {
    updateTuningType(tuningId, { [field]: value });
    toast.success("Tuning type updated");
  };

  const handleDeleteTuning = (tuningId: string) => {
    deleteTuningType(tuningId);
    toast.success("Tuning type deleted");
  };

  const handleUpdateSettings = () => {
    updateSettings(newSettings);
    toast.success("Settings updated");
  };

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const inProgressBookings = bookings.filter((b) => b.status === "in-progress");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container py-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold font-mono">ADMIN PANEL</h1>
          </div>
          <p className="text-slate-300">Manage stations, services, and bookings</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white border-2 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-900">
                  {bookings.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-white border-2 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Confirmed</p>
                <p className="text-3xl font-bold text-blue-600">
                  {confirmedBookings.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-white border-2 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">
                  {inProgressBookings.length}
                </p>
              </div>
              <Zap className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4 bg-white border-2 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedBookings.length}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="stations" className="space-y-4">
          <TabsList className="bg-white border-2 border-slate-200">
            <TabsTrigger value="stations">Stations</TabsTrigger>
            <TabsTrigger value="services">Tuning Services</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          </TabsList>

          {/* Stations Tab */}
          <TabsContent value="stations" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">
                MANAGE STATIONS
              </h2>

              <div className="space-y-4">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className="p-4 bg-slate-50 rounded border-2 border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          STATION NAME
                        </Label>
                        <Input
                          value={station.name}
                          onChange={(e) =>
                            handleUpdateStation(station.id, "name", e.target.value)
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          LOCATION
                        </Label>
                        <Input
                          value={station.location}
                          onChange={(e) =>
                            handleUpdateStation(
                              station.id,
                              "location",
                              e.target.value
                            )
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          MAX PARALLEL CARS
                        </Label>
                        <Input
                          type="number"
                          value={station.maxParallelCars}
                          onChange={(e) =>
                            handleUpdateStation(
                              station.id,
                              "maxParallelCars",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          CURRENT CARS
                        </Label>
                        <Input
                          type="number"
                          value={station.currentCars}
                          onChange={(e) =>
                            handleUpdateStation(
                              station.id,
                              "currentCars",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="text-sm text-slate-600 font-semibold">
                          Capacity: {station.currentCars}/{station.maxParallelCars}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 font-mono">
                  TUNING SERVICES
                </h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Plus size={16} className="mr-2" />
                      Add Service
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Tuning Service</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Service Name</Label>
                        <Input
                          placeholder="e.g., ECU Tuning"
                          value={newTuning.name || ""}
                          onChange={(e) =>
                            setNewTuning({ ...newTuning, name: e.target.value })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          placeholder="Brief description"
                          value={newTuning.description || ""}
                          onChange={(e) =>
                            setNewTuning({
                              ...newTuning,
                              description: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          placeholder="60"
                          value={newTuning.duration || ""}
                          onChange={(e) =>
                            setNewTuning({
                              ...newTuning,
                              duration: parseInt(e.target.value),
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Base Price ($)</Label>
                        <Input
                          type="number"
                          placeholder="299"
                          value={newTuning.basePrice || ""}
                          onChange={(e) =>
                            setNewTuning({
                              ...newTuning,
                              basePrice: parseInt(e.target.value),
                            })
                          }
                          className="mt-1"
                        />
                      </div>
                      <Button
                        onClick={handleAddTuning}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Add Service
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-3">
                {tuningTypes.map((tuning) => (
                  <div
                    key={tuning.id}
                    className="p-4 bg-slate-50 rounded border-2 border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          SERVICE NAME
                        </Label>
                        <Input
                          value={tuning.name}
                          onChange={(e) =>
                            handleUpdateTuning(tuning.id, "name", e.target.value)
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          DESCRIPTION
                        </Label>
                        <Input
                          value={tuning.description}
                          onChange={(e) =>
                            handleUpdateTuning(
                              tuning.id,
                              "description",
                              e.target.value
                            )
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          DURATION (MIN)
                        </Label>
                        <Input
                          type="number"
                          value={tuning.duration}
                          onChange={(e) =>
                            handleUpdateTuning(
                              tuning.id,
                              "duration",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">
                          PRICE ($)
                        </Label>
                        <Input
                          type="number"
                          value={tuning.basePrice}
                          onChange={(e) =>
                            handleUpdateTuning(
                              tuning.id,
                              "basePrice",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleDeleteTuning(tuning.id)
                          }
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">
                SYSTEM SETTINGS
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Business Start Time
                    </Label>
                    <Input
                      type="time"
                      value={newSettings.businessHours.startTime}
                      onChange={(e) =>
                        setNewSettings({
                          ...newSettings,
                          businessHours: {
                            ...newSettings.businessHours,
                            startTime: e.target.value,
                          },
                        })
                      }
                      className="mt-2 border-slate-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Business End Time
                    </Label>
                    <Input
                      type="time"
                      value={newSettings.businessHours.endTime}
                      onChange={(e) =>
                        setNewSettings({
                          ...newSettings,
                          businessHours: {
                            ...newSettings.businessHours,
                            endTime: e.target.value,
                          },
                        })
                      }
                      className="mt-2 border-slate-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Slot Duration (minutes)
                    </Label>
                    <Input
                      type="number"
                      value={newSettings.slotDuration}
                      onChange={(e) =>
                        setNewSettings({
                          ...newSettings,
                          slotDuration: parseInt(e.target.value),
                        })
                      }
                      className="mt-2 border-slate-300"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">
                      Default Max Cars Per Station
                    </Label>
                    <Input
                      type="number"
                      value={newSettings.defaultMaxCarsPerStation}
                      onChange={(e) =>
                        setNewSettings({
                          ...newSettings,
                          defaultMaxCarsPerStation: parseInt(e.target.value),
                        })
                      }
                      className="mt-2 border-slate-300"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleUpdateSettings}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200 overflow-x-auto">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">
                ALL BOOKINGS
              </h2>

              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="font-bold">Customer</TableHead>
                    <TableHead className="font-bold">Car</TableHead>
                    <TableHead className="font-bold">Service</TableHead>
                    <TableHead className="font-bold">Contact</TableHead>
                    <TableHead className="font-bold">Price</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id} className="border-slate-200">
                      <TableCell className="font-semibold text-slate-900">
                        {booking.customerName}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {booking.carType}
                      </TableCell>
                      <TableCell className="text-slate-700">
                        {booking.tuningTypeId}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {booking.contactNumber}
                      </TableCell>
                      <TableCell className="font-semibold text-orange-600">
                        ${booking.totalPrice}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            booking.status === "in-progress"
                              ? "default"
                              : booking.status === "completed"
                                ? "secondary"
                                : "outline"
                          }
                          className={
                            booking.status === "in-progress"
                              ? "bg-orange-100 text-orange-800"
                              : booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : ""
                          }
                        >
                          {booking.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
