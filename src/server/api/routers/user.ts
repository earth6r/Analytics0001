import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import admin from 'firebase-admin';

// Set configuration options for the API route
export const config = {
    maxDuration: 300, // Maximum duration for the API route to respond to a request (5 minutes)
}

export const userRouter = createTRPCRouter({
    getUserDetails: publicProcedure
        .input(
            z.object({
                email: z.string(),
            })
        )
        .query(async ({ input }) => {
            const { email } = input;

            // TODO: make this reusable
            if (!admin.apps.length) {
                // Initialize Firebase app with the parsed configuration
                const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: process.env.PROJECT_ID,
                })
            }

            const db = admin.firestore() // Get a reference to the Firestore database

            // Query the 'users' collection for a document with the specified email
            const user = await db.collection('users').where('email', '==', email).get()
            if (user.empty) {
                throw new Error('User not found');
            }

            const userData = {
                // @ts-expect-error TODO: fix this
                "user": user.docs[0].data(),
                // @ts-expect-error TODO: fix this
                "UID": user.docs[0].id,
            }

            // usersBookPhoneCall
            const phoneCallBookingsRef = db.collection('usersBookPhoneCall').where('userUID', '==', userData.UID).get();
            // @ts-expect-error TODO: fix this
            const phoneCallBookings = [];
            (await phoneCallBookingsRef).forEach((doc) => {
                const data = doc.data();
                data.type = 'Phone Call';
                phoneCallBookings.push(data);
            });

            // @ts-expect-error TODO: fix this
            userData.phoneCallBookings = phoneCallBookings;

            // usersBookPropertyTour
            const propertyTourBookingsRef = db.collection('usersBookPropertyTour').where('userUID', '==', userData.UID).get();
            // @ts-expect-error TODO: fix this
            const propertyTourBookings = [];
            (await propertyTourBookingsRef).forEach((doc) => {
                const data = doc.data();
                data.type = 'Property Tour';
                propertyTourBookings.push(data);
            });

            // @ts-expect-error TODO: fix this
            userData.propertyTourBookings = propertyTourBookings;

            // usersBuyingProgress
            const buyingProgressRef = db.collection('usersBuyingProgress').where('userUID', '==', userData.UID).get();

            // @ts-expect-error TODO: fix this
            const buyingProgress = [];
            (await buyingProgressRef).forEach((doc) => {
                const data = doc.data();
                buyingProgress.push(data);
            });

            // @ts-expect-error TODO: fix this
            userData.buyingProgress = buyingProgress;

            // messages
            // @ts-expect-error TODO: fix this
            const userPhoneNumbers = userData.phoneCallBookings.map((booking) => booking.phoneNumber);
            const messagesRef = db.collection('messages').get();

            // @ts-expect-error TODO: fix this
            const messages = [];
            (await messagesRef).forEach((doc) => {
                const data = doc.data();
                messages.push(data);
            });

            // @ts-expect-error TODO: fix this
            userData.messages = messages.filter((message) => userPhoneNumbers.includes(message.username) || userPhoneNumbers.includes(message?.to));

            return userData;
        }),
});