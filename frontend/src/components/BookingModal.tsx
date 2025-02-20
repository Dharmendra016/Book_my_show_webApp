import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface Seat {
  seatNumber: string;
  seatType: string;
  price: number;
  venueId: number;
  isBooked: boolean;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: { title: string; venueid: number; priceperseat: number };
  onBookingConfirm: (selectedSeats: Seat[]) => void;
}

const seatTypes = {
  PREMIUM: "Premium",
  STANDARD: "Standard",
  BUDGET: "Budget",
};

// Fetch seats from the backend instead of using Math.random()
const fetchSeats = async (venueId: number): Promise<Seat[]> => {
  try {
    const response = await fetch(`http://localhost:5000/seats/${venueId}`);
    const data = await response.json();
    if (data.success) {
      return data.seats;
    }
    return [];
  } catch (error) {
    console.error("Error fetching seats:", error);
    return [];
  }
};

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  event,
  onBookingConfirm,
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchSeats(event.venueid).then(setSeats);
    }
  }, [isOpen, event.venueid]);

  const toggleSeatSelection = (seat: Seat) => {
    if (seat.isBooked) return;

    setSelectedSeats((prev) =>
      prev.some((s) => s.seatNumber === seat.seatNumber)
        ? prev.filter((s) => s.seatNumber !== seat.seatNumber)
        : [...prev, seat]
    );
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + seat.price, 0);
  };

  const handleBooking = () => {
    onBookingConfirm(selectedSeats);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Seats - {event.title}</DialogTitle>
          <DialogDescription>Select your preferred seats for the show</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 rounded"></div>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-500 rounded"></div>
              <span>Booked</span>
            </div>
          </div>

          <div className="grid grid-cols-10 gap-2">
            {seats.map((seat) => (
              <button
                key={seat.seatNumber}
                onClick={() => toggleSeatSelection(seat)}
                disabled={seat.isBooked}
                className={`
                  p-2 rounded text-sm font-medium transition-colors
                  ${seat.isBooked
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : selectedSeats.some((s) => s.seatNumber === seat.seatNumber)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                  }
                `}
              >
                <div className="flex flex-col items-center gap-1">
                  <span>{seat.seatNumber}</span>
                  <span className="text-xs">₹{seat.price}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Selected Seats:</span>
              <div className="flex gap-2">
                {selectedSeats.map((seat) => (
                  <Badge key={seat.seatNumber} variant="secondary">
                    {seat.seatNumber}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total Amount:</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleBooking} disabled={selectedSeats.length === 0}>
            <Check className="w-4 h-4 mr-2" />
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
