import { interviewers } from "@/lib/constants";
import { API_URL } from "@/server/api/routers/bookings";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore/lite";
import moment from "moment-timezone";
import { type NextApiRequest, type NextApiResponse } from "next/types";

export const config = {
    maxDuration: 300,
}

const sendNotification = async (
    phoneNumber: string,
    message: string,
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
            message: message,
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

    phoneCalls.forEach((phoneCall, index) => {
        phoneCall.uid = phoneCallsSnapshot?.docs[index]?.id;
    })

    for (const phoneCall of phoneCalls) {
        if (phoneCall?.disableTextReminder) {
            continue;
        }

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
        if (minutesUntilTour === 30 && Object.keys(interviewers).includes(phoneCall?.interviewer || '')) {
            // @ts-expect-error TODO: fix this type error
            const interviewerPhone = interviewers[phoneCall?.interviewer];
            await sendNotification(
                interviewerPhone,
                `REMINDER: You have a call with ${phoneCall.firstName} ${phoneCall.lastName} in 30min. Check the profile here: https://home0001.com/booking-details?email=${phoneCall.email}&type=Phone%20Call&uid=${phoneCall.uid}`,
            );
        } else if (minutesUntilTour === -30 && Object.keys(interviewers).includes(phoneCall?.interviewer || '')) {
            // @ts-expect-error TODO: fix this type error
            const interviewerPhone = interviewers[phoneCall?.interviewer];
            await sendNotification(
                interviewerPhone,
                `REMINDER complete the post-meeting notes for your call with ${phoneCall.firstName} ${phoneCall.lastName}. You can leave your notes here: https://home0001.com/booking-details?email=${phoneCall.email}&type=Phone%20Call&uid=${phoneCall.uid}`,
            );
        }
    }

    res.status(200).json({ message: "Notifications checked and sent if needed." });
}
