import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import axios from "axios";
import admin from 'firebase-admin';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
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
                    booking.hotWarmCold = firstDoc?.data()?.hotWarmCold || null;
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

            disableTextReminder: z.boolean(),
            disableCalendarInvite: z.boolean(),
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

                    disableTextReminder: input.disableTextReminder,
                    disableCalendarInvite: input.disableCalendarInvite,
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

            disableTextReminder: z.boolean(),
            disableCalendarInvite: z.boolean(),
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

                    disableTextReminder: input.disableTextReminder,
                    disableCalendarInvite: input.disableCalendarInvite,
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

            const booking = await getDoc(d);

            await deleteDoc(d);

            try {
                await axios.delete(`${API_URL}/google/delete-google-calendar-event`, {
                    data: {
                        eventId: booking.data()?.googleCalendarEventId,
                        bookingType: input.bookingType,
                    }
                });
            } catch (error) {
                console.error('Error deleting google calendar event', error);
            }
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
            whatApartmentsDidTheySee: z.string().nullable(),
            whatApartmentsAreTheirFavorites: z.string().nullable(),
            meetingNotes: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            const currentDoc = await getDoc(d);

            if (!currentDoc.exists()) {
                throw new Error('Booking not found');
            }

            const { email, firstName, lastName, phoneNumber, interviewer = "" } = currentDoc.data();

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
                    whatApartmentsDidTheySee: input.whatApartmentsDidTheySee,
                    whatApartmentsAreTheirFavorites: input.whatApartmentsAreTheirFavorites,
                    meetingNotes: input.meetingNotes,
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

    addHubspotNote: publicProcedure
        .input(z.object({
            email: z.string(),
            uid: z.string(),
            bookingType: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = input.bookingType === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            const currentDoc = await getDoc(d);

            if (!currentDoc.exists()) {
                throw new Error('Booking not found');
            }

            const { additionalDetails, interviewer = "" } = currentDoc.data();

            let note = `Host: ${interviewer ?? '-'}\n\nNotes: ${additionalDetails?.meetingNotes ?? '-'}\n\n`;

            if (input.bookingType === "Property Tour") {
                const { whatApartmentsDidTheySee, whatApartmentsAreTheirFavorites } = currentDoc.data();

                note += `What apartments did they see: ${whatApartmentsDidTheySee ?? '-'}\n\n`;
                note += `What apartments are their favorites: ${whatApartmentsAreTheirFavorites ?? '-'}\n\n`;
            }

            try {
                await axios.post(`${API_URL}/hubspot/add-note?email=${input.email}`, {
                    note,
                });
            } catch (error) {
                console.error('Error adding hubspot note', error);
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
            disableCalendarInvite: z.boolean(),
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
                        disableCalendarInvite: input.disableCalendarInvite,
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
                        disableCalendarInvite: input.disableCalendarInvite,
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

    bookingsCountByType: publicProcedure
        .input(
            z.object({
                startDate: z.date(),
                endDate: z.date(),
                type: z.string(),
            }),
        )
        .query(async ({ input }) => {
            let bookingsRef;

            if (input.type === "Property Tour") {
                bookingsRef = collection(db, "usersBookPropertyTour");
            } else {
                bookingsRef = collection(db, "usersBookPhoneCall");
            }
            // const q = await getDocs(query(bookingsRef, where("startTimestamp", ">=", (input.startDate.getTime() * 1000)), where("startTimestamp", "<=", (input.endDate.getTime() * 1000))));

            const querySnapshot = await getDocs(bookingsRef);

            let count = 0;
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const parsedDate = new Date(data.startTimestamp);
                if (parsedDate >= input.startDate && parsedDate <= input.endDate) {
                    count++;
                }
            });

            return count;
        }),

    getBookingsCount: publicProcedure
        .input(z.object({
            type: z.string(),
        }))
        .query(async ({ input }) => {
            const indexName = input.type === "Property Tour" ? "usersBookPropertyTour" : "usersBookPhoneCall";
            const bookingsRef = collection(db, indexName);
            const dateField = "startTimestamp";

            const counts = {
                'lessThan30Days': 0,
                'oneToThreeMonths': 0,
                'threeToSixMonths': 0,
                'sixPlusMonths': 0,
            };

            // Less than 30 days
            let startDate = moment.utc().startOf("day").subtract(30, "days").toDate();
            let endDate = moment.utc().endOf("day").toDate();

            let bookings = await getDocs(query(bookingsRef,
                where(dateField, ">=", startDate.getTime()),
                where(dateField, "<=", endDate.getTime())
            ));

            counts.lessThan30Days = bookings.size;

            // 1 to 3 months
            startDate = moment.utc().startOf("day").subtract(3, "months").toDate();
            endDate = moment.utc().startOf("day").subtract(1, "months").toDate();

            bookings = await getDocs(query(bookingsRef,
                where(dateField, ">=", startDate.getTime()),
                where(dateField, "<=", endDate.getTime())
            ));

            counts.oneToThreeMonths = bookings.size;

            // 3 to 6 months
            startDate = moment.utc().startOf("day").subtract(6, "months").toDate();
            endDate = moment.utc().startOf("day").subtract(3, "months").toDate();

            bookings = await getDocs(query(bookingsRef,
                where(dateField, ">=", startDate.getTime()),
                where(dateField, "<=", endDate.getTime())
            ));

            counts.threeToSixMonths = bookings.size;

            // 6 plus months
            startDate = moment.utc().subtract(60, 'months').toDate();
            endDate = moment.utc().startOf("day").subtract(6, "months").toDate();

            bookings = await getDocs(query(bookingsRef,
                where(dateField, ">=", startDate.getTime()),
                where(dateField, "<=", endDate.getTime())
            ));

            counts.sixPlusMonths = bookings.size;

            return [
                { 'Less than 30 days': counts.lessThan30Days },
                { '1 to 3 months': counts.oneToThreeMonths },
                { '3 to 6 months': counts.threeToSixMonths },
                { '6+ months': counts.sixPlusMonths },
            ];
        }),

    addNextSteps: publicProcedure
        .input(z.object({
            previousIndex: z.number().nullable().optional(),
            email: z.string(),
            nextStepsNotes: z.string(),
            nextStepsDropdownValue: z.string(),
            deferredDate: z.number().nullable(),
        }))
        .mutation(
            async ({ input }) => {
                const tableNameRef = "potentialCustomers";

                const tableRef = collection(db, tableNameRef);

                const result = await getDocs(query(tableRef, where("email", "==", input.email)));

                if (result.empty) {
                    await addDoc(tableRef, {
                        email: input.email,
                        nextStepsDropdownValue: input.nextStepsDropdownValue ? [
                            {
                                value: input.nextStepsDropdownValue,
                                timestamp: Math.floor(moment.utc().valueOf() / 1000),
                                nextStepsNotes: input.nextStepsNotes,
                                deferredDate: input.deferredDate,
                            }
                        ] : [],
                    });
                } else {
                    const d = doc(tableRef, result.docs[0]?.id);

                    const currentNextStepsDropdownValue = result.docs[0]?.data()?.nextStepsDropdownValue || [];

                    if (input.previousIndex !== null && input.previousIndex !== undefined && currentNextStepsDropdownValue.length > input.previousIndex) {
                        currentNextStepsDropdownValue[input.previousIndex].completed = true;
                    }

                    if (input.nextStepsDropdownValue) {
                        currentNextStepsDropdownValue.push({
                            value: input.nextStepsDropdownValue,
                            timestamp: Math.floor(moment.utc().valueOf() / 1000),
                            nextStepsNotes: input.nextStepsNotes,
                            deferredDate: input.deferredDate,
                        });
                    }

                    await updateDoc(d, {
                        nextStepsDropdownValue: currentNextStepsDropdownValue,
                    });
                }
            }
        ),

    getNextSteps: publicProcedure
        .input(z.object({
            email: z.string(),
        }))
        .query(
            async ({ input }) => {
                const tableNameRef = "potentialCustomers";

                const tableRef = collection(db, tableNameRef);

                const result = await getDocs(query(tableRef, where("email", "==", input.email)));

                if (result.empty) {
                    return null;
                }

                return result?.docs[0]?.data();
            }
        ),

    getProfileData: publicProcedure
        .input(z.object({
            email: z.string(),
        }))
        .query(async ({ input }) => {
            const tableNameRef = "potentialCustomers";

            const tableRef = collection(db, tableNameRef);

            const result = await getDocs(query(tableRef, where("email", "==", input.email)));

            if (result.empty) {
                return null;
            }

            const data = result?.docs[0]?.data();

            return data;
        }),

    updateProfileData: publicProcedure
        .input(z.any()) // TODO: add zod schema with exact types
        .mutation(async ({ input }) => {
            const tableNameRef = "potentialCustomers";

            const tableRef = collection(db, tableNameRef);

            const result = await getDocs(query(tableRef, where("email", "==", input.email)));

            if (result.empty) {
                await addDoc(tableRef, {
                    ...input,
                    email: input.email,
                });
            } else {
                const d = doc(tableRef, result.docs[0]?.id);

                await updateDoc(d, {
                    ...input,
                });
            }

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${input.email}`, {
                properties: {
                    ...(!!input.gender && { gender__1_: input.gender }),
                    ...(!!input.age && { age: input.age }),
                    ...(!!input.profession && { profession: input.profession }),
                    ...(!!input.website && { website__1_: input.website }),
                    ...(!!input.instagram && { instagram__1_: input.instagram }),
                    ...(!!input.facebook && { facebook: input.facebook }),
                    ...(!!input.twitter && { twitter: input.twitter }),
                    ...(!!input.whatsApp && { whatsapp: input.whatsApp }),
                    ...(!!input.telegram && { telegram: input.telegram }),
                    ...(!!input.signal && { signal: input.signal }),
                    ...(!!input.relationshipStatus && { relationship_status__1_: input.relationshipStatus }),
                    ...(input.kids !== undefined && input.kids !== null && { kids: input.kids }),
                    ...(input.hasPets !== undefined && input.hasPets !== null && { has_pets: input.hasPets }),
                    ...(!!input.petTypes && { pet_types: input.petTypes.join(',') }),
                    ...(!!input.bio && { bio: input.bio }),
                    ...(!!input.personalNotes && { personal_notes: input.personalNotes }),
                    ...(!!input.communityFit && { community_fit: input.communityFit }),
                    ...(!!input.communityScore && { community_score: input.communityScore }),
                    ...(!!input.personalityType && { personality_type: input.personalityType }),
                    ...(!!input.relevance && { relevance: input.relevance.join(',') }),
                    ...(!!input.eyeCatchingNote && { eye_catching_notes: input.eyeCatchingNote }),
                    ...(input.knowOMA !== undefined && input.knowOMA !== null && { know_oma: input.knowOMA }),
                    ...(!!input.OMANotes && { oma_notes: input.OMANotes }),
                    ...(input.interestInHomeSwapping !== undefined && input.interestInHomeSwapping !== null && { interest_in_home_swapping: input.interestInHomeSwapping }),
                    ...(!!input.interestInHomeSwappingNotes && { interest_in_home_swapping_notes: input.interestInHomeSwappingNotes }),
                    ...(input.interestInFurniture !== undefined && input.interestInFurniture !== null && { interest_in_furniture: input.interestInFurniture }),
                    ...(!!input.interestInFurnitureNotes && { interest_in_furniture_notes: input.interestInFurnitureNotes }),
                    ...(!!input.currentlyLivingIn && { currently_living_in: input.currentlyLivingIn }),
                    ...(!!input.currentLivingSituation && { current_living_situation: input.currentLivingSituation }),
                    ...(input.firstTimeBuyer !== undefined && input.firstTimeBuyer !== null && { first_time_buyer: input.firstTimeBuyer }),
                    ...(input.cashBuyer !== undefined && input.cashBuyer !== null && { cash_buyer: input.cashBuyer }),
                    ...(input.broker !== undefined && input.broker !== null && { broker: input.broker }),
                    ...(input.attorney !== undefined && input.attorney !== null && { attorney: input.attorney }),
                    ...(!!input.whosPaying && { who_s_paying: input.whosPaying }),
                    ...(!!input.homeType && { home_type__1_: input.homeType }),
                    ...(!!input.homePurchaseType && { home_purchase_type: input.homePurchaseType }),
                    ...(input.mortgagePreQualified !== undefined && input.mortgagePreQualified !== null && { mortgage_pre_qualified: input.mortgagePreQualified }),
                    ...(input.wantsHelpFinancing !== undefined && input.wantsHelpFinancing !== null && { wants_help_financing: input.wantsHelpFinancing }),
                    ...(!!input.lookingForCity && { looking_for_city: input.lookingForCity }),
                    ...(!!input.lookingForNeighborhood && { looking_for_neighborhoold: input.lookingForNeighborhood }),
                    ...(!!input.lookingForUnitType && { looking_for_unit_type: input.lookingForUnitType }),
                    ...(!!input.maxBudget && { max_budget: input.maxBudget }),
                    ...(!!input.buyingTimeline && { buying_timeline__1_: input.buyingTimeline.join(',') }),
                    ...(!!input.funnelType && { funnel_type: input.funnelType }),
                    ...(!!input.realBuyerTimeline && { real_buyer_timeline: input.realBuyerTimeline }),
                    ...(!!input.relevantProperty && { relevant_property: input.relevantProperty.join(',') }),
                    ...(input.travel_for_work !== undefined && input.travel_for_work !== null && { travel_for_work: input.travelForWork }),
                    ...(!!input.travel_frequency && { travel_frequency: input.travelFrequency }),
                    ...(!!input.family_abroad && { family_abroad: input.familyAbroad }),
                    ...(!!input.frequented_cities && { frequented_cities: input.frequentedCities }),
                    ...(!!input.desired_cities && { desired_cities: input.desiredCities }),
                    ...(!!input.necessity_or_amenity && { necessity_or_amenity: input.necessityOrAmenity }),
                    ...(!!input.how_they_found_home0001 && { how_they_found_home0001: input.howTheyFoundHome0001 }),
                    ...(!!input.what_spark_interest && { what_spark_interest: input.whatSparkInterest }),
                    ...(!!input.what_they_like_about_apartments && { what_they_like_about_apartments: input.whatTheyLikeAboutApartments }),
                    ...(!!input.what_they_don_t_like_about_apartments && { what_they_don_t_like_about_apartments: input.whatTheyDontLikeAboutApartments }),
                    ...(!!input.other_neighborhoods && { other_neighborhoods: input.otherNeighborhoods }),
                    ...(!!input.other_cities && { other_cities: input.otherCities }),
                    ...(!!input.additional_notes && { additional_notes: input.additionalNotes }),
                    ...(!!input.profile_notes && { profile_notes: input.profileNotes }),
                }
            });
        }),

    getPotentialCustomers: publicProcedure
        .query(async () => {
            const tableNameRef = "potentialCustomers";

            const tableRef = collection(db, tableNameRef);

            const result = await getDocs(tableRef);

            // @ts-expect-error TODO: fix type
            const data = [];

            result.forEach((doc) => {
                data.push(
                    {
                        uid: doc.id,
                        ...doc.data(),
                    }
                );
            });

            // @ts-expect-error TODO: fix type
            return data;
        }),

    updatePotentialCustomer: publicProcedure
        .input(z.object({
            uid: z.string(),
            firstName: z.string(),
            lastName: z.string(),
            phoneNumber: z.string(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = "potentialCustomers";

            const tableRef = collection(db, tableNameRef);

            const d = doc(tableRef, input.uid);

            await updateDoc(d, {
                firstName: input.firstName,
                lastName: input.lastName,
                phoneNumber: input.phoneNumber,
            });
        }),

    markNextStepAsCompleted: publicProcedure
        .input(z.object({
            email: z.string(),
            index: z.number(),
        }))
        .mutation(async ({ input }) => {
            const tableNameRef = "potentialCustomers";

            const tableRef = collection(db, tableNameRef);

            const result = await getDocs(query(tableRef, where("email", "==", input.email)));

            if (result.empty) {
                return;
            }

            const d = doc(tableRef, result.docs[0]?.id);

            const currentNextStepsDropdownValue = result.docs[0]?.data()?.nextStepsDropdownValue || [];

            if (currentNextStepsDropdownValue.length <= input.index) {
                return;
            }

            currentNextStepsDropdownValue[input.index].completed = true;

            await updateDoc(d, {
                nextStepsDropdownValue: currentNextStepsDropdownValue,
            });
        }),
});
