import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import {
  Zap,
  Users,
  Settings,
  Clock,
  DollarSign,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800 text-white">
        <div className="container py-20 md:py-28">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-orange-500 rounded-sm flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs font-mono tracking-[0.4em] text-orange-400 uppercase mb-0.5">Professional</p>
              <h1 className="text-4xl md:text-6xl font-bold font-mono tracking-wider">
                TUNING SCHEDULER
              </h1>
            </div>
          </div>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl font-mono">
            Real-time slot management · Airport-style departure board · Multi-bay workshop scheduling
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => setLocation("/customer")}
              className="bg-orange-600 hover:bg-orange-500 text-white text-base px-8 py-5 font-mono tracking-wider"
            >
              BOOK APPOINTMENT
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => setLocation("/admin")}
              variant="outline"
              className="text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-orange-500 text-base px-8 py-5 font-mono tracking-wider"
            >
              ADMIN PANEL
              <Settings className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-16">
        <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center font-mono">
          FEATURES
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="p-6 bg-white border-2 border-slate-200 hover:border-orange-500 transition-colors hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Live Status Board</h3>
            </div>
            <p className="text-slate-600">
              Airport-style real-time slot availability display with live updates and
              booking status tracking.
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 bg-white border-2 border-slate-200 hover:border-orange-500 transition-colors hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Easy Booking</h3>
            </div>
            <p className="text-slate-600">
              Simple customer booking flow with car type selection, engine specifications,
              and service customization.
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 bg-white border-2 border-slate-200 hover:border-orange-500 transition-colors hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Notifications</h3>
            </div>
            <p className="text-slate-600">
              Automatic booking confirmations and reminder notifications sent to customers
              one hour before appointments.
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="p-6 bg-white border-2 border-slate-200 hover:border-orange-500 transition-colors hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Admin Control</h3>
            </div>
            <p className="text-slate-600">
              Full administrative dashboard to manage stations, car spaces, time slots,
              tuning services, and rates.
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="p-6 bg-white border-2 border-slate-200 hover:border-orange-500 transition-colors hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Pricing Management</h3>
            </div>
            <p className="text-slate-600">
              Flexible pricing for different tuning types with customizable rates and
              service durations.
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="p-6 bg-white border-2 border-slate-200 hover:border-orange-500 transition-colors hover:shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Multiple Stations</h3>
            </div>
            <p className="text-slate-600">
              Support for multiple workshop locations with independent slot management
              and capacity tracking.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 py-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center font-mono">
            HOW IT WORKS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Select Station",
                description: "Choose your preferred workshop location",
              },
              {
                step: 2,
                title: "Pick Time Slot",
                description: "View available slots in real-time",
              },
              {
                step: 3,
                title: "Enter Details",
                description: "Provide car info and tuning preferences",
              },
              {
                step: 4,
                title: "Confirm Booking",
                description: "Receive instant confirmation & reminders",
              },
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <Card className="p-6 bg-white border-2 border-slate-200 h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mb-4 mx-auto">
                    <span className="text-xl font-bold text-orange-600">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 text-center">
                    {item.description}
                  </p>
                </Card>
                {idx < 3 && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 w-6 h-6 items-center justify-center">
                    <ArrowRight className="w-5 h-5 text-orange-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <Card className="bg-gradient-to-r from-orange-600 to-orange-700 border-0 p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4 font-mono">Ready to Get Started?</h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Book your car tuning appointment now or access the admin panel to manage
            your scheduling system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setLocation("/customer")}
              className="bg-white text-orange-600 hover:bg-orange-50 text-lg px-8 py-6"
            >
              Book Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              onClick={() => setLocation("/admin")}
              className="bg-orange-800 hover:bg-orange-900 text-white text-lg px-8 py-6"
            >
              Admin Access
              <Settings className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-slate-400 py-8">
        <div className="container text-center">
          <p className="text-sm">
            © 2026 Tuning Scheduler. Professional appointment management system for
            automotive services.
          </p>
        </div>
      </div>
    </div>
  );
}
