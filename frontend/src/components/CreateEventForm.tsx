import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { ImagePlus } from 'lucide-react';

interface CreateEventFormProps {
  onClose: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement event creation logic
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto px-1">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concert">Concert</SelectItem>
              <SelectItem value="theatre">Theatre</SelectItem>
              <SelectItem value="music">Music</SelectItem>
              <SelectItem value="comedy">Comedy</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={2}
          required
        />
      </div>

      <div className="space-y-4 border rounded-lg p-4 bg-card">
        <h3 className="font-medium text-sm">Venue Details</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="venueName">Venue Name</Label>
            <Input id="venueName" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="venueCapacity">Capacity</Label>
            <Input
              type="number"
              id="venueCapacity"
              min="1"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="venueLocation">Location</Label>
          <Input id="venueLocation" placeholder="Full address" required />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            type="date"
            id="date"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="time">Time</Label>
          <Input
            type="time"
            id="time"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (₹)</Label>
        <Input
          type="number"
          id="price"
          min="0"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Event Image</Label>
        <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors">
          <div className="flex flex-col items-center gap-2">
            <input
              type="file"
              id="image"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="image"
              className="flex flex-col items-center gap-2 cursor-pointer"
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md"
                />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload image
                  </span>
                </>
              )}
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          Create Event
        </Button>
      </div>
    </form>
  );
};

export default CreateEventForm;