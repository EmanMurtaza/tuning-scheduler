import React, { useState, useMemo } from "react";
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
  Home,
  Clock,
  X,
  Printer,
  ChevronRight,
  AlertCircle,
  Play,
  CheckSquare,
} from "lucide-react";
import { Booking, TuningType, Station } from "@/lib/mockData";
import { nanoid } from "nanoid";
import { useLocation } from "wouter";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";
const AUTH_KEY = "tuning_admin_auth";

// ─── Status helpers ───────────────────────────────────────────────────────────

function statusBadgeClass(status: Booking["status"]) {
  switch (status) {
    case "pending":      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "confirmed":    return "bg-blue-100 text-blue-800 border border-blue-300";
    case "in-progress":  return "bg-orange-100 text-orange-800 border border-orange-300";
    case "completed":    return "bg-green-100 text-green-800 border border-green-300";
    case "cancelled":    return "bg-red-100 text-red-800 border border-red-300";
  }
}

function statusLabel(status: Booking["status"]) {
  switch (status) {
    case "pending":     return "PENDING";
    case "confirmed":   return "CONFIRMED";
    case "in-progress": return "IN PROGRESS";
    case "completed":   return "DONE";
    case "cancelled":   return "CANCELLED";
  }
}

// ─── Print Invoice ────────────────────────────────────────────────────────────

