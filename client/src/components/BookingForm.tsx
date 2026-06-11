import React, { useState } from "react";
import { useScheduler } from "@/contexts/SchedulerContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Booking } from "@/lib/mockData";
import { carTypes, engineTypes, enginePowerOptions } from "@/lib/mockData";
import { nanoid } from "nanoid";
import { Clock, CheckCircle2 } from "lucide-react";

interface BookingFormProps {
  stationId: string;
  slotId: string;
  onClose: () => void;
  open: boolean;
}

export function BookingForm({
  stationId,
  slotId,
  onClose,
  open,
}: BookingFormProps) {
  const {
    createBooking,
    timeSlots,
    tuningTypes,
    stations,
    sendBookingNotification,
  } = useScheduler();

  const [formData, setFormData] = useState({
    customerName: "",
    contactNumber: "",
    carType: "",
    engineType: "",
    enginePower: "",
    tuningTypeId: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const station = stations.find((s) => s.id === stationId);
  const slot = timeSlots.find((s) => s.id === slotId);
  const tuningType = tuningTypes.find((t) => t.id === formData.tuningTypeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.customerName ||
      !formData.contactNumber ||
      !formData.carType ||
      !formData.engineType ||
      !formData.enginePower ||
      !formData.tuningTypeId
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const booking: Booking = {
      id: `booking-${nanoid()}`,
      stationId,
      slotId,
      customerName: formData.customerName,
      contactNumber: formData.contactNumber,
      carType: formData.carType,
      engineType: formData.engineType,
      enginePower: formData.enginePower,
      tuningTypeId: formData.tuningTypeId,
      bookingTime: new Date().toISOString(),
      status: "confirmed",
      totalPrice: tuningType?.basePrice || 0,
      notificationSent: false,
      reminderSent: false,
    };

    createBooking(booking);
    sendBookingNotification(booking.id);

    setSubmitted(true);
    setLoading(false);

    toast.success("Booking confirmed! Notification sent to your phone.");

    // Auto-close after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        customerName: "",
        contactNumber: "",
        carType: "",
        engineType: "",
        enginePower: "",
        tuningTypeId: "",
      });
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-mono">
            Book Your Tuning Session
          </DialogTitle>
          <DialogDescription>
            {station?.name} • {slot?.startTime} - {slot?.endTime}
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Booking Confirmed!
              </h3>
              <p className="text-slate-600 mb-4">
                Confirmation details sent to {formData.contactNumber}
              </p>
              <Badge className="bg-green-100 text-green-800">
                Booking ID: {formData.customerName.split(" ")[0]}-{Date.now().toString().slice(-4)}
              </Badge>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Summary Card */}
            <Card className="bg-slate-900 border border-slate-700 p-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">
                    Station
                  </div>
                  <div className="text-sm font-bold text-white font-mono mt-0.5">
                    {station?.name}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono tracking-widest uppercase">
                    <Clock size={10} />
                    Time
                  </div>
                  <div className="text-sm font-bold text-amber-300 font-mono mt-0.5">
                    {slot?.startTime} – {slot?.endTime}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-mono tracking-widest uppercase">
                    Bay
                  </div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    BAY {slot?.bayNumber ?? "—"}
                  </div>
                </div>
              </div>
            </Card>

            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">
                Customer Information
              </h3>

              <div>
                <Label htmlFor="name" className="text-sm font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="mt-1 border-slate-300"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold">
                  Contact Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="+1-555-0000"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contactNumber: e.target.value,
                    })
                  }
                  className="mt-1 border-slate-300"
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">
                Vehicle Information
              </h3>

              <div>
                <Label htmlFor="carType" className="text-sm font-semibold">
                  Car Type *
                </Label>
                <Select
                  value={formData.carType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, carType: value })
                  }
                >
                  <SelectTrigger id="carType" className="mt-1">
                    <SelectValue placeholder="Select your car" />
                  </SelectTrigger>
                  <SelectContent>
                    {carTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="engineType" className="text-sm font-semibold">
                  Engine Type *
                </Label>
                <Select
                  value={formData.engineType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, engineType: value })
                  }
                >
                  <SelectTrigger id="engineType" className="mt-1">
                    <SelectValue placeholder="Select engine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {engineTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="enginePower" className="text-sm font-semibold">
                  Engine Displacement *
                </Label>
                <Select
                  value={formData.enginePower}
                  onValueChange={(value) =>
                    setFormData({ ...formData, enginePower: value })
                  }
                >
                  <SelectTrigger id="enginePower" className="mt-1">
                    <SelectValue placeholder="Select engine displacement" />
                  </SelectTrigger>
                  <SelectContent>
                    {enginePowerOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tuning Service */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Tuning Service</h3>

              <div>
                <Label htmlFor="tuningType" className="text-sm font-semibold">
                  Tuning Type *
                </Label>
                <Select
                  value={formData.tuningTypeId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tuningTypeId: value })
                  }
                >
                  <SelectTrigger id="tuningType" className="mt-1">
                    <SelectValue placeholder="Select tuning type" />
                  </SelectTrigger>
                  <SelectContent>
                    {tuningTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        <span>{type.name}</span>
                        <span className="text-xs text-slate-500 ml-2">
                          {type.duration}m &nbsp;·&nbsp; Rs. {type.basePrice.toLocaleString()}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {tuningType && (
                  <div className="mt-2 p-3 bg-slate-50 rounded border border-slate-200">
                    <p className="text-sm text-slate-700">
                      {tuningType.description}
                    </p>
                    <div className="mt-2 text-sm font-semibold text-orange-600 font-mono">
                      Rs. {tuningType.basePrice.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
