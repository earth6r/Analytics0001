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
                `Hi, this is Talin from HOME0001. Quick reminder that we have a Zoom call coming up in an hour. You can find the call link in the email confirmation and the calendar invite we shared with you. Let me know in case you’d prefer a phone call and we’ll ring you instead.`,
        })
    } catch (error) {
        console.error(`Failed to send notification to ${phoneNumber}`, error);
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const phoneCallsRef = collection(db, "usersBookPhoneCall");

    // Get all property tour bookings
    const phoneCallsSnapshot = await getDocs(phoneCallsRef);

    const phoneCalls = phoneCallsSnapshot.docs.map(doc => doc.data());

    for (const phoneCall of phoneCalls) {
        // Convert startTimestamp to a moment object in UTC
        const startTimestampEpochUTC = Number(phoneCall.startTimestamp);
        const phoneCallDate = moment.utc(startTimestampEpochUTC).startOf('minute'); // round down to nearest minute

        // Get the current time in UTC and round down to nearest minute
        const currentDate = moment.utc().startOf('minute');

        // Check if the property tour is scheduled in 30 minutes
        const minutesUntilTour = phoneCallDate.diff(currentDate, 'minutes');

        const startTimestampEst = moment.utc(startTimestampEpochUTC).tz('America/New_York').format('YYYY-MM-DD HH:mm:ss');
        // console.error(
        //     `current date: ${currentDate.format('YYYY-MM-DD HH:mm:ss')}, start date: ${propertyTourDate.format('YYYY-MM-DD HH:mm:ss')}, minutes until tour: ${minutesUntilTour}`,
        // )
        if (minutesUntilTour === 60) {
            await sendNotification(
                phoneCall.email,
                phoneCall.firstName,
                phoneCall.lastName,
                phoneCall.phoneNumber,
                startTimestampEst,
            );
        }
    }

    res.status(200).json({ message: "Notifications checked and sent if needed." });
}
