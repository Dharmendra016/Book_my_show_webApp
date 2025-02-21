import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

interface EventState {
  events: Event[];
  selectedEvent: Event | null;
}

const initialState: EventState = {
  events: [],
  selectedEvent: null,
};

const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setEvent: (state, action: PayloadAction<Event[]>) => {
      state.events = action.payload;
    },
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    removeEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.eventid !== action.payload);
    },
  },
});

export const { setEvent, addEvent, removeEvent } = eventSlice.actions;
export default eventSlice.reducer;
