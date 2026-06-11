// Mock data layer for the tuning scheduler
// This file contains all the data structures and initial state

export interface TuningType {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  basePrice: number;
}

export interface Station {
  id: string;
  name: string;
  location: string;
  maxParallelCars: number;
  currentCars: number;
}

export interface TimeSlot {
  id: string;
  stationId: string;
  bayNumber: number; // 1-based bay index within the station
  startTime: string; // HH:mm format
  endTime: string;
  isAvailable: boolean;
  bookedBy?: string;
  bookingId?: string;
}

export interface Booking {
  id: string;
  stationId: string;
  slotId: string;
  customerName: string;
  contactNumber: string;
  carType: string;
  engineType: string;
  enginePower?: string;
  tuningTypeId: string;
  bookingTime: string; // ISO timestamp
  status: "confirmed" | "in-progress" | "completed" | "cancelled";
  totalPrice: number;
  notificationSent: boolean;
  reminderSent: boolean;
}

export interface SystemSettings {
  businessHours: {
    startTime: string; // HH:mm
    endTime: string;
  };
  slotDuration: number; // in minutes
  defaultMaxCarsPerStation: number;
  holidays: string[]; // ISO date strings yyyy-mm-dd
  workingDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
}

// Tuning Types
export const tuningTypes: TuningType[] = [
  {
    id: "ecu-tune",
    name: "ECU Tuning",
    description: "Engine control unit optimization",
    duration: 60,
    basePrice: 299,
  },
  {
    id: "performance-tune",
    name: "Performance Tuning",
    description: "Full performance enhancement",
    duration: 120,
    basePrice: 599,
  },
  {
    id: "eco-tune",
    name: "Eco Tuning",
    description: "Fuel efficiency optimization",
    duration: 45,
    basePrice: 199,
  },
  {
    id: "custom-tune",
    name: "Custom Tuning",
    description: "Bespoke tuning package",
    duration: 180,
    basePrice: 999,
  },
];

// Stations
export const stations: Station[] = [
  {
    id: "station-1",
    name: "Downtown Workshop",
    location: "123 Main Street",
    maxParallelCars: 5,
    currentCars: 2,
  },
  {
    id: "station-2",
    name: "North Bay Service Center",
    location: "456 North Avenue",
    maxParallelCars: 5,
    currentCars: 1,
  },
  {
    id: "station-3",
    name: "East Side Garage",
    location: "789 East Road",
    maxParallelCars: 5,
    currentCars: 3,
  },
];

// System Settings
export const systemSettings: SystemSettings = {
  businessHours: {
    startTime: "09:00",
    endTime: "17:00",
  },
  slotDuration: 30, // 30 minutes per slot
  defaultMaxCarsPerStation: 5,
  holidays: [],
  workingDays: [1, 2, 3, 4, 5], // Mon–Fri
};

// Generate time slots for a given date, station, and all bays
export function generateTimeSlots(
  stationId: string,
  date: Date,
  maxBays: number = 5
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const [startHour, startMin] = systemSettings.businessHours.startTime
    .split(":")
    .map(Number);
  const [endHour, endMin] = systemSettings.businessHours.endTime
    .split(":")
    .map(Number);

  const dateKey = date.toISOString().split("T")[0];

  let timeIndex = 0;
  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMin, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMin, 0, 0);

  const timeIntervals: { start: string; end: string }[] = [];
  while (currentTime < endTime) {
    const nextTime = new Date(currentTime);
    nextTime.setMinutes(nextTime.getMinutes() + systemSettings.slotDuration);
    timeIntervals.push({
      start: currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
      end: nextTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    });
    currentTime = nextTime;
    timeIndex++;
  }

  // Create one slot per (bay × time-interval) combination
  for (let bay = 1; bay <= maxBays; bay++) {
    timeIntervals.forEach((interval, tIdx) => {
      slots.push({
        id: `slot-${stationId}-${dateKey}-bay${bay}-t${tIdx}`,
        stationId,
        bayNumber: bay,
        startTime: interval.start,
        endTime: interval.end,
        isAvailable: Math.random() > 0.35,
      });
    });
  }

  return slots;
}

// Generate all slots for today and next 7 days
export function generateAllTimeSlots(): TimeSlot[] {
  const allSlots: TimeSlot[] = [];
  const today = new Date();

  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() + dayOffset);

    for (const station of stations) {
      const slots = generateTimeSlots(station.id, date, station.maxParallelCars);
      allSlots.push(...slots);
    }
  }

  return allSlots;
}

// Sample bookings for demo — slotIds match the pattern from generateTimeSlots
const todayKey = new Date().toISOString().split("T")[0];
export const sampleBookings: Booking[] = [
  {
    id: "booking-1",
    stationId: "station-1",
    slotId: `slot-station-1-${todayKey}-bay1-t0`,
    customerName: "John Smith",
    contactNumber: "+1-555-0101",
    carType: "BMW M340i",
    engineType: "3.0L Turbocharged",
    tuningTypeId: "performance-tune",
    bookingTime: new Date().toISOString(),
    status: "confirmed",
    totalPrice: 599,
    notificationSent: true,
    reminderSent: false,
  },
  {
    id: "booking-2",
    stationId: "station-2",
    slotId: `slot-station-2-${todayKey}-bay2-t2`,
    customerName: "Sarah Johnson",
    contactNumber: "+1-555-0102",
    carType: "Audi A4",
    engineType: "2.0L Turbocharged",
    tuningTypeId: "ecu-tune",
    bookingTime: new Date(Date.now() - 86400000).toISOString(),
    status: "in-progress",
    totalPrice: 299,
    notificationSent: true,
    reminderSent: true,
  },
];

// Car types for dropdown
export const carTypes = [
  "BMW M340i",
  "Audi A4",
  "Mercedes-Benz C63",
  "Porsche 911",
  "Tesla Model 3",
  "Volkswagen Golf GTI",
  "Honda Civic Type R",
  "Subaru WRX",
  "Nissan GT-R",
  "Other",
];

// Engine power options for dropdown
export const enginePowerOptions = [
  "Under 100 BHP",
  "100–150 BHP",
  "151–200 BHP",
  "201–300 BHP",
  "301–400 BHP",
  "401–500 BHP",
  "Over 500 BHP",
];

// Engine types for dropdown
export const engineTypes = [
  "2.0L Turbocharged",
  "2.5L Turbocharged",
  "3.0L Turbocharged",
  "3.5L Naturally Aspirated",
  "4.0L Turbocharged",
  "Electric",
  "Hybrid",
  "Other",
];
