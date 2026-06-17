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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle2,
  Zap,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Home,
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
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string>("");
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const handleBookSlot = (slotId: string) => {
    setSelectedSlotId(slotId);
    setBookingDialogOpen(true);
  };

  const myBookings = bookings.filter((b) => b.status !== "cancelled");
  const activeBookings = myBookings.filter((b) => b.status === "in-progress");

  const today = new Date();
  const maxDate = addDays(today, 6);

  const canGoBack = viewDate > today;
  const canGoForward = viewDate < maxDate;

  const displayDateLabel =
    formatDateKey(viewDate) === formatDateKey(today)
      ? "Today"
      : viewDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

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
                <h1 className="text-xl font-bold font-mono tracking-widest text-white">
                  TUNING SCHEDULER
                </h1>
                <p className="text-slate-500 text-xs tracking-wider">LIVE SLOT STATUS</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation("/")}
                className="text-slate-400 hover:text-white hover:bg-slate-800 text-xs tracking-wider gap-1.5"
              >
                <Home size={13} />
                HOME
              </Button>
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
      </div>

      <div className="container py-6 space-y-4">
        {/* Filter Bar */}
        <div className="flex items-center gap-3 flex-wrap bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          {/* Station filter */}
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-orange-400 shrink-0" />
            <Select value={selectedStationId} onValueChange={setSelectedStationId}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-slate-200 h-8 w-52 font-mono text-xs">
                <SelectValue placeholder="Select station" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700">
                {stations.map((station) => (
                  <SelectItem
                    key={station.id}
                    value={station.id}
                    className="text-slate-200 font-mono text-xs"
                  >
                    {station.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-px h-6 bg-slate-700 hidden sm:block" />

          {/* Date navigator */}
          <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-lg h-8 px-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setViewDate((d) => addDays(d, -1))}
              disabled={!canGoBack}
              className="w-5 h-5 text-slate-400 hover:text-white disabled:opacity-30 p-0"
            >
              <ChevronLeft size={13} />
            </Button>
            <div className="px-2 min-w-[120px] text-center">
              <span className="text-white font-mono font-bold text-xs">{displayDateLabel}</span>
              <span className="text-slate-600 text-[10px] font-mono ml-1.5">{formatDateKey(viewDate)}</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setViewDate((d) => addDays(d, 1))}
              disabled={!canGoForward}
              className="w-5 h-5 text-slate-400 hover:text-white disabled:opacity-30 p-0"
            >
              <ChevronRight size={13} />
            </Button>
          </div>

          {/* My Bookings button */}
          <Button
            onClick={() => setMyBookingsOpen(true)}
            variant="outline"
            size="sm"
            className="ml-auto border-slate-700 text-slate-300 hover:border-orange-500 hover:text-orange-400 font-mono tracking-wider text-xs gap-2 h-8"
          >
            <BookOpen size={13} />
            MY BOOKINGS
            {myBookings.length > 0 && (
              <span className="bg-orange-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {myBookings.length}
              </span>
            )}
          </Button>
        </div>

        {/* Active session alert */}
        {activeBookings.length > 0 && (
          <div className="bg-amber-950 border border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-300 font-mono text-sm tracking-wider">
                  ACTIVE SESSION
                </h4>
                <p className="text-xs text-amber-400/80 mt-1">
                  {activeBookings.length} booking(s) in progress — live status shown on the board below.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Booking Grid — full width */}
        <StatusBoard
          selectedStationId={selectedStationId}
          selectedDate={formatDateKey(viewDate)}
          onBookSlot={handleBookSlot}
        />
      </div>

      {/* My Bookings Dialog */}
      <Dialog open={myBookingsOpen} onOpenChange={setMyBookingsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-950 border border-slate-800">
          <DialogHeader>
            <DialogTitle className="font-mono text-white tracking-wider text-lg">
              MY BOOKINGS
            </DialogTitle>
          </DialogHeader>

          {myBookings.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500 font-mono text-sm tracking-wider uppercase">
                No Bookings Yet
              </p>
              <p className="text-slate-600 text-xs mt-2">
                Click any green OPEN slot on the board to book an appointment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookings.map((booking) => {
                const tuning = tuningTypes.find(
                  (t) => t.id === booking.tuningTypeId
                );
                return (
                  <Card
                    key={booking.id}
                    className="p-4 bg-slate-900 border border-slate-800"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-white font-mono">
                          {booking.carType}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {tuning?.name ?? booking.tuningTypeId}
                        </p>
                      </div>
                      <Badge
                        className={[
                          "font-mono text-xs",
                          booking.status === "pending"
                            ? "bg-yellow-900 text-yellow-300 border border-yellow-700"
                            : booking.status === "in-progress"
                              ? "bg-amber-900 text-amber-300 border border-amber-700"
                              : booking.status === "completed"
                                ? "bg-emerald-900 text-emerald-300 border border-emerald-700"
                                : booking.status === "confirmed"
                                  ? "bg-blue-900 text-blue-300 border border-blue-700"
                                  : "bg-slate-800 text-slate-300 border border-slate-700",
                        ].join(" ")}
                      >
                        {booking.status === "pending" ? "PENDING APPROVAL" : booking.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div>
                        <span className="text-slate-600 uppercase tracking-wider">Engine</span>
                        <p className="font-semibold text-slate-300 mt-0.5">{booking.engineType}</p>
                        {booking.enginePower && (
                          <p className="text-slate-500 mt-0.5">{booking.enginePower}</p>
                        )}
                      </div>
                      <div>
                        <span className="text-slate-600 uppercase tracking-wider">Contact</span>
                        <p className="font-semibold text-slate-300 mt-0.5">
                          {booking.contactNumber}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-600 uppercase tracking-wider">Price</span>
                        <p className="font-semibold text-orange-400 mt-0.5">
                          Rs. {booking.totalPrice.toLocaleString()}
                        </p>
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
        </DialogContent>
      </Dialog>

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
