import {initializeEventTable , insertEvent} from "../models/eventSchema.js"
import { initializeVenueTable } from "../models/venueSchema.js";
import { client } from "../utility/dbConnect.js";


const searchQuery = `SELECT * FROM "User" WHERE UserId = $1`;
export const createEvent = async (req , res) => {
    try {
        
        await initializeVenueTable();
        const { Name,Description,Genre,Language,Duration,DateTime,PricePerSeat,} = req.body ;
        
        const userId = req.user.UserId;
        console.log(userId);
        const venueID = 1;

        console.log(Name , Description , Genre , Language , Duration , DateTime, PricePerSeat , userId);

        if( !Name || !Description || !Genre || !Language || !Duration || !DateTime || !PricePerSeat ){
            return res.status(400).json({
                success:false,
                message:"All field are required !!"
            })
        }
        await initializeEventTable();

        const user = await client.query(searchQuery, [userId]);
        console.log(user);
        
        if (!user.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }


        const createdEvent = await insertEvent({ Name, Description, Genre, Language, Duration, DateTime, PricePerSeat, VenueID:venueID, CreatedByUserID:userId }) ; 
        
        if (!createdEvent) {
            return res.status(500).json({
                success: false,
                message: "event not created due to a server issue.",
            });
        }

        return res.status(200).json({
            success:true,
            message:"successfully created event"
        })
        
    } catch (error) {
        console.log(error.message);
        return res.status(404).json({
            success:false,
            message:"Internal error"
        })
    }
}

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

export const deleteEvent = async (req , res) => {
    try{

        const eventId = req.params.id;
        console.log(eventId);
        const deleteEvent = await client.query("DELETE FROM \"Event\" WHERE eventid = $1",[eventId]);
        if(deleteEvent.rowCount === 0){
            return res.status(400).json({
                success:false,
                message:"Event not found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Event deleted successfully"
        })

    }catch(error){
        console.log(error.message);
        return res.status(404).json({
            success:false,
            message:"Internal error"
        })
    }
}