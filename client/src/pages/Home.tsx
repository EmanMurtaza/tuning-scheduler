import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Zap,
  Clock,
  Users,
  Settings,
  CheckCircle2,
  Bell,
  MapPin,
  ArrowRight,
  Activity,
  Calendar,
} from "lucide-react";

// ── Static departure-board preview shown in the hero ─────────────────────────
function MockStatusBoard() {
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00"];
  const rows: Array<[string, boolean[]]> = [
    ["BAY 1", [true, false, true, true, false]],
    ["BAY 2", [false, true, true, false, true]],
    ["BAY 3", [true, true, false, true, false]],
  ];

  return (
    <div className="bg-slate-950 border border-slate-700/60 rounded-2xl p-5 font-mono shadow-[0_0_80px_rgba(234,88,12,0.12)] w-full max-w-[500px]">
      {/* Board header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-emerald-400 text-[10px] tracking-widest uppercase">Live</span>
        <span className="text-white font-bold tracking-wider text-sm ml-1">DOWNTOWN WORKSHOP</span>
        <span className="ml-auto text-amber-400 font-bold text-sm tabular-nums">09:42</span>
      </div>

      {/* Time headers */}
      <div className="flex gap-1.5 mb-2 pl-[60px]">
        {times.map((t, i) => (
          <div
            key={t}
            className={`w-[66px] h-7 flex items-center justify-center text-[10px] font-bold rounded-sm tracking-widest shrink-0 ${
              i === 1 ? "bg-amber-400 text-slate-900" : "bg-slate-900 text-slate-500"
            }`}
          >
            {t}
          </div>
        ))}
      </div>

      {/* Bay rows */}
      <div className="space-y-1.5">
        {rows.map(([label, slots]) => (
          <div key={label as string} className="flex items-center gap-1.5">
            <div className="w-14 h-9 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-sm text-[10px] text-slate-500 font-bold tracking-wider shrink-0">
              {label}
            </div>
            {(slots as boolean[]).map((open, i) => (
              <div
                key={i}
                className={`w-[66px] h-9 flex items-center justify-center rounded-sm border text-[10px] font-bold tracking-wide shrink-0 ${
                  i === 1 ? "ring-1 ring-amber-400 border-amber-400" : ""
                } ${
                  open
                    ? "bg-slate-950 text-emerald-400 border-emerald-800"
                    : "bg-slate-800 text-slate-500 border-slate-700"
                }`}
              >
                {open ? "OPEN" : "BOOKED"}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-5 mt-3 pt-3 border-t border-slate-800/50 text-[9px] text-slate-600 tracking-widest uppercase">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-emerald-500/30 border border-emerald-700 inline-block" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-sm bg-slate-700 border border-slate-600 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          Current slot
        </span>
      </div>
    </div>
  );
}

// ── Feature cards ─────────────────────────────────────────────────────────────
const features = [
  {
    Icon: Activity,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Live Status Board",
    desc: "Airport departure-style real-time grid. Every bay, every time slot — updated live with a running clock.",
  },
  {
    Icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    title: "Multi-Bay Management",
    desc: "Configure parallel bays per workshop. Scale from 1 to 10 bays with a single field in the admin panel.",
  },
  {
    Icon: Calendar,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    title: "Smart Scheduling",
    desc: "Set working days, business hours, holidays, and slot duration. All changes reflect on the board instantly.",
  },
  {
    Icon: Bell,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Instant Notifications",
    desc: "Booking confirmation and a 1-hour reminder sent to every customer automatically — no manual follow-up.",
  },
  {
    Icon: Settings,
    color: "text-slate-300",
    bg: "bg-slate-300/10",
    title: "Full Admin Control",
    desc: "Secure admin dashboard to manage stations, services, pricing, working days, holidays, and all bookings.",
  },
  {
    Icon: CheckCircle2,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Flexible Pricing (PKR)",
    desc: "Set per-service prices in Rupees. Add, edit, or remove tuning packages any time from the admin panel.",
  },
];

// ── How it works ──────────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Choose Workshop", desc: "Select your nearest station and pick any date within the week." },
  { n: "02", title: "Pick a Slot",     desc: "Browse the live board. Click any green OPEN cell to begin." },
  { n: "03", title: "Enter Details",   desc: "Name, contact, car type, engine displacement, and tuning service." },
  { n: "04", title: "Confirmed!",      desc: "Instant confirmation sent. A reminder follows 1 hour before your slot." },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ── Sticky Nav ── */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-orange-500 rounded-sm flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-mono font-bold tracking-widest text-white text-base hidden sm:block">
              TUNING SCHEDULER
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/admin")}
              className="text-slate-400 hover:text-white font-mono tracking-wider text-xs"
            >
              Admin
            </Button>
            <Button
              size="sm"
              onClick={() => setLocation("/customer")}
              className="bg-orange-600 hover:bg-orange-500 text-white font-mono tracking-wider text-xs gap-1.5"
            >
              Book Appointment
              <ArrowRight size={12} />
            </Button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        {/* Subtle grid backdrop */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#e2e8f0 1px,transparent 1px),linear-gradient(90deg,#e2e8f0 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        {/* Warm glow */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left — copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-3.5 py-1 text-xs text-orange-400 font-mono tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                LIVE BOOKING SYSTEM
              </div>

              <h1 className="text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight mb-5">
                Workshop Bookings<br />
                <span className="text-orange-500">Airport Precision.</span>
              </h1>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
                Real-time slot management for car tuning workshops.
                Customers book in seconds — you see every bay, every
                time slot, live.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Button
                  onClick={() => setLocation("/customer")}
                  className="bg-orange-600 hover:bg-orange-500 text-white font-mono tracking-wider px-8 h-11 text-sm gap-2"
                >
                  Book an Appointment
                  <ArrowRight size={14} />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/admin")}
                  className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 font-mono tracking-wider px-8 h-11 text-sm gap-2"
                >
                  <Settings size={13} />
                  Admin Panel
                </Button>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 pt-6 border-t border-slate-800">
                {[
                  ["3", "Workshops"],
                  ["15", "Service Bays"],
                  ["30-min", "Slot Precision"],
                ].map(([val, label]) => (
                  <div key={label}>
                    <div className="text-2xl font-bold font-mono text-white">{val}</div>
                    <div className="text-slate-600 text-[11px] tracking-wider uppercase mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — mock board */}
            <div className="flex justify-center lg:justify-end">
              <MockStatusBoard />
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ── */}
      <div className="border-y border-slate-800 bg-slate-900/60">
        <div className="container py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: MapPin,       label: "Multiple Locations" },
              { Icon: Activity,    label: "Real-Time Availability" },
              { Icon: CheckCircle2, label: "Instant Confirmation" },
              { Icon: Bell,        label: "Automated Reminders" },
            ].map(({ Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-slate-500 text-xs font-mono tracking-wider">
                <Icon size={14} className="text-orange-500 shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-24 bg-slate-950">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-orange-400 font-mono text-[11px] tracking-[0.3em] uppercase mb-3">
              Everything You Need
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Built for modern workshops</h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              From customer-facing booking to admin oversight — every tool your team
              needs in one clean system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ Icon, color, bg, title, desc }) => (
              <div
                key={title}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-colors"
              >
                <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 bg-slate-900">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-orange-400 font-mono text-[11px] tracking-[0.3em] uppercase mb-3">
              Simple Process
            </p>
            <h2 className="text-4xl font-bold tracking-tight">Book in under 2 minutes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector line — desktop only */}
            <div className="hidden md:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-slate-800" />

            {steps.map(({ n, title, desc }) => (
              <div key={n} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-5 relative z-10">
                  <span className="text-xl font-bold font-mono text-orange-500">{n}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="py-24 bg-slate-950">
        <div className="container">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 p-12 text-center">
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-3 tracking-tight">Ready to go live?</h2>
              <p className="text-orange-100 mb-8 max-w-md mx-auto text-sm leading-relaxed">
                Open the booking board and let customers start reserving slots — or jump
                into the admin panel to configure your workshops first.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setLocation("/customer")}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-mono tracking-wider h-11 px-8 gap-2 text-sm"
                >
                  Book Now
                  <ArrowRight size={14} />
                </Button>
                <Button
                  onClick={() => setLocation("/admin")}
                  className="bg-orange-800/60 hover:bg-orange-800 text-white border border-orange-500/40 font-mono tracking-wider h-11 px-8 gap-2 text-sm"
                >
                  <Settings size={13} />
                  Admin Panel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-7 h-7 bg-orange-500 rounded-sm flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-mono font-bold tracking-widest text-white text-sm">
                  TUNING SCHEDULER
                </span>
              </div>
              <p className="text-slate-600 text-xs max-w-xs leading-relaxed">
                Professional appointment management for automotive tuning workshops.
              </p>
            </div>

            <div className="flex gap-6 text-[11px] text-slate-500 font-mono tracking-wider">
              <button
                onClick={() => setLocation("/customer")}
                className="hover:text-orange-400 transition-colors uppercase"
              >
                Book Appointment
              </button>
              <button
                onClick={() => setLocation("/admin")}
                className="hover:text-orange-400 transition-colors uppercase"
              >
                Admin Panel
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-slate-700 text-[11px] font-mono tracking-wider">
            © {new Date().getFullYear()} TUNING SCHEDULER — PROFESSIONAL AUTOMOTIVE SERVICE MANAGEMENT
          </div>
        </div>
      </footer>

    </div>
  );
}
