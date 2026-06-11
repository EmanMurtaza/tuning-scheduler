import React, { useState, useEffect } from "react";
import { useScheduler } from "@/contexts/SchedulerContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Trash2,
  Users,
  CheckCircle2,
  Zap,
  TrendingUp,
  CalendarX,
  LayoutDashboard,
  MapPin,
  Lock,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react";
import { TuningType, Station } from "@/lib/mockData";
import { nanoid } from "nanoid";
import { useLocation } from "wouter";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const AUTH_KEY = "tuning_admin_auth";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem(AUTH_KEY, "1");
      onLogin();
    } else {
      setError("Invalid username or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-sm flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">
            Admin Panel
          </h1>
          <p className="text-slate-500 text-xs tracking-wider mt-1">
            TUNING SCHEDULER
          </p>
        </div>

        <Card className="bg-slate-900 border border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={15} className="text-orange-400" />
            <span className="text-slate-300 text-sm font-mono tracking-wider uppercase">
              Sign In
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Username
              </Label>
              <Input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1.5 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-orange-500"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-orange-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs font-mono">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-mono tracking-wider mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <div className="mt-5 pt-4 border-t border-slate-800 text-center">
            <p className="text-slate-600 text-[11px] font-mono">
              demo credentials: <span className="text-slate-500">admin / admin123</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

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
  const [, setLocation] = useLocation();
  const [authed, setAuthed] = useState(() => localStorage.getItem(AUTH_KEY) === "1");
  const [newTuning, setNewTuning] = useState<Partial<TuningType>>({});
  const [newSettings, setNewSettings] = useState({
    ...settings,
    holidays: settings.holidays ?? [],
    workingDays: settings.workingDays ?? [1, 2, 3, 4, 5],
  });
  const [newHoliday, setNewHoliday] = useState("");

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  const handleUpdateStation = (stationId: string, field: string, value: any) => {
    updateStation(stationId, { [field]: value });
    toast.success("Station updated");
  };

  const handleAddTuning = () => {
    if (!newTuning.name || !newTuning.duration || newTuning.basePrice === undefined) {
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

  const handleUpdateTuning = (tuningId: string, field: string, value: any) => {
    updateTuningType(tuningId, { [field]: value });
    toast.success("Tuning type updated");
  };

  const handleDeleteTuning = (tuningId: string) => {
    deleteTuningType(tuningId);
    toast.success("Tuning type deleted");
  };

  const handleUpdateSettings = () => {
    updateSettings(newSettings);
    toast.success("Settings saved");
  };

  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const inProgressBookings = bookings.filter((b) => b.status === "in-progress");
  const completedBookings = bookings.filter((b) => b.status === "completed");

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const completedRevenue = completedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const recentBookings = [...bookings].reverse().slice(0, 8);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 bg-orange-500 rounded-sm flex items-center justify-center cursor-pointer"
                onClick={() => setLocation("/")}
              >
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-mono">ADMIN PANEL</h1>
                <p className="text-slate-400 text-sm">Manage stations, services, and bookings</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-600 text-slate-400 hover:border-red-500 hover:text-red-400 font-mono text-xs tracking-wider gap-1.5"
            >
              <LogOut size={13} />
              LOGOUT
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-white border-2 border-slate-200 h-10">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-sm">
              <LayoutDashboard size={13} />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="stations" className="text-sm">Stations</TabsTrigger>
            <TabsTrigger value="services" className="text-sm">Tuning Services</TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm">All Bookings</TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5 text-sm">
              <Settings size={13} />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* ── Dashboard Tab ── */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 bg-white border-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{bookings.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">bookings</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Confirmed</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{confirmedBookings.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">upcoming</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-2 border-l-4 border-orange-200 border-l-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">In Progress</p>
                    <p className="text-3xl font-bold text-orange-600 mt-1">{inProgressBookings.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">active now</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </Card>

              <Card className="p-5 bg-white border-2 border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Completed</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{completedBookings.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">finished</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Revenue + Station occupancy */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-6 bg-white border-2 border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-slate-900">Revenue</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Total Billed</p>
                    <p className="text-2xl font-bold text-orange-600 font-mono">
                      Rs. {totalRevenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Collected</p>
                    <p className="text-xl font-bold text-green-600 font-mono">
                      Rs. {completedRevenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {completedBookings.length} completed session{completedBookings.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-white border-2 border-slate-200 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-slate-900">Station Occupancy</h3>
                </div>
                <div className="space-y-5">
                  {stations.map((station) => {
                    const pct =
                      station.maxParallelCars > 0
                        ? Math.round((station.currentCars / station.maxParallelCars) * 100)
                        : 0;
                    return (
                      <div key={station.id}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-slate-700">
                            {station.name}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {station.currentCars}/{station.maxParallelCars} bays
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct > 80
                                ? "bg-red-500"
                                : pct > 50
                                  ? "bg-orange-500"
                                  : "bg-emerald-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{station.location}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="p-6 bg-white border-2 border-slate-200 overflow-x-auto">
              <h3 className="font-bold text-slate-900 text-lg mb-4">Recent Bookings</h3>
              {recentBookings.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">No bookings yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-bold">Customer</TableHead>
                      <TableHead className="font-bold">Car</TableHead>
                      <TableHead className="font-bold">Service</TableHead>
                      <TableHead className="font-bold">Station</TableHead>
                      <TableHead className="font-bold">Price</TableHead>
                      <TableHead className="font-bold">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => {
                      const tuning = tuningTypes.find(
                        (t) => t.id === booking.tuningTypeId
                      );
                      const station = stations.find(
                        (s) => s.id === booking.stationId
                      );
                      return (
                        <TableRow key={booking.id} className="border-slate-100">
                          <TableCell className="font-semibold text-slate-900">
                            {booking.customerName}
                          </TableCell>
                          <TableCell className="text-slate-700">{booking.carType}</TableCell>
                          <TableCell className="text-slate-700">
                            {tuning?.name ?? booking.tuningTypeId}
                          </TableCell>
                          <TableCell className="text-slate-600 text-xs">
                            {station?.name ?? booking.stationId}
                          </TableCell>
                          <TableCell className="font-semibold text-orange-600 font-mono">
                            Rs. {booking.totalPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                booking.status === "in-progress"
                                  ? "bg-orange-100 text-orange-800"
                                  : booking.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : booking.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                              }
                            >
                              {booking.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          {/* ── Stations Tab ── */}
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
                            handleUpdateStation(station.id, "location", e.target.value)
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

          {/* ── Tuning Services Tab ── */}
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
                            setNewTuning({ ...newTuning, description: e.target.value })
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
                        <Label>Base Price (Rs.)</Label>
                        <Input
                          type="number"
                          placeholder="5000"
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
                            handleUpdateTuning(tuning.id, "description", e.target.value)
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
                          PRICE (Rs.)
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
                          onClick={() => handleDeleteTuning(tuning.id)}
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

          {/* ── All Bookings Tab ── */}
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
                    <TableHead className="font-bold">Engine</TableHead>
                    <TableHead className="font-bold">Service</TableHead>
                    <TableHead className="font-bold">Contact</TableHead>
                    <TableHead className="font-bold">Price</TableHead>
                    <TableHead className="font-bold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => {
                    const tuning = tuningTypes.find(
                      (t) => t.id === booking.tuningTypeId
                    );
                    return (
                      <TableRow key={booking.id} className="border-slate-200">
                        <TableCell className="font-semibold text-slate-900">
                          {booking.customerName}
                        </TableCell>
                        <TableCell className="text-slate-700">{booking.carType}</TableCell>
                        <TableCell className="text-slate-600 text-xs">
                          <div>{booking.engineType}</div>
                          {booking.enginePower && (
                            <div className="text-slate-400">{booking.enginePower}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-700">
                          {tuning?.name ?? booking.tuningTypeId}
                        </TableCell>
                        <TableCell className="text-slate-600">{booking.contactNumber}</TableCell>
                        <TableCell className="font-semibold text-orange-600 font-mono">
                          Rs. {booking.totalPrice.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              booking.status === "in-progress"
                                ? "bg-orange-100 text-orange-800"
                                : booking.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-blue-100 text-blue-800"
                            }
                          >
                            {booking.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* ── Settings Tab ── */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-slate-900 font-mono">
                  SYSTEM SETTINGS
                </h2>
              </div>

              <div className="space-y-8">
                {/* Business Hours */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                    Business Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">
                        Start Time
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
                        End Time
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
                </div>

                {/* Capacity */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                    Capacity
                  </h3>
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
                </div>

                {/* Working Days */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                    Working Days
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {DAYS.map((day, idx) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const days = newSettings.workingDays.includes(idx)
                            ? newSettings.workingDays.filter((d) => d !== idx)
                            : [...newSettings.workingDays, idx].sort((a, b) => a - b);
                          setNewSettings({ ...newSettings, workingDays: days });
                        }}
                        className={[
                          "px-4 py-2 rounded-lg border text-sm font-semibold transition-colors",
                          newSettings.workingDays.includes(idx)
                            ? "bg-orange-600 text-white border-orange-600"
                            : "bg-white text-slate-500 border-slate-300 hover:border-orange-400",
                        ].join(" ")}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Holidays */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                    Holidays / Closed Days
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Input
                      type="date"
                      value={newHoliday}
                      onChange={(e) => setNewHoliday(e.target.value)}
                      className="border-slate-300 max-w-[200px]"
                    />
                    <Button
                      type="button"
                      onClick={() => {
                        if (
                          newHoliday &&
                          !newSettings.holidays.includes(newHoliday)
                        ) {
                          setNewSettings({
                            ...newSettings,
                            holidays: [
                              ...newSettings.holidays,
                              newHoliday,
                            ].sort(),
                          });
                          setNewHoliday("");
                        }
                      }}
                      variant="outline"
                      className="border-orange-400 text-orange-600 hover:bg-orange-50"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Holiday
                    </Button>
                  </div>

                  {newSettings.holidays.length === 0 ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                      <CalendarX size={16} />
                      <span>No holidays added</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {newSettings.holidays.map((holiday) => (
                        <div
                          key={holiday}
                          className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 text-sm"
                        >
                          <CalendarX size={13} className="text-red-400" />
                          <span className="text-red-700 font-mono">{holiday}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setNewSettings({
                                ...newSettings,
                                holidays: newSettings.holidays.filter(
                                  (h) => h !== holiday
                                ),
                              })
                            }
                            className="text-red-400 hover:text-red-600 ml-0.5 leading-none"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
        </Tabs>
      </div>
    </div>
  );
}
