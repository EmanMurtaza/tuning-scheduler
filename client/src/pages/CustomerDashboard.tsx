import React, { useState } from "react";
import { useScheduler } from "@/contexts/SchedulerContext";
import { StatusBoard } from "@/components/StatusBoard";
import { BookingForm } from "@/components/BookingForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocation } from "wouter";

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function CustomerDashboard() {
  const { stations, bookings, tuningTypes } = useScheduler();
  const [, setLocation] = useLocation();

  const [selectedStationId, setSelectedStationId] = useState<string>(
    stations[0]?.id || ""
  );
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const handleBookSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setBookingDialogOpen(true);
  };

  const myBookings = bookings.filter((b) => b.status !== "cancelled");
  const upcomingBookings = myBookings.filter((b) => b.status === "confirmed");
  const activeBookings = myBookings.filter((b) => b.status === "in-progress");

  const today = new Date();
  const maxDate = addDays(today, 6);

  const canGoBack = viewDate > today;
  const canGoForward = viewDate < maxDate;

  const displayDateLabel = formatDateKey(viewDate) === formatDateKey(today)
    ? "Today"
    : viewDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 text-white sticky top-0 z-30">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center cursor-pointer"
                onClick={() => setLocation("/")}
              >
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-mono tracking-widest text-white">TUNING SCHEDULER</h1>
                <p className="text-slate-500 text-xs tracking-wider">LIVE SLOT STATUS</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/admin")}
              className="border-slate-700 text-slate-400 hover:border-orange-500 hover:text-orange-400 text-xs tracking-wider"
            >
              ADMIN
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick Stats */}
            <Card className="p-4 bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-slate-300 mb-4 font-mono text-xs tracking-widest uppercase">
                Your Bookings
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
                  <span className="text-xs text-slate-400 tracking-wider">Upcoming</span>
                  <span className="text-2xl font-bold text-blue-400 font-mono">
                    {upcomingBookings.length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-amber-900/50">
                  <span className="text-xs text-slate-400 tracking-wider">In Progress</span>
                  <span className="text-2xl font-bold text-amber-400 font-mono">
                    {activeBookings.length}
                  </span>
                </div>
              </div>
            </Card>

            {/* Station Selector */}
            <Card className="p-4 bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-slate-300 mb-3 font-mono text-xs tracking-widest uppercase">
                Filter Station
              </h3>
              <Select value={selectedStationId} onValueChange={setSelectedStationId}>
                <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700">
                  {stations.map((station) => (
                    <SelectItem key={station.id} value={station.id} className="text-slate-200">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-orange-400" />
                        {station.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Date Navigator */}
            <Card className="p-4 bg-slate-900 border border-slate-800">
              <h3 className="font-bold text-slate-300 mb-3 font-mono text-xs tracking-widest uppercase">
                View Date
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setViewDate((d) => addDays(d, -1))}
                  disabled={!canGoBack}
                  className="w-8 h-8 bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-500 disabled:opacity-30"
                >
                  <ChevronLeft size={14} />
                </Button>
                <div className="flex-1 text-center">
                  <div className="text-white font-mono font-bold text-sm">{displayDateLabel}</div>
                  <div className="text-slate-500 text-[10px] font-mono">{formatDateKey(viewDate)}</div>
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setViewDate((d) => addDays(d, 1))}
                  disabled={!canGoForward}
                  className="w-8 h-8 bg-slate-800 border-slate-700 text-slate-300 hover:border-orange-500 disabled:opacity-30"
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </Card>

            {/* Recent Bookings */}
            {myBookings.length > 0 && (
              <Card className="p-4 bg-slate-900 border border-slate-800">
                <h3 className="font-bold text-slate-300 mb-3 font-mono text-xs tracking-widest uppercase">
                  Recent Bookings
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {myBookings.slice(0, 5).map((booking) => {
                    const tuning = tuningTypes.find((t) => t.id === booking.tuningTypeId);
                    return (
                      <div
                        key={booking.id}
                        className="p-2 bg-slate-800 rounded border border-slate-700 text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-200 font-mono">
                            {booking.carType.split(" ").slice(-1)[0].toUpperCase()}
                          </span>
                          <Badge
                            className={[
                              "text-[10px] px-1.5 py-0 font-mono",
                              booking.status === "in-progress"
                                ? "bg-amber-900 text-amber-300 border border-amber-700"
                                : booking.status === "completed"
                                  ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                                  : "bg-slate-700 text-slate-300 border border-slate-600",
                            ].join(" ")}
                          >
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-slate-500">{tuning?.name ?? booking.tuningTypeId}</div>
                        <div className="text-orange-400 font-semibold mt-0.5">${booking.totalPrice}</div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-4">
            {/* Active alert */}
            {activeBookings.length > 0 && (
              <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-amber-300 font-mono text-sm tracking-wider">
                      ACTIVE SESSION
                    </h4>
                    <p className="text-xs text-amber-400/80 mt-1">
                      {activeBookings.length} booking(s) in progress — see the board below for live status.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="board" className="space-y-4">
              <TabsList className="bg-slate-900 border border-slate-800">
                <TabsTrigger
                  value="board"
                  className="font-mono text-xs tracking-wider data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-500"
                >
                  LIVE BOARD
                </TabsTrigger>
                <TabsTrigger
                  value="bookings"
                  className="font-mono text-xs tracking-wider data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-500"
                >
                  MY BOOKINGS
                </TabsTrigger>
              </TabsList>

              <TabsContent value="board">
                <StatusBoard
                  selectedStationId={selectedStationId}
                  selectedDate={formatDateKey(viewDate)}
                  onBookSlot={handleBookSlot}
                />
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                {myBookings.length === 0 ? (
                  <Card className="p-12 text-center bg-slate-900 border border-slate-800">
                    <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-400 mb-2 font-mono">
                      NO BOOKINGS YET
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Click any green slot on the board to book an appointment.
                    </p>
                  </Card>
                ) : (
                  <div className="grid gap-3">
                    {myBookings.map((booking) => {
                      const tuning = tuningTypes.find((t) => t.id === booking.tuningTypeId);
                      return (
                        <Card
                          key={booking.id}
                          className="p-4 bg-slate-900 border border-slate-800 hover:border-orange-600 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="font-bold text-white font-mono">{booking.carType}</h4>
                              <p className="text-sm text-slate-500">{tuning?.name ?? booking.tuningTypeId}</p>
                            </div>
                            <Badge
                              className={[
                                "font-mono text-xs",
                                booking.status === "in-progress"
                                  ? "bg-amber-900 text-amber-300 border border-amber-700"
                                  : booking.status === "completed"
                                    ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                                    : "bg-slate-800 text-slate-300 border border-slate-700",
                              ].join(" ")}
                            >
                              {booking.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                            <div>
                              <span className="text-slate-600 uppercase tracking-wider">Engine</span>
                              <p className="font-semibold text-slate-300 mt-0.5">{booking.engineType}</p>
                            </div>
                            <div>
                              <span className="text-slate-600 uppercase tracking-wider">Contact</span>
                              <p className="font-semibold text-slate-300 mt-0.5">{booking.contactNumber}</p>
                            </div>
                            <div>
                              <span className="text-slate-600 uppercase tracking-wider">Price</span>
                              <p className="font-semibold text-orange-400 mt-0.5">${booking.totalPrice}</p>
                            </div>
                            <div>
                              <span className="text-slate-600 uppercase tracking-wider">Notified</span>
                              <div className="flex gap-1.5 mt-1">
                                {booking.notificationSent && (
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                )}
                                {booking.reminderSent && (
                                  <Clock size={14} className="text-blue-400" />
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Booking Form Dialog */}
      <BookingForm
        stationId={selectedStationId}
        slotId={selectedSlotId}
        open={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
      />
    </div>
  );
}
