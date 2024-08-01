import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import admin from 'firebase-admin';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { z } from "zod";

// Set configuration options for the API route
export const config = {
    maxDuration: 300, // Maximum duration for the API route to respond to a request (5 minutes)
}

// const API_URL = `http://localhost:3000/api`;
const API_URL = `https://home0001.com/api`;

export const bookingsRouter = createTRPCRouter({
    getBookings: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const querySnapshot = await getDocs(phoneCallBookingsRef);
            const bookings: any[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                data.uid = doc.id;
                data.type = 'Phone Call';
                bookings.push(data);
            });

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const querySnapshot2 = await getDocs(propertyTourBookingsRef);
            querySnapshot2.forEach((doc) => {
                const data = doc.data();
                data.uid = doc.id;
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

            // for (const booking of bookings) {
            //     const userRef = collection(db, 'users');
            //     const d = doc(userRef, booking.userUID);
            //     const user = await getDoc(d);

            //     if (!user.exists()) {
            //         throw new Error('User not found');
            //     }

            //     booking.email = user.data().email;
            // }

            // sort by timestamp
            bookings.sort((a, b) => {
                return a.timestamp - b.timestamp;
            });

            return bookings;
        }),

    createPhoneBooking: publicProcedure
        .input(z.object({
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            startTimestamp: z.string(),
            endTimestamp: z.string(),
            phoneNumber: z.string(),
            notes: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                await axios.post(`${API_URL}/bookings/book-phone-call`, {
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    startTimestamp: input.startTimestamp,
                    endTimestamp: input.endTimestamp,
                    phoneNumber: input.phoneNumber,
                    notes: input.notes,
                    blockWhatsApp: true,
                })
            } catch (error) {
                console.error('Error creating phone booking', error);
                throw new Error('Error creating phone booking');
            }

            return {
                status: 'success',
            };
        }),

    createPropertyTourBooking: publicProcedure
        .input(z.object({
            email: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            startTimestamp: z.string(),
            endTimestamp: z.string(),
            typeOfBooking: z.string(),
            propertyType: z.string(),
            phoneNumber: z.string(),
            notes: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                await axios.post(`${API_URL}/bookings/book-property-tour`, {
                    email: input.email,
                    firstName: input.firstName,
                    lastName: input.lastName,
                    startTimestamp: input.startTimestamp,
                    endTimestamp: input.endTimestamp,
                    typeOfBooking: input.typeOfBooking,
                    propertyType: input.propertyType,
                    phoneNumber: input.phoneNumber,
                    notes: input.notes,
                    blockWhatsApp: true,
                })
            } catch (error) {
                console.error('Error creating property tour booking', error);
            }

            return {
                status: 'success',
            };
        }),

    updateAdditionalNotes: publicProcedure
        .input(
            z.object({
                uid: z.string(),
                bookingType: z.string(),
                additionalNotes: z.string(),
            })
        )
        .mutation(
            async ({ input }) => {
                const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

                const tableRef = collection(db, tableNameRef);

                const d = doc(tableRef, input.uid);

                await updateDoc(d, {
                    additionalNotes: input.additionalNotes
                })
            }
        ),

    deleteBooking: publicProcedure
        .input(z.object({
            uid: z.string(),
            bookingType: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            await deleteDoc(d);
        }),

    getBookingDetails: publicProcedure
        .input(z.object({
            email: z.string(),
            type: z.string(),
            uid: z.string(),
        }))
        .query(async ({ input }) => {
            const tableNameRef = input.type === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            const booking = await getDoc(d);

            if (!booking.exists()) {
                throw new Error('Booking not found');
            }

            return booking.data();
        }),

    completeBooking: publicProcedure
        .input(z.object({
            uid: z.string(),
            bookingType: z.string(),
            postNotes: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            const currentDoc = await getDoc(d);

            if (!currentDoc.exists()) {
                throw new Error('Booking not found');
            }

            const additionalNotes = currentDoc.data().additionalNotes;

            const fullNotes = `${additionalNotes}\n\nPost Meeting Notes: \n${input.postNotes}`;

            await updateDoc(d, {
                status: 'completed',
                additionalNotes: fullNotes,
            });
        }),

    updateBookingStatus: publicProcedure
        .input(z.object({
            uid: z.string(),
            bookingType: z.string(),
            status: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            await updateDoc(d, {
                status: input.status,
            });
        }),
});
