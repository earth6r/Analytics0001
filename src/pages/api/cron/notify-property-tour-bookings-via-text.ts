import { API_URL } from "@/server/api/routers/bookings";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore/lite";
import moment from "moment-timezone";
import { type NextApiRequest, type NextApiResponse } from "next/types";

const sendNotification = async (email: string) => {
    await axios.post(`${API_URL}/send-whatsapp`, {
        recipientPhone: '+14377703354',
        message: `There is a property tour booking in 30 minutes with ${email}.`,
    })

    await axios.post(`${API_URL}/send-message`, {
        recipientPhone: '+14377703354',
        message: 'There is a booking for a property tour in 30 minutes.',
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const propertyToursRef = collection(db, "usersBookPropertyTour");

    // Get all property tour bookings
    const propertyToursSnapshot = await getDocs(propertyToursRef);

    const propertyTours = propertyToursSnapshot.docs.map(doc => doc.data());

    for (const propertyTour of propertyTours) {
        // Convert startTimestamp to a moment object in UTC
        const startTimestampEpochUTC = Number(propertyTour.startTimestamp);
        const propertyTourDate = moment.utc(startTimestampEpochUTC).startOf('minute'); // round down to nearest minute

        // Get the current time in UTC and round down to nearest minute
        const currentDate = moment.utc().startOf('minute');

        // Check if the property tour is scheduled in 30 minutes
        const minutesUntilTour = propertyTourDate.diff(currentDate, 'minutes');

        if (minutesUntilTour === 30) {
            await sendNotification(propertyTour.email);
        }
    }

    res.status(200).json({ message: "Notifications checked and sent if needed." });
}
