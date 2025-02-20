import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '../types/event';
import { Button } from './ui/button';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
          ₹{event.price}
        </div>
      </div>
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-card-foreground line-clamp-1">{event.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{event.description}</p>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
        </div>
        <Button className="w-full">Book Now</Button>
      </div>
    </div>
  );
};

export default EventCard