function printInvoice(booking: Booking, tuningName: string, stationName: string, slotTime: string) {
  const now = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Invoice – ${booking.id}</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Arial,sans-serif;padding:48px;color:#1e293b;font-size:14px}
    .logo{display:flex;align-items:center;gap:12px;margin-bottom:32px}
    .logo-icon{width:44px;height:44px;background:#ea580c;border-radius:4px;display:flex;align-items:center;justify-content:center}
    .logo-icon svg{width:26px;height:26px;fill:white}
    .logo h1{font-size:22px;font-weight:800;letter-spacing:4px;font-family:monospace}
    .logo p{font-size:11px;color:#64748b;letter-spacing:2px}
    .divider{border:none;border-top:2px solid #e2e8f0;margin:24px 0}
    .header-row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px}
    .invoice-title{font-size:28px;font-weight:700;color:#0f172a}
    .invoice-meta{text-align:right;font-size:12px;color:#64748b;line-height:1.8}
    .invoice-meta strong{color:#1e293b;font-size:13px}
    .section-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#64748b;margin-bottom:12px}
    .info-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px}
    .info-block p{font-size:12px;color:#64748b;margin-bottom:4px}
    .info-block strong{font-size:14px;color:#1e293b;display:block}
    table{width:100%;border-collapse:collapse;margin-bottom:24px}
    th{background:#f8fafc;text-align:left;padding:10px 14px;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;border-bottom:2px solid #e2e8f0}
    td{padding:12px 14px;border-bottom:1px solid #f1f5f9;font-size:13px;color:#334155}
    .total-row td{font-size:15px;font-weight:700;color:#0f172a;background:#fafafa;border-top:2px solid #e2e8f0;border-bottom:none}
    .status-badge{display:inline-block;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;letter-spacing:1px;background:#dbeafe;color:#1e40af}
    .footer{margin-top:40px;text-align:center;font-size:11px;color:#94a3b8;letter-spacing:1px}
    @media print{body{padding:24px}}
  </style></head><body>
  <div class="logo">
    <div class="logo-icon"><svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
    <div><h1>TUNING SCHEDULER</h1><p>WORKSHOP INVOICE</p></div>
  </div>
  <hr class="divider"/>
  <div class="header-row">
    <div><div class="invoice-title">Invoice</div><span class="status-badge">${statusLabel(booking.status)}</span></div>
    <div class="invoice-meta">
      <p>Invoice No: <strong>#${booking.id.slice(-8).toUpperCase()}</strong></p>
      <p>Date: <strong>${now}</strong></p>
      <p>Booking Ref: <strong>${booking.id}</strong></p>
    </div>
  </div>
  <div class="info-grid">
    <div>
      <div class="section-title">Customer</div>
      <div class="info-block">
        <p>Name</p><strong>${booking.customerName}</strong>
        <p style="margin-top:8px">Contact</p><strong>${booking.contactNumber}</strong>
      </div>
    </div>
    <div>
      <div class="section-title">Appointment</div>
      <div class="info-block">
        <p>Station</p><strong>${stationName}</strong>
        <p style="margin-top:8px">Time Slot</p><strong>${slotTime}</strong>
      </div>
    </div>
  </div>
  <div class="section-title">Vehicle</div>
  <div class="info-grid" style="margin-bottom:28px">
    <div class="info-block"><p>Car</p><strong>${booking.carType}</strong></div>
    <div class="info-block"><p>Engine</p><strong>${booking.engineType}${booking.enginePower ? " · " + booking.enginePower : ""}</strong></div>
  </div>
  <div class="section-title">Services</div>
  <table>
    <thead><tr><th>Service</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
    <tbody>
      <tr><td>${tuningName}</td><td>Professional tuning service</td><td style="text-align:right">Rs. ${booking.totalPrice.toLocaleString()}</td></tr>
    </tbody>
    <tfoot>
      <tr class="total-row"><td colspan="2">Total</td><td style="text-align:right">Rs. ${booking.totalPrice.toLocaleString()}</td></tr>
    </tfoot>
  </table>
  <div class="footer">Thank you for choosing our workshop · TUNING SCHEDULER</div>
  <script>window.onload=function(){window.print()}</script>
  </body></html>`;

  const win = window.open("", "_blank");
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

// ─── Booking Detail Dialog ────────────────────────────────────────────────────

function BookingDetailDialog({
  booking,
  open,
  onClose,
}: {
  booking: Booking | null;
  open: boolean;
  onClose: () => void;
}) {
  const { tuningTypes, stations, timeSlots, updateBooking, cancelBooking } = useScheduler();

  if (!booking) return null;

  const tuning = tuningTypes.find((t) => t.id === booking.tuningTypeId);
  const station = stations.find((s) => s.id === booking.stationId);
  const slot = timeSlots.find((s) => s.id === booking.slotId);
  const slotTime = slot ? `${slot.startTime} – ${slot.endTime} · Bay ${slot.bayNumber}` : "—";

  const handleStatusChange = (newStatus: Booking["status"]) => {
    updateBooking(booking.id, { status: newStatus });
    toast.success(`Booking marked as ${statusLabel(newStatus)}`);
  };

  const handleCancel = () => {
    cancelBooking(booking.id);
    toast.success("Booking cancelled");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-lg flex items-center gap-2">
            Booking Details
            <Badge className={statusBadgeClass(booking.status)}>
              {statusLabel(booking.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-1">
          {/* Customer */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Name</p>
                <p className="font-semibold text-slate-900">{booking.customerName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Contact</p>
                <p className="font-semibold text-slate-900">{booking.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Vehicle */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vehicle</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Car</p>
                <p className="font-semibold text-slate-900">{booking.carType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Engine</p>
                <p className="font-semibold text-slate-900">{booking.engineType}</p>
                {booking.enginePower && <p className="text-xs text-slate-400">{booking.enginePower}</p>}
              </div>
            </div>
          </div>

          {/* Appointment */}
          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Appointment</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Station</p>
                <p className="font-semibold text-slate-900">{station?.name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Slot</p>
                <p className="font-semibold text-slate-900 font-mono text-sm">{slotTime}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Service</p>
                <p className="font-semibold text-slate-900">{tuning?.name ?? booking.tuningTypeId}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Price</p>
                <p className="font-bold text-orange-600 font-mono">Rs. {booking.totalPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Status actions */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Change Status</p>
            <div className="flex flex-wrap gap-2">
              {booking.status === "pending" && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                  onClick={() => handleStatusChange("confirmed")}
                >
                  <CheckCircle2 size={14} /> Confirm
                </Button>
              )}
              {booking.status === "confirmed" && (
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5"
                  onClick={() => handleStatusChange("in-progress")}
                >
                  <Play size={14} /> Start Service
                </Button>
              )}
              {booking.status === "in-progress" && (
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                  onClick={() => handleStatusChange("completed")}
                >
                  <CheckSquare size={14} /> Mark Done
                </Button>
              )}
              {booking.status !== "cancelled" && booking.status !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 gap-1.5"
                  onClick={handleCancel}
                >
                  <X size={14} /> Cancel
                </Button>
              )}
            </div>
          </div>

          {/* Print invoice */}
          <Button
            variant="outline"
            className="w-full border-slate-300 gap-2"
            onClick={() =>
              printInvoice(
                booking,
                tuning?.name ?? booking.tuningTypeId,
                station?.name ?? "—",
                slotTime
              )
            }
          >
            <Printer size={15} />
            Print PDF Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Admin Booking Grid (compact) ─────────────────────────────────────────────

function AdminBookingGrid({ dateKey }: { dateKey: string }) {
  const { stations, timeSlots, bookings, settings } = useScheduler();

  const workingDays = settings.workingDays ?? [1, 2, 3, 4, 5];
  const holidays = settings.holidays ?? [];
  const viewedDay = new Date(dateKey + "T00:00:00").getDay();
  const isClosed = !workingDays.includes(viewedDay) || holidays.includes(dateKey);

  if (isClosed) {
    return (
      <div className="text-center py-8 text-slate-400 text-sm font-mono">
        Workshop closed on {dateKey}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {stations.map((station) => {
        const stationSlots = timeSlots.filter(
          (s) => s.stationId === station.id && s.id.includes(dateKey)
        );
        const allTimes = Array.from(new Set(stationSlots.map((s) => s.startTime))).sort();
        const bays = Array.from({ length: station.maxParallelCars }, (_, i) => i + 1);

        // Pre-compute merged cells (same customer, consecutive bays, same time)
        const absorbed = new Set<string>();
        const spans: Record<string, number> = {};

        for (const time of allTimes) {
          for (let bi = 0; bi < bays.length; bi++) {
            const bay = bays[bi];
            const key = `${bay}-${time}`;
            if (absorbed.has(key)) continue;

            const slot = stationSlots.find((s) => s.bayNumber === bay && s.startTime === time);
            const bkg = slot
              ? bookings.find((b) => b.slotId === slot.id && b.status !== "cancelled")
              : null;
            if (!bkg) continue;

            let span = 1;
            for (let ni = bi + 1; ni < bays.length; ni++) {
              const nb = bays[ni];
              const ns = stationSlots.find((s) => s.bayNumber === nb && s.startTime === time);
              const nb2 = ns
                ? bookings.find((b) => b.slotId === ns.id && b.status !== "cancelled")
                : null;
              if (nb2 && nb2.customerName === bkg.customerName) {
                span++;
                absorbed.add(`${nb}-${time}`);
              } else break;
            }
            spans[key] = span;
          }
        }

        return (
          <div key={station.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin size={13} className="text-orange-500" />
              <span className="font-bold text-slate-800 text-sm">{station.name}</span>
              <span className="text-xs text-slate-400">{station.location}</span>
            </div>
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="min-w-max border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="w-14 p-1.5 text-[10px] font-bold text-slate-500 border-r border-slate-200 text-center">
                      BAY
                    </th>
                    {allTimes.map((t) => (
                      <th
                        key={t}
                        className="min-w-[56px] px-1 py-1.5 text-[9px] font-mono text-slate-500 border-r border-slate-100 text-center font-bold"
                      >
                        {t}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bays.map((bay) => (
                    <tr key={bay} className="border-t border-slate-100">
                      <td className="text-[10px] font-bold text-slate-500 font-mono text-center border-r border-slate-200 py-0.5">
                        B{bay}
                      </td>
                      {allTimes.map((time) => {
                        const cellKey = `${bay}-${time}`;
                        if (absorbed.has(cellKey)) return null;

                        const rowSpan = spans[cellKey] ?? 1;
                        const slot = stationSlots.find(
                          (s) => s.bayNumber === bay && s.startTime === time
                        );
                        const bkg = slot
                          ? bookings.find(
                              (b) => b.slotId === slot.id && b.status !== "cancelled"
                            )
                          : null;

                        if (!slot) {
                          return (
                            <td
                              key={time}
                              rowSpan={rowSpan}
                              className="p-0.5 border-r border-slate-100"
                            >
                              <div className="h-7 rounded bg-slate-100" />
                            </td>
                          );
                        }

                        if (!bkg) {
                          return (
                            <td
                              key={time}
                              rowSpan={rowSpan}
                              className="p-0.5 border-r border-slate-100"
                            >
                              <div className="h-7 rounded bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                <span className="text-[8px] font-mono text-emerald-500 font-bold">
                                  OPEN
                                </span>
                              </div>
                            </td>
                          );
                        }

                        const cellColor =
                          bkg.status === "pending"
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                            : bkg.status === "confirmed"
                              ? "bg-blue-50 border-blue-200 text-blue-700"
                              : bkg.status === "in-progress"
                                ? "bg-orange-50 border-orange-200 text-orange-700"
                                : "bg-green-50 border-green-200 text-green-700";

                        return (
                          <td
                            key={time}
                            rowSpan={rowSpan}
                            className="p-0.5 border-r border-slate-100"
                          >
                            <div
                              className={`rounded border flex flex-col items-center justify-center px-1 ${cellColor}`}
                              style={{ minHeight: rowSpan > 1 ? `${rowSpan * 28}px` : "28px" }}
                            >
                              <span className="text-[9px] font-bold truncate max-w-[52px] leading-tight">
                                {bkg.customerName.split(" ")[0]}
                              </span>
                              {rowSpan > 1 && (
                                <span className="text-[8px] opacity-60">{rowSpan} bays</span>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allTimes.length === 0 && (
              <p className="text-xs text-slate-400 pl-2">No slots for this date.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Admin Login ──────────────────────────────────────────────────────────────

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
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-sm flex items-center justify-center mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-mono tracking-widest text-white uppercase">
            Admin Panel
          </h1>
          <p className="text-slate-500 text-xs tracking-wider mt-1">TUNING SCHEDULER</p>
        </div>

        <Card className="bg-slate-900 border border-slate-800 p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={15} className="text-orange-400" />
            <span className="text-slate-300 text-sm font-mono tracking-wider uppercase">Sign In</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Username</Label>
              <Input
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="mt-1.5 bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-orange-500"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</Label>
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

            {error && <p className="text-red-400 text-xs font-mono">{error}</p>}

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

// ─── Main AdminPanel ──────────────────────────────────────────────────────────

export default function AdminPanel() {
  const {
    stations,
    tuningTypes,
    bookings,
    settings,
    updateStation,
    updateSettings,
    updateBooking,
    cancelBooking,
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

  // Bookings page state
  const [bookingsTab, setBookingsTab] = useState<"pending" | "all">("pending");
  const [statusFilter, setStatusFilter] = useState<Booking["status"] | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [gridDate, setGridDate] = useState(new Date().toISOString().split("T")[0]);

  // useMemo must be called unconditionally (before any early return)
  const filteredBookings = useMemo(() => {
    if (statusFilter === "all") return [...bookings].reverse();
    return [...bookings].reverse().filter((b) => b.status === statusFilter);
  }, [bookings, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const handleUpdateStation = (stationId: string, field: string, value: any) => {
    updateStation(stationId, { [field]: value });
    toast.success("Station updated");
  };

  const handleAddTuning = () => {
    if (!newTuning.name || !newTuning.duration || newTuning.basePrice === undefined) {
      toast.error("Please fill in all fields");
      return;
    }
    addTuningType({
      id: `tuning-${nanoid()}`,
      name: newTuning.name,
      description: newTuning.description || "",
      duration: newTuning.duration,
      basePrice: newTuning.basePrice,
    });
    setNewTuning({});
    toast.success("Tuning type added");
  };

  const handleUpdateSettings = () => {
    updateSettings(newSettings);
    toast.success("Settings saved");
  };

  // Derived counts
  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
  const inProgressBookings = bookings.filter((b) => b.status === "in-progress");
  const completedBookings = bookings.filter((b) => b.status === "completed");
  const totalRevenue = bookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const completedRevenue = completedBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);
  const recentBookings = [...bookings].reverse().slice(0, 8);

  const openDetail = (b: Booking) => {
    setSelectedBooking(b);
    setDetailOpen(true);
  };

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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-slate-400 hover:text-white hover:bg-slate-700 font-mono text-xs tracking-wider gap-1.5"
              >
                <Home size={13} /> HOME
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-slate-600 text-slate-400 hover:border-red-500 hover:text-red-400 font-mono text-xs tracking-wider gap-1.5"
              >
                <LogOut size={13} /> LOGOUT
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList className="bg-white border-2 border-slate-200 h-10 flex-wrap">
            <TabsTrigger value="dashboard" className="flex items-center gap-1.5 text-sm">
              <LayoutDashboard size={13} /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-sm flex items-center gap-1.5">
              Bookings
              {pendingBookings.length > 0 && (
                <span className="bg-yellow-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {pendingBookings.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="stations" className="text-sm">Stations</TabsTrigger>
            <TabsTrigger value="services" className="text-sm">Tuning Services</TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5 text-sm">
              <Settings size={13} /> Settings
            </TabsTrigger>
          </TabsList>

          {/* ── Dashboard Tab ── */}
          <TabsContent value="dashboard" className="space-y-6">
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

              <Card className="p-5 bg-white border-2 border-yellow-200 border-l-4 border-l-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{pendingBookings.length}</p>
                    <p className="text-xs text-slate-400 mt-0.5">awaiting confirmation</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
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
                          <span className="text-sm font-semibold text-slate-700">{station.name}</span>
                          <span className="text-xs text-slate-500 font-mono">
                            {station.currentCars}/{station.maxParallelCars} bays
                          </span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct > 80 ? "bg-red-500" : pct > 50 ? "bg-orange-500" : "bg-emerald-500"
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

            {/* Recent bookings */}
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
                      const tuning = tuningTypes.find((t) => t.id === booking.tuningTypeId);
                      const station = stations.find((s) => s.id === booking.stationId);
                      return (
                        <TableRow
                          key={booking.id}
                          className="border-slate-100 cursor-pointer hover:bg-slate-50"
                          onClick={() => openDetail(booking)}
                        >
                          <TableCell className="font-semibold text-slate-900">{booking.customerName}</TableCell>
                          <TableCell className="text-slate-700">{booking.carType}</TableCell>
                          <TableCell className="text-slate-700">{tuning?.name ?? booking.tuningTypeId}</TableCell>
                          <TableCell className="text-slate-600 text-xs">{station?.name ?? booking.stationId}</TableCell>
                          <TableCell className="font-semibold text-orange-600 font-mono">
                            Rs. {booking.totalPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusBadgeClass(booking.status)}>
                              {statusLabel(booking.status)}
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

          {/* ── Bookings Tab ── */}
          <TabsContent value="bookings" className="space-y-6">
            {/* Inner tab strip: Pending / All Bookings */}
            <div className="flex gap-2 border-b border-slate-200 pb-0">
              <button
                onClick={() => setBookingsTab("pending")}
                className={[
                  "px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2",
                  bookingsTab === "pending"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                Pending Requests
                {pendingBookings.length > 0 && (
                  <span className="bg-yellow-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
                    {pendingBookings.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setBookingsTab("all")}
                className={[
                  "px-4 py-2 text-sm font-semibold border-b-2 transition-colors",
                  bookingsTab === "all"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-slate-500 hover:text-slate-700",
                ].join(" ")}
              >
                All Bookings
              </button>
            </div>

            {/* ─ Pending Requests ─ */}
            {bookingsTab === "pending" && (
              <div className="space-y-4">
                {pendingBookings.length === 0 ? (
                  <Card className="p-12 bg-white border-2 border-slate-200 text-center">
                    <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">No pending requests</p>
                    <p className="text-slate-400 text-sm mt-1">All bookings have been reviewed.</p>
                  </Card>
                ) : (
                  pendingBookings.map((booking) => {
                    const tuning = tuningTypes.find((t) => t.id === booking.tuningTypeId);
                    const station = stations.find((s) => s.id === booking.stationId);
                    return (
                      <Card
                        key={booking.id}
                        className="p-5 bg-white border-2 border-yellow-200 hover:border-yellow-300 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={statusBadgeClass("pending")}>PENDING</Badge>
                              <span className="text-xs text-slate-400 font-mono">
                                {new Date(booking.bookingTime).toLocaleString()}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Customer</p>
                                <p className="font-bold text-slate-900">{booking.customerName}</p>
                                <p className="text-xs text-slate-500">{booking.contactNumber}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Vehicle</p>
                                <p className="font-semibold text-slate-800">{booking.carType}</p>
                                <p className="text-xs text-slate-500">{booking.engineType}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Service</p>
                                <p className="font-semibold text-slate-800">{tuning?.name ?? booking.tuningTypeId}</p>
                                <p className="text-xs text-slate-500">{station?.name}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide">Price</p>
                                <p className="font-bold text-orange-600 font-mono">
                                  Rs. {booking.totalPrice.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 min-w-[100px]"
                              onClick={() => {
                                updateBooking(booking.id, { status: "confirmed" });
                                toast.success(`Booking confirmed for ${booking.customerName}`);
                              }}
                            >
                              <CheckCircle2 size={14} /> Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-300 text-red-600 hover:bg-red-50 gap-1.5 min-w-[100px]"
                              onClick={() => {
                                cancelBooking(booking.id);
                                toast.success("Booking cancelled");
                              }}
                            >
                              <X size={14} /> Decline
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-slate-500 gap-1.5"
                              onClick={() => openDetail(booking)}
                            >
                              <Eye size={13} /> Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>
            )}

            {/* ─ All Bookings ─ */}
            {bookingsTab === "all" && (
              <div className="space-y-4">
                {/* Status filter */}
                <div className="flex flex-wrap gap-2">
                  {(["all", "pending", "confirmed", "in-progress", "completed", "cancelled"] as const).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={[
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                          statusFilter === s
                            ? "bg-orange-600 text-white border-orange-600"
                            : "bg-white text-slate-600 border-slate-300 hover:border-orange-400",
                        ].join(" ")}
                      >
                        {s === "all" ? "All" : statusLabel(s as Booking["status"])}
                        {s !== "all" && (
                          <span className="ml-1 opacity-70">
                            ({bookings.filter((b) => b.status === s).length})
                          </span>
                        )}
                      </button>
                    )
                  )}
                </div>

                {/* Bookings list */}
                <Card className="bg-white border-2 border-slate-200 overflow-x-auto">
                  {filteredBookings.length === 0 ? (
                    <div className="p-12 text-center">
                      <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400 text-sm">No bookings found</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-200">
                          <TableHead className="font-bold">Customer</TableHead>
                          <TableHead className="font-bold">Car</TableHead>
                          <TableHead className="font-bold">Engine</TableHead>
                          <TableHead className="font-bold">Service</TableHead>
                          <TableHead className="font-bold">Station</TableHead>
                          <TableHead className="font-bold">Price</TableHead>
                          <TableHead className="font-bold">Status</TableHead>
                          <TableHead />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredBookings.map((booking) => {
                          const tuning = tuningTypes.find((t) => t.id === booking.tuningTypeId);
                          const station = stations.find((s) => s.id === booking.stationId);
                          return (
                            <TableRow
                              key={booking.id}
                              className="border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors"
                              onClick={() => openDetail(booking)}
                            >
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
                              <TableCell className="text-slate-600 text-xs">
                                {station?.name ?? booking.stationId}
                              </TableCell>
                              <TableCell className="font-semibold text-orange-600 font-mono">
                                Rs. {booking.totalPrice.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <Badge className={statusBadgeClass(booking.status)}>
                                  {statusLabel(booking.status)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <ChevronRight size={15} className="text-slate-400" />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </Card>

                {/* Admin booking grid */}
                <Card className="p-6 bg-white border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Schedule Grid</h3>
                    <Input
                      type="date"
                      value={gridDate}
                      onChange={(e) => setGridDate(e.target.value)}
                      className="border-slate-300 w-40 text-sm h-8"
                    />
                  </div>
                  <AdminBookingGrid dateKey={gridDate} />
                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 text-[11px] text-slate-500">
                    {[
                      { color: "bg-yellow-100 border-yellow-300", label: "Pending" },
                      { color: "bg-blue-100 border-blue-300", label: "Confirmed" },
                      { color: "bg-orange-100 border-orange-300", label: "In Progress" },
                      { color: "bg-green-100 border-green-300", label: "Done" },
                      { color: "bg-emerald-50 border-emerald-200", label: "Open" },
                    ].map(({ color, label }) => (
                      <span key={label} className="flex items-center gap-1.5">
                        <span className={`w-3 h-3 rounded border ${color} inline-block`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* ── Stations Tab ── */}
          <TabsContent value="stations" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 font-mono">MANAGE STATIONS</h2>
              <div className="space-y-4">
                {stations.map((station) => (
                  <div
                    key={station.id}
                    className="p-4 bg-slate-50 rounded border-2 border-slate-200 hover:border-orange-300 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">STATION NAME</Label>
                        <Input
                          value={station.name}
                          onChange={(e) => handleUpdateStation(station.id, "name", e.target.value)}
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">LOCATION</Label>
                        <Input
                          value={station.location}
                          onChange={(e) => handleUpdateStation(station.id, "location", e.target.value)}
                          className="mt-1 border-slate-300"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">MAX PARALLEL CARS (BAYS)</Label>
                        <Input
                          type="number"
                          min={1}
                          max={20}
                          value={station.maxParallelCars}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v) && v > 0) handleUpdateStation(station.id, "maxParallelCars", v);
                          }}
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">CURRENT CARS</Label>
                        <Input
                          type="number"
                          min={0}
                          value={station.currentCars}
                          onChange={(e) => {
                            const v = parseInt(e.target.value);
                            if (!isNaN(v) && v >= 0) handleUpdateStation(station.id, "currentCars", v);
                          }}
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
                <h2 className="text-2xl font-bold text-slate-900 font-mono">TUNING SERVICES</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                      <Plus size={16} className="mr-2" /> Add Service
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
                          onChange={(e) => setNewTuning({ ...newTuning, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          placeholder="Brief description"
                          value={newTuning.description || ""}
                          onChange={(e) => setNewTuning({ ...newTuning, description: e.target.value })}
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
                            setNewTuning({ ...newTuning, duration: parseInt(e.target.value) })
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
                            setNewTuning({ ...newTuning, basePrice: parseInt(e.target.value) })
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
                        <Label className="text-xs font-semibold text-slate-600">SERVICE NAME</Label>
                        <Input
                          value={tuning.name}
                          onChange={(e) => updateTuningType(tuning.id, { name: e.target.value })}
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">DESCRIPTION</Label>
                        <Input
                          value={tuning.description}
                          onChange={(e) => updateTuningType(tuning.id, { description: e.target.value })}
                          className="mt-1 border-slate-300"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">DURATION (MIN)</Label>
                        <Input
                          type="number"
                          value={tuning.duration}
                          onChange={(e) =>
                            updateTuningType(tuning.id, { duration: parseInt(e.target.value) })
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div>
                        <Label className="text-xs font-semibold text-slate-600">PRICE (Rs.)</Label>
                        <Input
                          type="number"
                          value={tuning.basePrice}
                          onChange={(e) =>
                            updateTuningType(tuning.id, { basePrice: parseInt(e.target.value) })
                          }
                          className="mt-1 border-slate-300"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            deleteTuningType(tuning.id);
                            toast.success("Tuning type deleted");
                          }}
                          className="w-full border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ── Settings Tab ── */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6 bg-white border-2 border-slate-200">
              <div className="flex items-center gap-2 mb-6">
                <Settings className="w-6 h-6 text-orange-500" />
                <h2 className="text-2xl font-bold text-slate-900 font-mono">SYSTEM SETTINGS</h2>
              </div>

              <div className="space-y-8">
                {/* Business Hours */}
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                    Business Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">Start Time</Label>
                      <Input
                        type="time"
                        value={newSettings.businessHours.startTime}
                        onChange={(e) =>
                          setNewSettings({
                            ...newSettings,
                            businessHours: { ...newSettings.businessHours, startTime: e.target.value },
                          })
                        }
                        className="mt-2 border-slate-300"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-slate-700">End Time</Label>
                      <Input
                        type="time"
                        value={newSettings.businessHours.endTime}
                        onChange={(e) =>
                          setNewSettings({
                            ...newSettings,
                            businessHours: { ...newSettings.businessHours, endTime: e.target.value },
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
                      <Label className="text-sm font-semibold text-slate-700">Slot Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={newSettings.slotDuration}
                        onChange={(e) =>
                          setNewSettings({ ...newSettings, slotDuration: parseInt(e.target.value) })
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
                        if (newHoliday && !newSettings.holidays.includes(newHoliday)) {
                          setNewSettings({
                            ...newSettings,
                            holidays: [...newSettings.holidays, newHoliday].sort(),
                          });
                          setNewHoliday("");
                        }
                      }}
                      variant="outline"
                      className="border-orange-400 text-orange-600 hover:bg-orange-50"
                    >
                      <Plus size={14} className="mr-1" /> Add Holiday
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
                                holidays: newSettings.holidays.filter((h) => h !== holiday),
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

      {/* Booking detail dialog */}
      <BookingDetailDialog
        booking={selectedBooking}
        open={detailOpen}
        onClose={() => {
          setDetailOpen(false);
          setSelectedBooking(null);
        }}
      />
    </div>
  );
}
