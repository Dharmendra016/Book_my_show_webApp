import { initializeVenueTable, insertVenue } from "../models/venueSchema.js";
import { client } from "../utility/dbConnect.js";


export const createVenue = async (req, res) => {
    try {

        await initializeVenueTable();

        const { Name, Location, Capacity } = req.body;

        console.log(Name, Location, Capacity);
        if (!Name || !Location || !Capacity) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            });
        }

        const venueCreated = await insertVenue({ Name, Location, Capacity });

        if(!venueCreated ){
            return res.status(500).json({
                success: false,
                message: "Venue not created due to a server issue."
            });
        }

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


export const getVenue = async (req, res) => {
    try {
        const venues = await client.query("SELECT * FROM \"Venue\" WHERE \"Venue\".\"venueid\" = $1", [req.params.id]);
        
        if(venues.rows.length === 0){
            return res.status(404).json({
                success: false,
                message: "Venue not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "successfully fetched venues",
            venues: venues.rows
        })

    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            success: false,
            message: "Internal error"
        })
    }
}

export const updateVenue = async (req, res) => {
    try {
        const { Name, Location, Capacity } = req.body;
        const venueId = req.params.id;

        if (!Name || !Location || !Capacity) {
            return res.status(400).json({
                success: false,
                message: "All fields are required to be filled",
            });
        }

        const venueUpdated = await client.query("UPDATE \"Venue\" SET Name = $1, Location = $2, Capacity = $3 WHERE VenueId = $4 RETURNING *", [Name, Location, Capacity, venueId]);

        if (venueUpdated.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Venue not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "successfully updated venue",
            venue: venueUpdated.rows[0]
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}