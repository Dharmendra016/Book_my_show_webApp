import { initializeEventTable, insertEvent } from "../models/eventSchema.js";
import { client } from "../utility/dbConnect.js";

const searchQuery = `SELECT * FROM "User" WHERE UserId = $1`;
export const createEvent = async (req, res) => {
    try {

        // Validate and get event data from the request body
        const { Name, Description, Genre, Language, Duration, DateTime, PricePerSeat, VenueID } = req.body;
        const userId = req.user.UserId;

        // Validate that all required fields are provided
        if (!Name || !Description || !Genre || !Language || !Duration || !DateTime || !PricePerSeat || !VenueID) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        // Check if the user exists
        const user = await client.query(searchQuery, [userId]);
        if (!user.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if the venue exists (validate VenueID)
        const venueQuery = `SELECT * FROM "Venue" WHERE venueid = $1`;
        const venueResult = await client.query(venueQuery, [VenueID]);

        if (venueResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Venue not found"
            });
        }

        // Create the event
        await initializeEventTable();
        const createdEvent = await insertEvent({
            Name,
            Description,
            Genre,
            Language,
            Duration,
            DateTime,
            PricePerSeat,
            VenueID,  // Use the VenueID provided in the request
            CreatedByUserID: userId
        });

        if (!createdEvent) {
            return res.status(500).json({
                success: false,
                message: "Event not created due to a server issue."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Successfully created event"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



export const getEvent = async (req , res) => {
    try {
        const events = await client.query("SELECT * FROM \"Event\"");
        return res.status(200).json({
            success:true,
            message:"successfully fetched events",
            events:events.rows
        })
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            success:false,
            message:"Internal error"
        })
    }
}

export const deleteEvent = async (req, res) => {
    const eventId = req.params.id;
    try {
        // Step 1: Fetch the venueID associated with the event
        const eventQuery = `SELECT venueid FROM "Event" WHERE eventid = $1`;
        const eventResult = await client.query(eventQuery, [eventId]);

        if (eventResult.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Event not found"
            });
        }

        const venueID = eventResult.rows[0].venueid;

        // Step 2: Delete the event
        const deleteEventQuery = `DELETE FROM "Event" WHERE eventid = $1`;
        const deleteEvent = await client.query(deleteEventQuery, [eventId]);

        if (deleteEvent.rowCount === 0) {
            return res.status(400).json({
                success: false,
                message: "Event not found"
            });
        }

        // Step 3: Check if the venue is still associated with any other events
        const checkVenueQuery = `SELECT * FROM "Event" WHERE venueid = $1`;
        const venueCheckResult = await client.query(checkVenueQuery, [venueID]);

        if (venueCheckResult.rows.length === 0) {
            // If no other events are associated with the venue, delete the venue
            const deleteVenueQuery = `DELETE FROM "Venue" WHERE venueid = $1`;
            await client.query(deleteVenueQuery, [venueID]);
        }

        return res.status(200).json({
            success: true,
            message: "Event and associated venue deleted successfully"
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
