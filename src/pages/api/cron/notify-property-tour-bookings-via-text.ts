import { API_URL } from "@/server/api/routers/bookings";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore/lite";
import moment from "moment-timezone";
import { type NextApiRequest, type NextApiResponse } from "next/types";

const sendNotification = async (
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    startTimestamp: string,
) => {
    // try {
    //     await axios.post(`${API_URL}/send-phone-call-reminder`, {
    //         // TODO: change recipientPhone to all numbers of team
    //         recipientPhone: phoneNumber,
    //         email,
    //         firstName,
    //         lastName,
    //         phoneNumber,
    //         startTimestamp,
    //     })
    // } catch (error) {
    //     console.error(`Failed to send notification to ${phoneNumber}`, error);
    // }

    try {
        await axios.post(`${API_URL}/send-message`, {
            recipientPhone: phoneNumber,
            message:
                `Hi ${firstName}, Just a quick reminder about your upcoming tour at 48 Allen, New York, NY, 10002 at TIME. You will meet Carl outside. Let us know if you are unable to make it.
Best,
Talin`,
        })
    } catch (error) {
        console.error(`Failed to send notification to ${phoneNumber}`, error);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const propertyTourRef = collection(db, "usersBookPropertyTour");

    // Get all property tour bookings
    const propertyTourSnapshot = await getDocs(propertyTourRef);

    const propertyTours = propertyTourSnapshot.docs.map(doc => doc.data());

    for (const propertyTour of propertyTours) {
        // Convert startTimestamp to a moment object in UTC
        const startTimestampEpochUTC = Number(propertyTour.startTimestamp);
        const propertyTourDate = moment.utc(startTimestampEpochUTC).startOf('minute'); // round down to nearest minute

        // Get the current time in UTC and round down to nearest minute
        const currentDate = moment.utc().startOf('minute');

        // Check if the property tour is scheduled in 30 minutes
        const minutesUntilTour = propertyTourDate.diff(currentDate, 'minutes');

        const startTimestampEst = moment.utc(startTimestampEpochUTC).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
        // console.error(
        //     `current date: ${currentDate.format('YYYY-MM-DD HH:mm:ss')}, start date: ${propertyTourDate.format('YYYY-MM-DD HH:mm:ss')}, minutes until tour: ${minutesUntilTour}`,
        // )

        // 24 hours before the tour
        if (minutesUntilTour === 60 * 24) {
            await sendNotification(
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
