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
        // Check if the property tour is scheduled in 30 minutes
        const startTimestampEpochUTC = Number(propertyTour.startTimestamp);
        const propertyTourDateWithMinute = moment.utc(startTimestampEpochUTC).format('YYYY-MM-DD HH:mm');

        const currentDate = moment.utc().format('YYYY-MM-DD HH:mm');

        // check if the property tour is scheduled in 30 minutes
        if (moment(propertyTourDateWithMinute).isSame(moment(currentDate).add(30, 'minutes'))) {
            sendNotification(propertyTour.email);
        }
    }
}
