import { initializeVenueTable, insertVenue } from "../models/venueSchema.js";


export const createVenue = async (req, res) => {
    try {

        await initializeVenueTable();

        const { Name, Location, Capacity } = req.body;

        if (!Name || !Location || !Capacity) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            });
        }

        const venueCreated = await insertVenue({ Name, Location, Capacity });

        if (!venueCreated) {
            return res.status(500).json({
                success: false,
                message: "Venue not created due to a server issue.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "successfully created venue",
            venue: venueCreated
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}