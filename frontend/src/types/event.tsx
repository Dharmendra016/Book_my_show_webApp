export interface Event {
  eventid: string;
  title: string;
  description: string;
  genre: string;
  language: string;
  duration: string;
  datetime: string;
  priceperseat: number;
  venueid: number;
  createdbyuserid: number;
  imageurl: string;
}
// Compare this snippet from frontend/src/components/CreateEventForm.tsx: