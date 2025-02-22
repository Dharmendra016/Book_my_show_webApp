import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface Seat {
  seatid : number;
  seatnumber: string;
  seattype: string;
  price: number;
  venueid: number;
  isbooked?: boolean;
}

interface Event {
  eventid: string;
  title: string;
  description: string;
  genre: string;
  language: string;
  duration: number;
  datetime: string;
  priceperseat: number;
  venueid: number;
  createdbyuserid: number;
  imageurl: string;
  venue: Venue | null; // Holds fetched venue details
}

interface Venue {
  venueid: number;
  name: string;
  location: string;
  capacity: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event:Event;
  onBookingConfirm: (selectedSeats: Seat[]) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  event,
  onBookingConfirm
}) => {
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to fetch existing seats
        const response = await fetch(`https://book-my-show-webapp.onrender.com/${event.venueid}`);
        let venueSeats = await response.json();
        venueSeats = venueSeats?.seats;
        
        if (!venueSeats || venueSeats.length === 0) {
          // If no seats exist, create them through the API
          const createSeatsResponse = await fetch('https://book-my-show-webapp.onrender.com/createseat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              venueId: event.venueid,
              totalSeats: event.venue?.capacity,
              PriceSeat: event.priceperseat
            })
          });

          if (!createSeatsResponse.ok) {
            throw new Error('Failed to create seats');
          }

          // Fetch the newly created seats
          const newSeatsResponse = await fetch(`https://book-my-show-webapp.onrender.com/${event.venueid}`);
          venueSeats = await newSeatsResponse.json();
          venueSeats = venueSeats?.seats;
        }
        
        if (!venueSeats) {
          throw new Error('Failed to fetch seats');
        }

        // Check availability for each seat
        const seatsWithAvailability = await Promise.all(
          venueSeats.map(async (seat: Seat) => {
            const availabilityResponse = await fetch(
              `https://book-my-show-webapp.onrender.com/seats/check/${seat.seatnumber}/${event.venueid}`
            );
            const availability = await availabilityResponse.json();
            return {
              ...seat,
              isbooked: availability?.isbooked
            };
          })
        );

        setSeats(seatsWithAvailability);
      } catch (error) {
        console.error('Error fetching/creating seats:', error);
        setError('Failed to load seats. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && event.venueid) {
      fetchSeats();
    }
  }, [isOpen, event?.venueid, event?.priceperseat, event?.venue?.capacity]);

    console.log("seats" , seats);
  const toggleSeatSelection = (seat: Seat) => {
    console.log(seat);
    if (seat.isbooked) return;
    
    const isSelected = selectedSeats.some(s => s.seatnumber === seat.seatnumber);
    if (isSelected) {
      setSelectedSeats(prevSeats => prevSeats.filter(s => s.seatnumber !== seat.seatnumber));
    } else {
      const seatToAdd = {
        ...seat,
        price: Number(seat.price)
      };
      setSelectedSeats(prevSeats => [...prevSeats, seatToAdd]);
    }
  };

  const getTotalPrice = (): number => {
    return selectedSeats.reduce((total, seat) => {
      const price = Number(seat.price) || 0;
      return total + price;
    }, 0);
  };

  const handleBookingConfirm = async () => {
    
    selectedSeats?.map(async(seat) => {
      console.log(seat.seatid, seat.seatnumber, seat.venueid);
      const res = await axios.get(`https://book-my-show-webapp.onrender.com/bookseat/${seat.seatid}/${seat.seatnumber}/${event.venueid}`);
      console.log(res);
    });

    onBookingConfirm(selectedSeats);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Select Seats - {event?.title}</DialogTitle>
          <DialogDescription>
            Select your preferred seats for the show
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6">
          <div className="flex flex-col gap-6">
            <div className="flex gap-4 items-center justify-center sticky top-0 bg-background py-4 z-10 border-b">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-secondary rounded"></div>
                <span className="text-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-primary rounded"></div>
                <span className="text-foreground">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-muted-foreground rounded"></div>
                <span className="text-foreground">Booked</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8 text-foreground">Loading seats...</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : (
              <div className="grid grid-cols-10 gap-2 min-h-[300px]">
                {seats.map((seat) => {
                  const isSelected = selectedSeats.some(s => s?.seatnumber === seat?.seatnumber);
                  return (
                    <button
                      key={seat?.seatnumber}
                      onClick={() => toggleSeatSelection(seat)}
                      disabled={seat?.isbooked}
                      className={cn(
                        "p-2 rounded text-sm font-medium transition-colors",
                        seat?.isbooked && "bg-muted-foreground text-background cursor-not-allowed",
                        !seat?.isbooked && !isSelected && "bg-secondary hover:bg-secondary/80 text-secondary-foreground",
                        isSelected && "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span>{seat?.seatnumber}</span>
                        <span className="text-xs">₹{seat?.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-2 sticky bottom-0 bg-background py-4 border-t">
              <div className="flex justify-between">
                <span className="text-foreground">Selected Seats:</span>
                <div className="flex gap-2 flex-wrap justify-end">
                  {selectedSeats?.map(seat => (
                    <Badge key={seat?.seatnumber} variant="secondary">
                      {seat?.seatnumber}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-foreground">Total Amount:</span>
                <span className="text-foreground">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleBookingConfirm}
            disabled={selectedSeats?.length === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;