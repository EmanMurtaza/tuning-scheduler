import React, { createContext, useContext, useState, useCallback, useRef } from "react";
import {
  Booking,
  Station,
  TimeSlot,
  TuningType,
  SystemSettings,
  generateAllTimeSlots,
  tuningTypes,
  stations,
  systemSettings,
  sampleBookings,
} from "@/lib/mockData";

interface SchedulerContextType {
  // Data
  stations: Station[];
  timeSlots: TimeSlot[];
  tuningTypes: TuningType[];
  bookings: Booking[];
  settings: SystemSettings;

  // Station management
  updateStation: (stationId: string, updates: Partial<Station>) => void;
  updateSettings: (updates: Partial<SystemSettings>) => void;

  // Booking management
  createBooking: (booking: Booking) => void;
  updateBooking: (bookingId: string, updates: Partial<Booking>) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByStation: (stationId: string) => Booking[];

  // Slot management
  updateSlot: (slotId: string, updates: Partial<TimeSlot>) => void;
  getAvailableSlots: (stationId: string) => TimeSlot[];
  getSlotsByStation: (stationId: string) => TimeSlot[];

  // Tuning types
  addTuningType: (tuningType: TuningType) => void;
  updateTuningType: (typeId: string, updates: Partial<TuningType>) => void;
  deleteTuningType: (typeId: string) => void;

  // Notifications
  sendBookingNotification: (bookingId: string) => void;
  sendReminderNotification: (bookingId: string) => void;
}

const SchedulerContext = createContext<SchedulerContextType | undefined>(
  undefined
);

export function SchedulerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [stationsList, setStationsList] = useState<Station[]>(stations);
  const [slotsList, setSlotsList] = useState<TimeSlot[]>(generateAllTimeSlots());
  const [tuningTypesList, setTuningTypesList] = useState<TuningType[]>(
    tuningTypes
  );
  const [bookingsList, setBookingsList] = useState<Booking[]>(sampleBookings);
  const [appSettings, setAppSettings] = useState<SystemSettings>(systemSettings);

  // Always-current refs so callbacks never close over stale state
  const appSettingsRef = useRef(appSettings);
  appSettingsRef.current = appSettings;
  const stationsListRef = useRef(stationsList);
  stationsListRef.current = stationsList;
  const bookingsListRef = useRef(bookingsList);
  bookingsListRef.current = bookingsList;

  // Station management
  const updateStation = useCallback((stationId: string, updates: Partial<Station>) => {
    setStationsList((prev) => {
      const newStations = prev.map((s) => (s.id === stationId ? { ...s, ...updates } : s));
      if ("maxParallelCars" in updates) {
        const fresh = generateAllTimeSlots(newStations, appSettingsRef.current);
        setSlotsList((cur) => {
          const bookedIds = new Set(cur.filter((s) => !s.isAvailable).map((s) => s.id));
          return fresh.map((s) => (bookedIds.has(s.id) ? { ...s, isAvailable: false } : s));
        });
      }
      return newStations;
    });
  }, []);

  const updateSettings = useCallback((updates: Partial<SystemSettings>) => {
    setAppSettings((prev) => {
      const next = { ...prev, ...updates };
      const fresh = generateAllTimeSlots(stationsListRef.current, next);
      setSlotsList((cur) => {
        const bookedIds = new Set(cur.filter((s) => !s.isAvailable).map((s) => s.id));
        return fresh.map((s) => (bookedIds.has(s.id) ? { ...s, isAvailable: false } : s));
      });
      return next;
    });
  }, []);

  // Booking management
  const createBooking = useCallback((booking: Booking) => {
    setBookingsList((prev) => [...prev, booking]);
    // Mark slot as unavailable
    updateSlot(booking.slotId, { isAvailable: false, bookedBy: booking.customerName });
  }, []);

  const updateBooking = useCallback((bookingId: string, updates: Partial<Booking>) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ...updates } : b))
    );
  }, []);

  const cancelBooking = useCallback((bookingId: string) => {
    const booking = bookingsListRef.current.find((b) => b.id === bookingId);
    if (booking) {
      setBookingsList((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
      // Mark slot as available again
      updateSlot(booking.slotId, { isAvailable: true, bookedBy: undefined });
    }
  }, []);

  const getBookingsByStation = useCallback(
    (stationId: string) => {
      return bookingsList.filter((b) => b.stationId === stationId);
    },
    [bookingsList]
  );

  // Slot management
  const updateSlot = useCallback((slotId: string, updates: Partial<TimeSlot>) => {
    setSlotsList((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, ...updates } : s))
    );
  }, []);

  const getAvailableSlots = useCallback(
    (stationId: string) => {
      return slotsList.filter((s) => s.stationId === stationId && s.isAvailable);
    },
    [slotsList]
  );

  const getSlotsByStation = useCallback(
    (stationId: string) => {
      return slotsList.filter((s) => s.stationId === stationId);
    },
    [slotsList]
  );

  // Tuning types
  const addTuningType = useCallback((tuningType: TuningType) => {
    setTuningTypesList((prev) => [...prev, tuningType]);
  }, []);

  const updateTuningType = useCallback(
    (typeId: string, updates: Partial<TuningType>) => {
      setTuningTypesList((prev) =>
        prev.map((t) => (t.id === typeId ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const deleteTuningType = useCallback((typeId: string) => {
    setTuningTypesList((prev) => prev.filter((t) => t.id !== typeId));
  }, []);

  // Notifications
  const sendBookingNotification = useCallback((bookingId: string) => {
    updateBooking(bookingId, { notificationSent: true });
  }, [updateBooking]);

  const sendReminderNotification = useCallback((bookingId: string) => {
    updateBooking(bookingId, { reminderSent: true });
  }, [updateBooking]);

  const value: SchedulerContextType = {
    stations: stationsList,
    timeSlots: slotsList,
    tuningTypes: tuningTypesList,
    bookings: bookingsList,
    settings: appSettings,
    updateStation,
    updateSettings,
    createBooking,
    updateBooking,
    cancelBooking,
    getBookingsByStation,
    updateSlot,
    getAvailableSlots,
    getSlotsByStation,
    addTuningType,
    updateTuningType,
    deleteTuningType,
    sendBookingNotification,
    sendReminderNotification,
  };

  return (
    <SchedulerContext.Provider value={value}>
      {children}
    </SchedulerContext.Provider>
  );
}

export function useScheduler() {
  const context = useContext(SchedulerContext);
  if (!context) {
    throw new Error("useScheduler must be used within SchedulerProvider");
  }
  return context;
}
