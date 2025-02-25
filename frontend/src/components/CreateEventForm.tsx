import React, { useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { ImagePlus } from "lucide-react";
import { addEvent } from "@/redux/eventSlice";
import { useDispatch } from "react-redux";

interface CreateEventFormProps {
  onClose: () => void;
  refreshEvents: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onClose ,refreshEvents }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const dispatch = useDispatch();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Store file object
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); // Show preview image
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const venuePayload = {
      Name: formData.get("venueName"),
      Capacity: Number(formData.get("venueCapacity")),
      Location: formData.get("venueLocation"),
    };

    try {
      // Step 1: Create Venue
      const venueRes = await axios.post("https://book-my-show-webapp-1.onrender.com/venue", venuePayload, { withCredentials: true });
      const newVenueId = venueRes.data.venue.venueid; // Assuming API returns { id: '123' }

      // Convert FormData fields to JSON
      const eventPayload = new FormData();
      eventPayload.append("Title", formData.get("title") as string);
      eventPayload.append("Description", formData.get("description") as string);
      eventPayload.append("Genre", formData.get("genre") as string);
      eventPayload.append("Language", formData.get("language") as string);
      eventPayload.append("Duration", formData.get("duration") as string);
      eventPayload.append("DateTime", `${formData.get("date")}T${formData.get("time")}`);
      eventPayload.append("PricePerSeat", formData.get("price") as string);
      eventPayload.append("VenueID", newVenueId);

      if (selectedImage) {
        eventPayload.append("image", selectedImage); // Append image file
      }

      const response = await axios.post("https://book-my-show-webapp-1.onrender.com/createEvent", eventPayload, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }, // Required for file uploads
      });

      dispatch(addEvent(response.data.event)); // Update Redux store
      
      console.log(response.data);
      refreshEvents(); // Refresh events list
      onClose(); // Close form on success
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto px-1">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Select name="genre">
            <SelectTrigger>
              <SelectValue placeholder="Select genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="drama">Drama</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="action">Dance</SelectItem>
              <SelectItem value="romance">Music</SelectItem>
              <SelectItem value="horror">Movie</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={2} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="language">Language</Label>
        <Input id="language" name="language" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration">Duration (minutes)</Label>
        <Input type="number" id="duration" name="duration" min="1" required />
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-card">
        <h3 className="font-medium text-sm">Venue Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venueName">Venue Name</Label>
            <Input id="venueName" name="venueName" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="venueCapacity">Capacity</Label>
            <Input type="number" id="venueCapacity" name="venueCapacity" min="1" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="venueLocation">Location</Label>
          <Input id="venueLocation" name="venueLocation" placeholder="Full address" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input type="date" id="date" name="date" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input type="time" id="time" name="time" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price Per Seat (₹)</Label>
        <Input type="number" id="price" name="price" min="0" required />
      </div>

      <div className="space-y-2">
        <Label>Event Image</Label>
        <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors">
          <div className="flex flex-col items-center gap-2">
            <input type="file" id="image" accept="image/*" className="hidden" onChange={handleImageChange} />
            <label htmlFor="image" className="flex flex-col items-center gap-2 cursor-pointer">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-32 object-cover rounded-md" />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
        <Button type="submit">Create Event</Button>
      </div>
    </form>
  );
};

export default CreateEventForm;
