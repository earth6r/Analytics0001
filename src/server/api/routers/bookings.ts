import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import admin from 'firebase-admin';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import moment from "moment";
import { z } from "zod";

// Set configuration options for the API route
export const config = {
    maxDuration: 300, // Maximum duration for the API route to respond to a request (5 minutes)
}

// export const API_URL = `http://localhost:3000/api`;
export const API_URL = `https://home0001.com/api`;

export const bookingsRouter = createTRPCRouter({
    getBookings: publicProcedure
        .input(z.object({
            email: z.string().optional(),
        }))
        .query(async ({ input },) => {
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
                return a.startTimestamp - b.startTimestamp;
            });

            for (const booking of bookings) {
                const url = `https://ui-avatars.com/api/?name=${booking?.firstName + " " + booking?.lastName}`;

                const potentialCustomerRef = collection(db, 'potentialCustomers');
                const q = query(potentialCustomerRef, where('email', '==', booking.email));
                const potentialCustomer = await getDocs(q);

                if (potentialCustomer.empty) {
                    booking.imageUrl = url;
                } else {
                    const firstDoc = potentialCustomer.docs[0];
                    booking.imageUrl = firstDoc?.data()?.imageUrl || url;
                }
            }

            if (input.email) {
                return bookings.filter(booking => booking.email === input.email);
            }

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
                    blockWhatsApp: false,
                })
            } catch (error) {
                console.error('Error creating phone booking', error);
                // TODO: handle this better i.e. return status error
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
                    phoneNumber: input.phoneNumber,
                    notes: input.notes,
                    blockWhatsApp: false,
                })
            } catch (error) {
                console.error('Error creating property tour booking', error);
                // TODO: handle this better i.e. return status error
                throw new Error('Error creating property tour booking');
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
            productFit: z.boolean(),
            productFitNotes: z.string(),
            budget: z.boolean(),
            budgetAmount: z.number(),
            budgetAmountMax: z.number(),
            interest: z.boolean(),
            interestNotes: z.string(),
            communityMember: z.boolean(),
            losAngeles: z.boolean(),
            newYork: z.boolean(),
            paris: z.boolean(),
            london: z.boolean(),
            berlin: z.boolean(),
            mexicoCity: z.boolean(),
            somewhereElse: z.boolean(),
            somewhereElseNotes: z.string(),
            timing: z.boolean(),
            selectedDate: z.date().optional(),
            bookATour: z.boolean(),
            timeline: z.string().nullable(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            const currentDoc = await getDoc(d);

            if (!currentDoc.exists()) {
                throw new Error('Booking not found');
            }

            const { email, firstName, lastName, phoneNumber } = currentDoc.data();

            try {
                const locationFitArray = [
                    ...(input.losAngeles ? ['LA'] : []),
                    ...(input.newYork ? ['NYC'] : []),
                    ...(input.paris ? ['Paris'] : []),
                    ...(input.london ? ['London'] : []),
                    ...(input.berlin ? ['Berlin'] : []),
                    ...(input.mexicoCity ? ['CDMX'] : []),
                    ...(input.somewhereElse ? ['Else'] : []),
                ];
                await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                    properties: {
                        product_fit_verified: input.productFit,
                        product_fit_description: input.productFitNotes,
                        budget_fit_verified: input.budget,
                        budget_min_value: input.budgetAmount,
                        budget_max_value: input.budgetAmountMax,
                        interest_fit_verified: input.interest,
                        interest_fit_details: input.interestNotes, // TODO: test this
                        location_fit_verified: input.losAngeles || input.newYork || input.paris || input.london || input.berlin || input.mexicoCity,
                        location_fit_detials: locationFitArray.join(';'),
                        location_fit_else: input.somewhereElseNotes,
                        buying_timeline_fit_verified: input.timing,
                        buying_timeline_details: input.selectedDate ? input.selectedDate.toISOString().split('T')[0] : null, // TODO: test both cases
                        community_member_qualified: input.communityMember,
                        book_tour_verified: input.bookATour,
                        buying_timeline_phone_call_meeting_notes: input.timeline,
                    }
                })
            } catch (error) {
                console.error('Error updating hubspot contact field', error);
            }

            // TODO: display old bookings with additionalNotes field in the booking-details page
            await updateDoc(d, {
                status: 'completed',
                additionalDetails: {
                    productFit: input.productFit,
                    productFitNotes: input.productFitNotes,
                    budget: input.budget,
                    budgetAmount: input.budgetAmount,
                    budgetAmountMax: input.budgetAmountMax,
                    interest: input.interest,
                    interestNotes: input.interestNotes,
                    communityMember: input.communityMember,
                    locations: {
                        losAngeles: input.losAngeles,
                        newYork: input.newYork,
                        paris: input.paris,
                        london: input.london,
                        berlin: input.berlin,
                        mexicoCity: input.mexicoCity,
                        somewhereElse: input.somewhereElse,
                        somewhereElseNotes: input.somewhereElseNotes,
                    },
                    timing: input.timing,
                    selectedDate: input.selectedDate ? input.selectedDate.getTime() : null,
                    bookATour: input.bookATour,
                    timeline: input.timeline,
                },
            });

            if (input.bookATour) {
                try {
                    await axios.post(`${API_URL}/bookings/book-property-tour`, {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        pending: true, // this means cannot validate start and end timestamps and cannot create a google calendar event
                        phoneNumber: phoneNumber,
                        blockWhatsApp: false,
                    })
                } catch (error) {
                    console.error('Error creating property tour booking', error);
                    // TODO: handle this better i.e. return status error
                    throw new Error('Error creating property tour booking');
                }
            }
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

    rescheduleBooking: publicProcedure
        .input(z.object({
            uid: z.string(),
            bookingType: z.string(),
            startTimestamp: z.string(),
            endTimestamp: z.string(),
            customerNotes: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            // TODO: make this more efficient by awaiting once and calling the variable
            const email = (await getDoc(d)).data()?.email || "";
            const firstName = (await getDoc(d)).data()?.firstName || "";
            const lastName = (await getDoc(d)).data()?.lastName || "";
            const phoneNumber = (await getDoc(d)).data()?.phoneNumber || "";
            const currentAdditionalNotes = (await getDoc(d)).data()?.additionalNotes || "";
            const appendAdditionalNotes = `Rescheduled booking with ${firstName} ${lastName} at ${input.startTimestamp} UTC`;

            const currentNotes = (await getDoc(d)).data()?.notes || "";
            const rescheduleCount = (await getDoc(d)).data()?.rescheduleCount || 0;

            await updateDoc(d, {
                startTimestamp: Number(moment.utc(input.startTimestamp, "YYYY-MM-DD HH:mm:ss").valueOf()),
                endTimestamp: Number(moment.utc(input.endTimestamp, "YYYY-MM-DD HH:mm:ss").valueOf()),
                additionalNotes: `${currentAdditionalNotes}\n\nRescheduled Booking: \n${appendAdditionalNotes}`,
                notes: `${currentNotes}\n\nRescheduled Customer Notes: \n${input.customerNotes || '-'}`,
                rescheduleCount: rescheduleCount + 1,
                status: 'rescheduled',
            });

            const currentDoc = await getDoc(d);

            if (input.bookingType === "Property Tour") {
                try {
                    const response = await axios.post(`${API_URL}/bookings/reschedule-property-tour-booking`, {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        startTimestamp: input.startTimestamp,
                        endTimestamp: input.endTimestamp,
                        phoneNumber: phoneNumber,
                        blockWhatsApp: false,
                        googleCalendarEventIdExistingBooking: currentDoc.data()?.googleCalendarEventId,
                    })

                    const { googleCalendarEventId } = response.data;

                    await updateDoc(d, {
                        googleCalendarEventId: googleCalendarEventId,
                    });
                } catch (error) {
                    console.error('Error creating property tour booking', error);
                }
            }
            else {
                try {
                    const response = await axios.post(`${API_URL}/bookings/reschedule-phone-call-booking`, {
                        email: email,
                        firstName: firstName,
                        lastName: lastName,
                        startTimestamp: input.startTimestamp,
                        endTimestamp: input.endTimestamp,
                        phoneNumber: phoneNumber,
                        blockWhatsApp: false,
                        googleCalendarEventIdExistingBooking: currentDoc.data()?.googleCalendarEventId,
                    })

                    const { googleCalendarEventId } = response.data;

                    await updateDoc(d, {
                        googleCalendarEventId: googleCalendarEventId,
                    });
                } catch (error) {
                    console.error('Error creating property tour booking', error);
                }
            }
        }),

    getAvailableHours: publicProcedure
        .input(z.object({
            email: z.string(),
        }))
        .query(async ({ input }) => {
            const response = await axios.post(
                `${API_URL}/google/available-meeting-hours?email=${input.email}`,
            );
            return response.data.data;
        }),

    // booking type should always be property tour
    confirmPendingPropertyTourBooking: publicProcedure
        .input(z.object({
            uid: z.string(),
            startTimestamp: z.string(),
            endTimestamp: z.string(),
        }))
        .mutation(async ({ input }) => {
            try {
                await axios.post(`${API_URL}/bookings/confirm-pending-property-tour-booking`, {
                    uid: input.uid,
                    startTimestamp: input.startTimestamp,
                    endTimestamp: input.endTimestamp,
                })
            } catch (error) {
                console.error('Error confirming property tour booking', error);
            }
        }),

    updateInterviewerName: publicProcedure
        .input(
            z.object({
                interviewer: z.string(),
                uid: z.string(),
                bookingType: z.string(),
            })
        )
        .mutation(
            async ({ input }) => {
                const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

                const tableRef = collection(db, tableNameRef);

                const d = doc(tableRef, input.uid);

                await updateDoc(d, {
                    interviewer: input.interviewer,
                });

                // update hubspot contact property of phone_call_interviewer
                const currentDoc = await getDoc(d);
                const { email } = currentDoc?.data() || {};

                try {
                    await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                        properties: {
                            phone_call_interviewer: input.interviewer,
                        }
                    })
                } catch (error) {
                    console.error('Error updating hubspot contact field', error);
                }
            }
        ),

    completedBookingsCount: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "completed"));
            const querySnapshot = await getDocs(phoneCallQuery);

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "completed"));
            const querySnapshot2 = await getDocs(propertyTourQuery);

            return querySnapshot.size + querySnapshot2.size;
        }),

    completedBookingsCountDelta: publicProcedure
        .query(async () => {
            return -1; // TODO: implement this
        }),

    cancelledBookingsCount: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "cancelled"));
            const querySnapshot = await getDocs(phoneCallQuery);

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "cancelled"));
            const querySnapshot2 = await getDocs(propertyTourQuery);

            return querySnapshot.size + querySnapshot2.size;
        }),

    cancelledBookingsCountDelta: publicProcedure
        .query(async () => {
            return -1; // TODO: implement this
        }),

    noShowBookingsCount: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "no-show"));
            const querySnapshot = await getDocs(phoneCallQuery);

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "no-show"));
            const querySnapshot2 = await getDocs(propertyTourQuery);

            return querySnapshot.size + querySnapshot2.size;
        }),

    noShowBookingsCountDelta: publicProcedure
        .query(async () => {
            return -1; // TODO: implement this
        }),

    pendingBookingsCount: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "pending"));
            const querySnapshot = await getDocs(phoneCallQuery);

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "pending"));
            const querySnapshot2 = await getDocs(propertyTourQuery);

            return querySnapshot.size + querySnapshot2.size;
        }),

    pendingBookingsCountDelta: publicProcedure
        .query(async () => {
            return -1; // TODO: implement this
        }),

    bookingsCount: publicProcedure
        .query(async () => {
            const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
            const querySnapshot = await getDocs(phoneCallBookingsRef);

            const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
            const querySnapshot2 = await getDocs(propertyTourBookingsRef);

            return querySnapshot.size + querySnapshot2.size;
        }),

    bookingsOverTime: publicProcedure.query(async () => {
        const startDate = new Date('2024-07-29');

        const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
        const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");

        // @ts-expect-error TODO: fix type
        function safeParseTimestamp(timestamp) {
            if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
            }
            if (timestamp instanceof Date) {
                return timestamp;
            }
            if (typeof timestamp === 'string' || typeof timestamp === 'number') {
                const parsed = new Date(timestamp);
                if (isNaN(parsed.getTime())) {
                    console.error('Invalid timestamp:', timestamp);
                    return null;
                }
                return parsed;
            }
            console.error('Unrecognized timestamp format:', timestamp);
            return null;
        }

        // @ts-expect-error TODO: fix type
        function processBookings(querySnapshot, type) {
            // @ts-expect-error TODO: fix type
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const parsedDate = safeParseTimestamp(data.startTimestamp);
                if (!parsedDate) {
                    console.error(`Invalid date for ${type} booking:`, doc.id, data.startTimestamp);
                    return null;
                }
                const date = parsedDate.toISOString().split("T")[0];
                return { date, type };
                // @ts-expect-error TODO: fix type
            }).filter(booking => booking !== null);
        }

        // Fetch and process phone call bookings
        const phoneCallQuerySnapshot = await getDocs(phoneCallBookingsRef);
        const phoneCallBookings = processBookings(phoneCallQuerySnapshot, "Call");

        // Fetch and process property tour bookings
        const propertyTourQuerySnapshot = await getDocs(propertyTourBookingsRef);
        const propertyTourBookings = processBookings(propertyTourQuerySnapshot, "Tour");

        // Combine bookings
        const allBookings = [...phoneCallBookings, ...propertyTourBookings];

        // Create a map to store all dates from startDate to the current date
        const currentDate = new Date();
        const dateMap = {};
        for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split("T")[0];
            // @ts-expect-error TODO: fix type
            dateMap[formattedDate] = { date: formattedDate, Tour: 0, Call: 0 };
        }

        // Aggregate bookings into the dateMap
        allBookings.forEach(({ date, type }) => {
            // @ts-expect-error TODO: fix type
            if (dateMap[date]) {
                // @ts-expect-error TODO: fix type
                dateMap[date][type] += 1;
            }
        });

        // Convert the dateMap object to an array
        return Object.values(dateMap);
    }),

    cancelledBookingsOverTime: publicProcedure.query(async () => {
        const startDate = new Date('2024-07-29');

        const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
        const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "cancelled"));
        const phoneCallQuerySnapshot = await getDocs(phoneCallQuery);

        const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
        const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "pending"));
        const propertyTourQuerySnapshot = await getDocs(propertyTourQuery);

        // @ts-expect-error TODO: fix type
        function safeParseTimestamp(timestamp) {
            if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
            }
            if (timestamp instanceof Date) {
                return timestamp;
            }
            if (typeof timestamp === 'string' || typeof timestamp === 'number') {
                const parsed = new Date(timestamp);
                if (isNaN(parsed.getTime())) {
                    console.error('Invalid timestamp:', timestamp);
                    return null;
                }
                return parsed;
            }
            console.error('Unrecognized timestamp format:', timestamp);
            return null;
        }

        // @ts-expect-error TODO: fix type
        function processBookings(querySnapshot, type) {
            // @ts-expect-error TODO: fix type
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const parsedDate = safeParseTimestamp(data.startTimestamp);
                if (!parsedDate) {
                    console.error(`Invalid date for ${type} booking:`, doc.id, data.startTimestamp);
                    return null;
                }
                const date = parsedDate.toISOString().split("T")[0];
                return { date, type };
                // @ts-expect-error TODO: fix type
            }).filter(booking => booking !== null);
        }

        // Fetch and process phone call bookings
        const phoneCallBookings = processBookings(phoneCallQuerySnapshot, "Call");

        // Fetch and process property tour bookings
        const propertyTourBookings = processBookings(propertyTourQuerySnapshot, "Tour");

        // Combine bookings
        const allBookings = [...phoneCallBookings, ...propertyTourBookings];

        // Create a map to store all dates from startDate to the current date
        const currentDate = new Date();
        const dateMap = {};
        for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split("T")[0];
            // @ts-expect-error TODO: fix type
            dateMap[formattedDate] = { date: formattedDate, Tour: 0, Call: 0 };
        }

        // Aggregate bookings into the dateMap
        allBookings.forEach(({ date, type }) => {
            // @ts-expect-error TODO: fix type
            if (dateMap[date]) {
                // @ts-expect-error TODO: fix type
                dateMap[date][type] += 1;
            }
        });

        // Convert the dateMap object to an array
        return Object.values(dateMap);
    }),

    completedBookingsOverTime: publicProcedure.query(async () => {
        const startDate = new Date('2024-07-29');

        const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
        const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "completed"));
        const phoneCallQuerySnapshot = await getDocs(phoneCallQuery);

        const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
        const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "completed"));
        const propertyTourQuerySnapshot = await getDocs(propertyTourQuery);

        // @ts-expect-error TODO: fix type
        function safeParseTimestamp(timestamp) {
            if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
            }
            if (timestamp instanceof Date) {
                return timestamp;
            }
            if (typeof timestamp === 'string' || typeof timestamp === 'number') {
                const parsed = new Date(timestamp);
                if (isNaN(parsed.getTime())) {
                    console.error('Invalid timestamp:', timestamp);
                    return null;
                }
                return parsed;
            }
            console.error('Unrecognized timestamp format:', timestamp);
            return null;
        }

        // @ts-expect-error TODO: fix type
        function processBookings(querySnapshot, type) {
            // @ts-expect-error TODO: fix type
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const parsedDate = safeParseTimestamp(data.startTimestamp);
                if (!parsedDate) {
                    console.error(`Invalid date for ${type} booking:`, doc.id, data.startTimestamp);
                    return null;
                }
                const date = parsedDate.toISOString().split("T")[0];
                return { date, type };
                // @ts-expect-error TODO: fix type
            }).filter(booking => booking !== null);
        }

        // Fetch and process phone call bookings
        const phoneCallBookings = processBookings(phoneCallQuerySnapshot, "Call");

        // Fetch and process property tour bookings
        const propertyTourBookings = processBookings(propertyTourQuerySnapshot, "Tour");

        // Combine bookings
        const allBookings = [...phoneCallBookings, ...propertyTourBookings];

        // Create a map to store all dates from startDate to the current date
        const currentDate = new Date();
        const dateMap = {};
        for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split("T")[0];
            // @ts-expect-error TODO: fix type
            dateMap[formattedDate] = { date: formattedDate, Tour: 0, Call: 0 };
        }

        // Aggregate bookings into the dateMap
        allBookings.forEach(({ date, type }) => {
            // @ts-expect-error TODO: fix type
            if (dateMap[date]) {
                // @ts-expect-error TODO: fix type
                dateMap[date][type] += 1;
            }
        });

        // Convert the dateMap object to an array
        return Object.values(dateMap);
    }),

    noShowBookingsOverTime: publicProcedure.query(async () => {
        const startDate = new Date('2024-07-29');

        const phoneCallBookingsRef = collection(db, "usersBookPhoneCall");
        const phoneCallQuery = query(phoneCallBookingsRef, where("status", "==", "no-show"));
        const phoneCallQuerySnapshot = await getDocs(phoneCallQuery);

        const propertyTourBookingsRef = collection(db, "usersBookPropertyTour");
        const propertyTourQuery = query(propertyTourBookingsRef, where("status", "==", "no-show"));
        const propertyTourQuerySnapshot = await getDocs(propertyTourQuery);

        // @ts-expect-error TODO: fix type
        function safeParseTimestamp(timestamp) {
            if (timestamp?.toDate && typeof timestamp.toDate === 'function') {
                return timestamp.toDate();
            }
            if (timestamp instanceof Date) {
                return timestamp;
            }
            if (typeof timestamp === 'string' || typeof timestamp === 'number') {
                const parsed = new Date(timestamp);
                if (isNaN(parsed.getTime())) {
                    console.error('Invalid timestamp:', timestamp);
                    return null;
                }
                return parsed;
            }
            console.error('Unrecognized timestamp format:', timestamp);
            return null;
        }

        // @ts-expect-error TODO: fix type
        function processBookings(querySnapshot, type) {
            // @ts-expect-error TODO: fix type
            return querySnapshot.docs.map((doc) => {
                const data = doc.data();
                const parsedDate = safeParseTimestamp(data.startTimestamp);
                if (!parsedDate) {
                    console.error(`Invalid date for ${type} booking:`, doc.id, data.startTimestamp);
                    return null;
                }
                const date = parsedDate.toISOString().split("T")[0];
                return { date, type };
                // @ts-expect-error TODO: fix type
            }).filter(booking => booking !== null);
        }

        // Fetch and process phone call bookings
        const phoneCallBookings = processBookings(phoneCallQuerySnapshot, "Call");

        // Fetch and process property tour bookings
        const propertyTourBookings = processBookings(propertyTourQuerySnapshot, "Tour");

        // Combine bookings
        const allBookings = [...phoneCallBookings, ...propertyTourBookings];

        // Create a map to store all dates from startDate to the current date
        const currentDate = new Date();
        const dateMap = {};
        for (let d = new Date(startDate); d <= currentDate; d.setDate(d.getDate() + 1)) {
            const formattedDate = d.toISOString().split("T")[0];
            // @ts-expect-error TODO: fix type
            dateMap[formattedDate] = { date: formattedDate, Tour: 0, Call: 0 };
        }

        // Aggregate bookings into the dateMap
        allBookings.forEach(({ date, type }) => {
            // @ts-expect-error TODO: fix type
            if (dateMap[date]) {
                // @ts-expect-error TODO: fix type
                dateMap[date][type] += 1;
            }
        });

        // Convert the dateMap object to an array
        return Object.values(dateMap);
    }),
});
