import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { PlusCircle } from "lucide-react";
import { RootState } from "../redux/store";
import EventCard from "./EventCard";
import { Button } from "./ui/button";
import CreateEventForm from "./CreateEventForm";
import { setEvent } from "@/redux/eventSlice";

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
  venue: Venue | null; // Will hold fetched venue details
}

interface Venue {
  venueid: number;
  name: string;
  location: string;
  capacity: number;
}

const Test = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === "admin";

  const dispatch  = useDispatch();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Fetch all events first
        const eventsRes = await axios.get("http://localhost:3000/getEvents", {
            withCredentials: true,
        });
        if (!eventsRes.data.success) throw new Error("Failed to fetch events");

        const eventsData: Event[] = eventsRes.data.events;


        dispatch(setEvent(eventsRes?.data?.events));
        // Fetch venue details for each event
        console.log('eventsData' , eventsData);
        const eventsWithVenues = await Promise.all(
          eventsData.map(async (event) => {
            try {
              const venueRes = await axios.get(`http://localhost:3000/venue/${event.venueid}` , {withCredentials:true});
                console.log(venueRes);
              return { ...event, venue: venueRes.data.venues[0] || null }; // Add venue data
            } catch (error) {
              console.error(`Error fetching venue for event ${event.eventid}:`, error);
              return { ...event, venue: null }; // If venue fetch fails, set it as null
            }
          })
        );

        setEvents(eventsWithVenues);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-foreground">Upcoming Events</h2>
        {isAdmin && (
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Create Event
          </Button>
        )}
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-2xl font-bold text-foreground mb-6">Create New Event</h3>
            <CreateEventForm onClose={() => setShowCreateForm(false)} />
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center text-muted-foreground">Loading events...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events.map((event) => (
            <EventCard key={event.eventid} event={event} userId={user?.userid} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Test;
