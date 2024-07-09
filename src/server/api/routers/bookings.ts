import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import admin from 'firebase-admin';
import { addDoc, collection, doc, getDoc, getDocs, query, where } from "firebase/firestore/lite";
import { z } from "zod";

// Set configuration options for the API route
export const config = {
  maxDuration: 300, // Maximum duration for the API route to respond to a request (5 minutes)
}

export const bookingsRouter = createTRPCRouter({
    getBookings: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const querySnapshot = await getDocs(phoneCallBookingsRef);
            const bookings: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.type = 'Phone Call';
                bookings.push(data);
            });

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const querySnapshot2 = await getDocs(propertyTourBookingsRef);
            querySnapshot2.forEach((doc) => {
                const data = doc.data();
                data.type = 'Property Tour';
                bookings.push(data);
            });

            // TODO: make this reusable
            if (!admin.apps.length) {
                // Initialize Firebase app with the parsed configuration
                const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string);
                admin.initializeApp({
                    credential: admin.credential.cert(serviceAccount),
                    projectId: process.env.PROJECT_ID,
                })
            }

            for (const booking of bookings) {
                const userRef = collection(db, 'users');
                const d = doc(userRef, booking.userUID);
                const user = await getDoc(d);

                if (!user.exists()) {
                    throw new Error('User not found');
                }

                booking.email = user.data().email;
            }

            // sort by timestamp
            bookings.sort((a, b) => {
                return a.timestamp - b.timestamp;
            });

            return bookings;
        }),

    createPhoneBooking: publicProcedure
        .input(z.object({
            email: z.string(),
            timestamp: z.string(),
            phoneNumber: z.string(),
        }))
        .mutation(async ({ input }) => {

            // translate above using modular firebase api
            const user = await getDocs(query(collection(db, 'users'), where('email', '==', input.email)));

            if (user.empty || user.docs.length === 0 || !user?.docs[0]?.id) {
                throw new Error('User not found');
            }

            await addDoc(collection(db, 'usersBookPhoneCall'), {
                userUID: user.docs[0].id,
                timestamp: input.timestamp,
                phoneNumber: input.phoneNumber,
            });

            return {
                status: 'success',
            };
        }),

    createPropertyTourBooking: publicProcedure
        .input(z.object({
            email: z.string(),
            timestamp: z.string(),
            typeOfBooking: z.string(),
            propertyType: z.string(),
            phoneNumber: z.string(),
        }))
        .mutation(async ({ input }) => {
            const user = await getDocs(query(collection(db, 'users'), where('email', '==', input.email)));

            if (user.empty || user.docs.length === 0 || !user?.docs[0]?.id) {
                throw new Error('User not found');
            }

            await addDoc(collection(db, 'usersBookPropertyTour'), {
                userUID: user.docs[0].id,
                property: input.propertyType,
                timestamp: input.timestamp,
                phoneNumber: input.phoneNumber,
            });

            return {
                status: 'success',
            };
        }),
});
