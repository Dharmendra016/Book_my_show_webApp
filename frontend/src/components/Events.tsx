import { useState } from 'react';
import { useSelector } from 'react-redux';
import { PlusCircle } from 'lucide-react';
import { Event } from '../types/event';
import { RootState } from '../redux/store';
import EventCard from './EventCard';
import { Button } from './ui/button';
import CreateEventForm from './CreateEventForm';

// This will be replaced with actual API call
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Coldplay World Tour 2025',
    description: 'Experience the magic of Coldplay live in concert with their spectacular World Tour show featuring hits from across their entire discography.',
    date: '2025-03-15',
    time: '19:30',
    venue: 'National Stadium, Delhi',
    category: 'Concert',
    price: 4999,
    imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '2',
    title: 'Hamlet - Royal Shakespeare Company',
    description: 'The Royal Shakespeare Company presents William Shakespeare\'s greatest tragedy in a modern interpretation.',
    date: '2025-03-20',
    time: '18:00',
    venue: 'Royal Opera House, Mumbai',
    category: 'Theatre',
    price: 2999,
    imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '3',
    title: 'Indian Classical Music Festival',
    description: 'A celebration of Indian classical music featuring renowned artists from across the country.',
    date: '2025-04-01',
    time: '17:00',
    venue: 'Music Academy, Chennai',
    category: 'Music',
    price: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  },
  {
    id: '4',
    title: 'Stand-Up Comedy Night',
    description: 'An evening of laughter with India\'s top stand-up comedians performing their best sets.',
    date: '2025-03-25',
    time: '20:00',
    venue: 'Comedy Club, Bangalore',
    category: 'Comedy',
    price: 999,
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
  }
];

const Events = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockEvents.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Events;