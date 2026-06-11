import React, { useState, useEffect, useRef } from "react";
import { useScheduler } from "@/contexts/SchedulerContext";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Wifi, Ban, CalendarX } from "lucide-react";

interface StatusBoardProps {
  selectedStationId?: string;
  selectedDate?: string; // ISO date string yyyy-mm-dd
  onBookSlot?: (slotId: string) => void;
}

// Flip cell: animates when its key changes (status flip)
function FlipCell({
  value,
  available,
  isPast,
  isCurrent,
  onClick,
}: {
  value: string;
  available: boolean;
  isPast: boolean;
  isCurrent: boolean;
  onClick?: () => void;
}) {
  const canClick = available && !isPast && !!onClick;

  const baseClass = [
    "relative flex items-center justify-center min-w-[72px] h-10 rounded-sm border text-[11px] font-mono font-bold tracking-wide select-none transition-colors duration-150",
    isCurrent ? "border-amber-400 ring-1 ring-amber-400" : "border-slate-700",
    isPast
      ? "bg-slate-900 border-slate-800 text-slate-700 opacity-50"
      : available
        ? "bg-slate-950 text-emerald-400 border-emerald-800"
        : "bg-slate-800 text-slate-500 border-slate-700",
    canClick
      ? "cursor-pointer hover:bg-emerald-950 hover:border-emerald-500 hover:shadow-[0_0_8px_rgba(52,211,153,0.4)] active:scale-95"
      : "",
  ].join(" ");

  return (
    // Outer div handles all pointer events — keeps clicks reliable regardless of inner animation
    <div
      className={baseClass}
      onClick={canClick ? onClick : undefined}
      style={{ overflow: "hidden" }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={value + (isPast ? "-past" : available ? "-open" : "-booked")}
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 14, opacity: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="pointer-events-none flex items-center justify-center w-full"
        >
          {isPast ? (
            <span>——</span>
          ) : available ? (
            <span className="uppercase">OPEN</span>
          ) : (
            <span className="uppercase tracking-widest">BOOKED</span>
          )}
        </motion.span>
      </AnimatePresence>
      {isCurrent && (
        <span className="pointer-events-none absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      )}
    </div>
  );
}

// Time header cell
function TimeHeader({ time, isCurrent }: { time: string; isCurrent: boolean }) {
  return (
    <div
      className={[
        "min-w-[72px] h-8 flex items-center justify-center text-[10px] font-mono font-bold tracking-widest rounded-sm",
        isCurrent
          ? "bg-amber-400 text-slate-900"
          : "text-slate-500 bg-slate-900",
      ].join(" ")}
    >
      {time}
    </div>
  );
}

export function StatusBoard({ selectedStationId, selectedDate, onBookSlot }: StatusBoardProps) {
  const { stations, timeSlots, bookings, settings } = useScheduler();
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll to current time on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    const currentHour = currentTime.getHours();
    const startHour = 9;
    if (currentHour >= startHour && currentHour <= 17) {
      const cellWidth = 80;
      const offset = (currentHour - startHour) * 2 * cellWidth;
      scrollRef.current.scrollLeft = Math.max(0, offset - 100);
    }
  }, []);

  const displayStations = selectedStationId
    ? stations.filter((s) => s.id === selectedStationId)
    : stations;

  const dateKey = selectedDate ?? currentTime.toISOString().split("T")[0];

  const currentTimeStr = currentTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // All unique time labels (sorted) — past slots hidden when viewing today
  const isToday = dateKey === currentTime.toISOString().split("T")[0];
  const allTimeLabels = Array.from(
    new Set(
      timeSlots
        .filter((s) => displayStations.some((st) => st.id === s.stationId))
        .filter((s) => s.id.includes(dateKey))
        .map((s) => s.startTime)
    )
  ).sort().filter((t) => {
    if (!isToday) return true;
    const [h, m] = t.split(":").map(Number);
    const slotEnd = h * 60 + m + 30; // slot is hidden only after it fully ends
    const nowMin = currentTime.getHours() * 60 + currentTime.getMinutes();
    return slotEnd > nowMin;
  });

  // Closed-day detection driven by admin settings
  const workingDays = settings.workingDays ?? [1, 2, 3, 4, 5];
  const holidays = settings.holidays ?? [];
  const viewedDayOfWeek = new Date(dateKey + "T00:00:00").getDay();
  const isHoliday = holidays.includes(dateKey);
  const isNonWorkingDay = !workingDays.includes(viewedDayOfWeek);
  const isClosed = isHoliday || isNonWorkingDay;

  const formatClock = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" }).toUpperCase();

  function isTimePast(timeStr: string) {
    if (dateKey !== currentTime.toISOString().split("T")[0]) return false;
    const [h, m] = timeStr.split(":").map(Number);
    const [ch, cm] = [currentTime.getHours(), currentTime.getMinutes()];
    return h < ch || (h === ch && m < cm);
  }

  function isTimeCurrent(timeStr: string) {
    if (dateKey !== currentTime.toISOString().split("T")[0]) return false;
    const [h, m] = timeStr.split(":").map(Number);
    const slotStartMin = h * 60 + m;
    const slotEndMin = slotStartMin + 30; // assumes 30-min slots
    const nowMin = currentTime.getHours() * 60 + currentTime.getMinutes();
    return nowMin >= slotStartMin && nowMin < slotEndMin;
  }

  return (
    <div className="space-y-6 font-mono">
      {/* Global live clock bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wifi size={14} className="text-emerald-500 animate-pulse" />
          <span className="text-slate-400 text-xs tracking-widest uppercase">Live Status</span>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold tracking-widest text-white tabular-nums">
            {formatClock(currentTime)}
          </div>
          <div className="text-slate-500 text-xs tracking-widest mt-0.5">{formatDate(currentTime)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-emerald-400 text-xs tracking-wider uppercase">Live</span>
        </div>
      </div>

      {/* Closed-day banner */}
      {isClosed && (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-14 text-center">
          {isHoliday ? (
            <CalendarX className="w-12 h-12 text-red-700 mx-auto mb-4" />
          ) : (
            <Ban className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          )}
          <p className="text-slate-300 font-mono tracking-widest uppercase text-sm font-bold">
            {isHoliday ? "Holiday — Workshop Closed" : "Non-Working Day"}
          </p>
          <p className="text-slate-600 text-xs font-mono mt-2">
            No appointments available on {dateKey}.
          </p>
        </div>
      )}

      {/* One board per station */}
      {!isClosed && displayStations.map((station) => {
        const stationSlots = timeSlots.filter(
          (s) => s.stationId === station.id && s.id.includes(dateKey)
        );
        const totalSlots = stationSlots.length;
        const availableCount = stationSlots.filter((s) => s.isAvailable).length;
        const occupancyPct = totalSlots > 0 ? Math.round(((totalSlots - availableCount) / totalSlots) * 100) : 0;

        // Build bay rows: each bay has all time slots in order
        const bays = Array.from({ length: station.maxParallelCars }, (_, i) => i + 1);

        return (
          <div key={station.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
            {/* Station header — airport gate info bar */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs tracking-[0.3em] text-amber-400 uppercase">Workshop</span>
                  </div>
                  <h2 className="text-2xl font-bold tracking-wider text-white uppercase">{station.name}</h2>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1">
                    <MapPin size={11} />
                    <span>{station.location}</span>
                  </div>
                </div>

                {/* Capacity dots */}
                <div className="text-right shrink-0">
                  <div className="flex gap-1.5 justify-end mb-1">
                    {bays.map((b) => {
                      const baySlots = stationSlots.filter((s) => s.bayNumber === b);
                      const bayBusy = baySlots.some((s) => !s.isAvailable);
                      return (
                        <div
                          key={b}
                          className={`w-3 h-3 rounded-full border ${bayBusy ? "bg-amber-400 border-amber-500" : "bg-emerald-500 border-emerald-600"}`}
                          title={`Bay ${b}`}
                        />
                      );
                    })}
                  </div>
                  <div className="text-slate-400 text-xs tracking-wider">
                    <span className="text-amber-300 font-bold">{availableCount}</span>
                    <span className="text-slate-600"> / </span>
                    <span>{totalSlots}</span>
                    <span className="ml-1">AVAILABLE</span>
                  </div>
                  <div className="mt-1 w-full bg-slate-800 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-amber-400 transition-all duration-500"
                      style={{ width: `${occupancyPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* The departure board grid */}
            <div className="overflow-x-auto" ref={scrollRef}>
              <div className="min-w-max p-4">
                {/* Column headers: TIME row */}
                <div className="flex gap-1.5 mb-2 ml-[88px]">
                  {allTimeLabels.map((t) => (
                    <TimeHeader key={t} time={t} isCurrent={isTimeCurrent(t)} />
                  ))}
                </div>

                {/* Bay rows */}
                <div className="space-y-1.5">
                  {bays.map((bay) => {
                    const baySlots = stationSlots.filter((s) => s.bayNumber === bay);
                    const slotByTime: Record<string, typeof baySlots[0]> = {};
                    baySlots.forEach((s) => { slotByTime[s.startTime] = s; });

                    const activeBayBookings = bookings.filter(
                      (b) =>
                        b.stationId === station.id &&
                        b.status === "in-progress" &&
                        baySlots.some((s) => s.id === b.slotId)
                    );
                    const isBayActive = activeBayBookings.length > 0;

                    return (
                      <div key={bay} className="flex items-center gap-1.5">
                        {/* Bay label */}
                        <div
                          className={[
                            "w-20 shrink-0 h-10 flex items-center justify-center rounded-sm border text-[11px] font-bold tracking-widest",
                            isBayActive
                              ? "bg-amber-950 border-amber-700 text-amber-300"
                              : "bg-slate-900 border-slate-800 text-slate-500",
                          ].join(" ")}
                        >
                          BAY {bay}
                        </div>

                        {/* Slot cells */}
                        {allTimeLabels.map((t) => {
                          const slot = slotByTime[t];
                          if (!slot) {
                            return (
                              <div
                                key={t}
                                className="min-w-[72px] h-10 bg-slate-950 border border-slate-900 rounded-sm opacity-30"
                              />
                            );
                          }
                          const booking = bookings.find(
                            (b) => b.slotId === slot.id && b.status !== "cancelled"
                          );
                          const cellLabel = slot.isAvailable ? "OPEN" : "BOOKED";

                          return (
                            <FlipCell
                              key={`${slot.id}-${slot.isAvailable}-${booking?.status}`}
                              value={cellLabel}
                              available={slot.isAvailable}
                              isPast={isTimePast(t)}
                              isCurrent={isTimeCurrent(t)}
                              onClick={onBookSlot ? () => onBookSlot(slot.id) : undefined}
                            />
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 mt-4 ml-[88px] text-[10px] tracking-widest text-slate-600 uppercase">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-700 inline-block" />
                    Available — click to book
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-amber-400/20 border border-amber-800 inline-block" />
                    Booked
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-700 inline-block" />
                    Past
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {displayStations.length === 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-16 text-center">
          <Clock className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-500 font-mono tracking-wider uppercase">No stations found</p>
        </div>
      )}
    </div>
  );
}
