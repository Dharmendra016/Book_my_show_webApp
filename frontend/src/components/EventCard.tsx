import { Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface EventCardProps {
  event: Event;
  userId?: number; // ID of the currently logged-in user
}

interface Seat {
  seatNumber: string;
  seatType: string;
  price: number;
  venueId: number;
  isBooked?: boolean;
}

import { useState } from "react";
import EditEventModal from "./EditEventModal";
import BookingModal from "./BookingModal";

const EventCard: React.FC<EventCardProps> = ({ event, userId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [eventData, setEventData] = useState(event);
  const [isBooking, setIsBooking] = useState(false);

  const isCreator = event.createdbyuserid === userId;

  const handleBookingConfirm = async (selectedSeats: Seat[]) => {
    // Implement your booking logic here
    console.log('Booking confirmed for seats:', selectedSeats);
    // Make API call to your backend to process the booking
  };

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden">
        <img src={event.imageurl} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ₹{Number(event.priceperseat).toFixed(2)}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">{eventData?.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{eventData?.description}</p>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(eventData?.datetime).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{new Date(eventData?.datetime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">
              {event.venue ? `${event?.venue?.name}, ${event?.venue?.location}` : "Venue not available"}
            </span>
          </div>
        </div>
        {isCreator ? (
          <Button onClick={() => setIsEditing(true)} className="w-full bg-yellow-500 hover:bg-yellow-600">
            Edit
          </Button>
        ) : (
          <Button 
          onClick={() => setIsBooking(true)} 
          className="w-full bg-blue-500 hover:bg-blue-600"
        >
          Book Now
        </Button>
        )}

      <BookingModal
        isOpen={isBooking}
        onClose={() => setIsBooking(false)}
        event={eventData}
        onBookingConfirm={handleBookingConfirm}
      />

        {/* Edit Event Modal */}
        {isEditing && (
          <EditEventModal
            event={eventData}
            isOpen={isEditing}
            onClose={() => setIsEditing(false)}
            onUpdate={setEventData}
          />
        )}
      </div>
    </div>
  );
};

export default EventCard;
