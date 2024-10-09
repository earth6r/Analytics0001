import { interviewers } from "@/lib/constants";
import { API_URL } from "@/server/api/routers/bookings";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore/lite";
import moment from "moment-timezone";
import { type NextApiRequest, type NextApiResponse } from "next/types";

export const config = {
  maxDuration: 300,
};

const sendNotification = async (phoneNumber: string, message: string) => {
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
      message,
    });
  } catch (error) {
    console.error(`Failed to send notification to ${phoneNumber}`, error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const propertyTourRef = collection(db, "usersBookPropertyTour");

  // Get all property tour bookings
  const propertyTourSnapshot = await getDocs(propertyTourRef);

  const propertyTours = propertyTourSnapshot.docs.map((doc) => doc.data());

  propertyTours.forEach((propertyTour, index) => {
    propertyTour.uid = propertyTourSnapshot?.docs[index]?.id;
  });

  for (const propertyTour of propertyTours) {
    if (propertyTour?.disableTextReminder) {
      continue;
    }

    // Convert startTimestamp to a moment object in UTC
    const startTimestampEpochUTC = Number(propertyTour.startTimestamp);
    const propertyTourDate = moment
      .utc(startTimestampEpochUTC)
      .startOf("minute"); // round down to nearest minute

    // Get the current time in UTC and round down to nearest minute
    const currentDate = moment.utc().startOf("minute");

    // Check if the property tour is scheduled in 30 minutes
    const minutesUntilTour = propertyTourDate.diff(currentDate, "minutes");

    const startTimestampEst = moment
      .utc(startTimestampEpochUTC)
      .tz("America/New_York")
      .format("YYYY-MM-DD HH:mm:ss");
    // console.error(
    //     `current date: ${currentDate.format('YYYY-MM-DD HH:mm:ss')}, start date: ${propertyTourDate.format('YYYY-MM-DD HH:mm:ss')}, minutes until tour: ${minutesUntilTour}`,
    // )

    if (minutesUntilTour === 30) {
      const interviewerPhone = interviewers["Marian"];
      await sendNotification(
        interviewerPhone,
        `REMINDER: You’re doing a tour with ${propertyTour.firstName} ${propertyTour.lastName} in 30min. Check the profile here: https://analytics.home0001.com/booking-details?email=${propertyTour.email}&type=Property%20Tour&uid=${propertyTour.uid}`,
      );
    } else if (minutesUntilTour === -45) {
      const interviewerPhone = interviewers["Marian"];
      await sendNotification(
        interviewerPhone,
        `REMINDER complete the post-meeting notes after your tour with ${propertyTour.firstName} ${propertyTour.lastName}. You can leave your notes here: https://home0001.com/analytics.booking-details?email=${propertyTour.email}&type=Property%20Tour&uid=${propertyTour.uid}`,
      );
    }
  }

  res
    .status(200)
    .json({ message: "Notifications checked and sent if needed." });
}
