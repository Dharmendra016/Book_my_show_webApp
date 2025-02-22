import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";

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
    venue: Venue | null;
}

interface Venue {
    venueid: number;
    name: string;
    location: string;
    capacity: number;
}

interface EditEventModalProps {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedEvent: Event) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ event, isOpen, onClose, onUpdate }) => {
    const [formData, setFormData] = useState<Event>(event);
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(event?.imageurl);
    const [date, setDate] = useState(event?.datetime.split("T")[0]);
    const [time, setTime] = useState(event?.datetime.split("T")[1]?.slice(0, 5) || "00:00");

    // Reset form when event changes
    useEffect(() => {
        setFormData(event);
        setPreviewUrl(event.imageurl);
        setDate(event.datetime.split("T")[0]);
        setTime(event.datetime.split("T")[1]?.slice(0, 5) || "00:00");
    }, [event]);

    // Cleanup preview URL on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl !== event.imageurl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, event.imageurl]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        setDate(newDate);
        setFormData(prev => ({
            ...prev,
            datetime: `${newDate}T${time}:00`
        }));
    };
    
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        setTime(newTime);
        setFormData(prev => ({
            ...prev,
            datetime: `${date}T${newTime}:00`
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "duration" || name === "priceperseat" ? Number(value) : value
        }));
    };

    const handleVenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const fieldName = name.replace("venue", "").toLowerCase();
        
        setFormData(prev => ({
            ...prev,
            venue: prev.venue ? {
                ...prev.venue,
                [fieldName]: name === "capacity" ? Number(value) : value
            } : null
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            console.error("Please upload an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            console.error("Image must be less than 5MB");
            return;
        }

        if (previewUrl && previewUrl !== event.imageurl) {
            URL.revokeObjectURL(previewUrl);
        }
        
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        console.log("Form data:", formData);
        try {
            

            const formDataToSend = new FormData();
            formDataToSend.append("Title", formData.title);
            formDataToSend.append("Description", formData.description);
            formDataToSend.append("Genre", formData.genre);
            formDataToSend.append("Language", formData.language);
            formDataToSend.append("Duration", formData.duration.toString());
            formDataToSend.append("DateTime", formData.datetime);
            formDataToSend.append("PricePerSeat", formData.priceperseat.toString());
            formDataToSend.append("VenueID", formData.venue?.venueid.toString() || "");
            formDataToSend.append("ImageUrl", event.imageurl);
            
            // If a new image is selected, append it
            if (selectedImage) {
                formDataToSend.append("image", selectedImage);
            }


    
            // Send the form data to backend
            const eventResponse = await axios.post(
                `https://book-my-show-webapp.onrender.com/updateEvent/${formData.eventid}`,
                formDataToSend,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );
    
            // Update venue if it exists
            if (formData.venue) {
                await axios.post(
                    `https://book-my-show-webapp.onrender.com/updateVenue/${formData.venue.venueid}`,
                    {
                        Name: formData.venue.name,
                        Location: formData.venue.location,
                        Capacity: formData.venue.capacity,
                    },
                    {
                        withCredentials: true,
                    }
                );
            }
    
            onUpdate(eventResponse.data.updatedEvent);
            onClose();
            setTimeout(() => {
                window.location.reload();
              }, 1000);
            
        } catch (error) {
            console.error("Error updating event:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                value={formData.title} 
                                onChange={handleChange} 
                                id="title" 
                                name="title" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="genre">Genre</Label>
                            <Select 
                                name="genre" 
                                value={formData.genre} 
                                onValueChange={(value) => setFormData(prev => ({ ...prev, genre: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="drama">Drama</SelectItem>
                                    <SelectItem value="comedy">Comedy</SelectItem>
                                    <SelectItem value="dance">Dance</SelectItem>
                                    <SelectItem value="music">Music</SelectItem>
                                    <SelectItem value="movie">Movie</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                            value={formData.description} 
                            onChange={handleChange} 
                            id="description" 
                            name="description" 
                            rows={3} 
                            required 
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Input 
                                value={formData.language} 
                                onChange={handleChange} 
                                id="language" 
                                name="language" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input 
                                value={formData.duration} 
                                onChange={handleChange} 
                                type="number" 
                                id="duration" 
                                name="duration" 
                                min="1" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-4 border rounded-lg p-4">
                        <h3 className="font-medium">Venue Details</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="venueName">Venue Name</Label>
                                <Input 
                                    value={formData.venue?.name} 
                                    onChange={handleVenueChange} 
                                    id="venueName" 
                                    name="venueName" 
                                    required 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="venueCapacity">Capacity</Label>
                                <Input 
                                    value={formData.venue?.capacity} 
                                    onChange={handleVenueChange} 
                                    type="number" 
                                    id="venueCapacity" 
                                    name="venueCapacity" 
                                    min="1" 
                                    required 
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="venueLocation">Location</Label>
                            <Input 
                                value={formData.venue?.location} 
                                onChange={handleVenueChange} 
                                id="venueLocation" 
                                name="venueLocation" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input 
                                value={date} 
                                onChange={handleDateChange} 
                                type="date" 
                                id="date" 
                                name="date" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input 
                                value={time} 
                                onChange={handleTimeChange} 
                                type="time" 
                                id="time" 
                                name="time" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priceperseat">Price Per Seat (₹)</Label>
                        <Input 
                            value={formData.priceperseat} 
                            onChange={handleChange} 
                            type="number" 
                            id="priceperseat" 
                            name="priceperseat" 
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
                        <Button 
                            variant="outline" 
                            type="button" 
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditEventModal;