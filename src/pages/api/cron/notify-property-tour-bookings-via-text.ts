import { API_URL } from "@/server/api/routers/bookings";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore/lite";
import moment from "moment-timezone";
import { type NextApiRequest, type NextApiResponse } from "next/types";

const numbers = [
    '+15038676436',
    '+4915168698913',
    '+17134103755', // yan
    '+14377703354', // api
    '+19175824100',
    '+447577459373',
    '+491634841797',
]

const sendNotification = (
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    startTimestamp: string,
) => {
    for (const number of numbers) {
        axios.post(`${API_URL}/send-property-tour-reminder`, {
            // TODO: change recipientPhone to all numbers of team
            recipientPhone: number,
            email,
            firstName,
            lastName,
            phoneNumber,
            startTimestamp,
        })

        axios.post(`${API_URL}/send-message`, {
            // TODO: change recipientPhone to all numbers of team
            recipientPhone: number,
            message:
                `There is a booking for a property tour in 1 hour.

Name: ${firstName} ${lastName}
Phone: ${phoneNumber}
Start Time: ${startTimestamp}
Date: ${startTimestamp}
Details: https://analytics.home0001.com/booking-details?email=${email}
            `,
        })
    }
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

        const startTimestampEst = moment.utc(startTimestampEpochUTC).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');

        if (minutesUntilTour === 60) {
            sendNotification(
                propertyTour.email,
                propertyTour.firstName,
                propertyTour.lastName,
                propertyTour.phoneNumber,
                startTimestampEst,
            );
        }
    }

    res.status(200).json({ message: "Notifications checked and sent if needed." });
}
