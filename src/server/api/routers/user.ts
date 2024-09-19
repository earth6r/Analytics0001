import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import admin from 'firebase-admin';
import { put } from '@vercel/blob';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { db } from "@/utils/firebase/initialize";
import { nextStepsMapping } from "@/components/bookings/next-steps-dropdown";
import { profile } from "console";
import axios from "axios";
import { API_URL } from "./bookings";

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
                "phoneCallBookings": [],
                "propertyTourBookings": [],
                "buyingProgress": [],
                "messages": [],
                "register": [],
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

            // register
            const registerRef = db.collection('register').where('email', '==', email).get();
            // @ts-expect-error TODO: fix this
            const register = [];
            (await registerRef).forEach((doc) => {
                const data = doc.data();
                register.push(data);
            });

            // @ts-expect-error TODO: fix this
            userData.register = register;

            return userData;
        }),

    uploadFileAndGetUrl: publicProcedure
        .input(z.object({
            fileBase64: z.string(),
        }))
        .mutation(async ({ input }): Promise<{ url: string; }> => {
            // Split the input to separate the metadata from the actual Base64 data
            const matches = input.fileBase64.match(/^data:(.*);base64,(.*)$/);
            if (!matches || matches.length !== 3) {
                throw new Error("Invalid input string");
            }

            // Extract the Base64 data (without the metadata)
            const base64Data = matches[2];
            const contentType = matches[1]; // This could be useful if you need to set the content type

            // Convert Base64 string to a Buffer
            // @ts-expect-error Buffer type error TODO: fix
            const fileBuffer = Buffer.from(base64Data, 'base64');

            // Now you have a binary representation of the image in fileBuffer
            // Depending on how your storage's put method works, you might need a Blob or Stream.
            // If put method accepts a Buffer directly, you can proceed as follows:

            // Assuming `put` function accepts filename, data (as Buffer), and options
            const filename = `image_${Date.now()}`; // Generate a filename; adjust as needed
            return await put(filename, fileBuffer, {
                access: 'public',
                token: process.env.BLOB_READ_WRITE_TOKEN,
                contentType: contentType, // Optionally set the content type
            });
        }),

    savePotentialCustomerDetails: publicProcedure
        .input(
            z.object({
                email: z.string(),
                imageUrl: z.string(),
                profileNotes: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, imageUrl, profileNotes } = input;

            const potentialCustomerRef = collection(db, 'potentialCustomers');

            // Query to find the document with the specified email
            const potentialCustomerQuery = query(potentialCustomerRef, where('email', '==', email));

            // Execute the query
            const querySnapshot = await getDocs(potentialCustomerQuery);

            if (querySnapshot.empty) {
                await addDoc(potentialCustomerRef, {
                    email,
                    imageUrl,
                    profileNotes,
                });
            } else {
                const firstDoc = querySnapshot.docs[0];
                // @ts-expect-error TODO: fix this
                await updateDoc(doc(potentialCustomerRef, firstDoc.id), {
                    imageUrl,
                    profileNotes,
                });
            }
        }),

    getPotentialCustomerDetails: publicProcedure
        .input(
            z.object({
                email: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const { email } = input;

            const potentialCustomerRef = collection(db, 'potentialCustomers');

            // Query to find the document with the specified email
            const potentialCustomerQuery = query(potentialCustomerRef, where('email', '==', email));

            // Execute the query
            const querySnapshot = await getDocs(potentialCustomerQuery);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];

            // @ts-expect-error TODO: fix this
            return doc.data();
        }),

    deleteChainLink: publicProcedure
        .input(
            z.object({
                email: z.string(),
                index: z.number(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, index } = input;

            const tableName = "potentialCustomers";

            const potentialCustomerRef = collection(db, tableName);

            // Query to find the document with the specified email
            const potentialCustomerQuery = query(potentialCustomerRef, where('email', '==', email));
            const querySnapshot = await getDocs(potentialCustomerQuery);

            if (querySnapshot.empty) {
                throw new Error('Potential customer not found');
            }

            const doc = querySnapshot.docs[0];


            const { nextStepsDropdownValue } = doc?.data() as { nextStepsDropdownValue: any[] };

            const currentNextStepsDropdownValue = nextStepsDropdownValue as any[];
            currentNextStepsDropdownValue.splice(index, 1);

            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                nextStepsDropdownValue: currentNextStepsDropdownValue,
            });
        }),

    allNextSteps: publicProcedure
        .query(async () => {
            const potentialCustomerRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(potentialCustomerRef);

            const nextSteps = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();

                // check if data has nextStepsDropdownValue or deferredDate or nextStepsNotes
                if (Object(data).hasOwnProperty('nextStepsDropdownValue') || Object(data).hasOwnProperty('deferredDate') || Object(data).hasOwnProperty('nextStepsNotes')) {
                    const { nextStepsDropdownValue } = data;

                    // query usersBookPhoneCall and usersBookPropertyTour for firstName and lastName
                    let firstName = '';
                    let lastName = '';
                    let collectionRef = collection(db, 'usersBookPhoneCall');
                    let querySnapshot = await getDocs(query(collectionRef, where('email', '==', data.email)));
                    if (querySnapshot.empty) {
                        collectionRef = collection(db, 'usersBookPropertyTour');
                        querySnapshot = await getDocs(query(collectionRef, where('email', '==', data.email)));

                        if (!querySnapshot.empty) {
                            firstName = querySnapshot?.docs[0]?.data().firstName;
                            lastName = querySnapshot?.docs[0]?.data().lastName;
                        }
                    } else {
                        firstName = querySnapshot?.docs[0]?.data().firstName;
                        lastName = querySnapshot?.docs[0]?.data().lastName;
                    }

                    const subNextSteps = [];
                    for (let i = 0; i < nextStepsDropdownValue.length; i++) {
                        const nextStep = nextStepsDropdownValue[i];
                        if (nextStep?.completed) {
                            continue;
                        }

                        let nextStepValue = nextStep.value;
                        const status = nextStepValue.startsWith("action:") ? "Action Required" : "Awaiting Response";

                        // @ts-expect-error TODO: fix this type
                        if (nextStepsMapping[nextStepValue]) {
                            // @ts-expect-error TODO: fix this type
                            nextStepValue = nextStepsMapping[nextStepValue];
                        } else {
                            nextStepValue = nextStepValue.replace('action:', '').replace('awaiting:', '');
                        }

                        const phoneCallBookingDetails = await getDocs(query(collection(db, 'usersBookPhoneCall'), where('email', '==', data.email)));
                        const propertyTourBookingDetails = await getDocs(query(collection(db, 'usersBookPropertyTour'), where('email', '==', data.email)));

                        let bookingUid = null;
                        let type = null;

                        if (!phoneCallBookingDetails.empty) {
                            bookingUid = phoneCallBookingDetails?.docs[0]?.id;
                            type = 'Phone Call';
                        }
                        if (!propertyTourBookingDetails.empty) {
                            bookingUid = propertyTourBookingDetails?.docs[0]?.id;
                            type = 'Property Tour';
                        }

                        subNextSteps.push({
                            index: i,
                            profile: {
                                email: data.email,
                                firstName,
                                lastName,
                                imageUrl: data?.imageUrl || `https://ui-avatars.com/api/?name=${firstName} ${lastName}`,
                                hotWarmCold: data?.hotWarmCold || null,
                            },
                            latestNextStep: nextStepValue,
                            latestStatus: status,
                            deferredDate: nextStep.deferredDate,
                            notes: nextStep.nextStepsNotes,
                            bookingUid,
                            type,
                            hotWarmCold: data?.hotWarmCold,
                        });
                    };

                    nextSteps.push(...subNextSteps);
                }
            }
            return nextSteps;
        }),

    getMainLogins: publicProcedure
        .query(async () => {
            const userRef = collection(db, 'login_history');
            const querySnapshot = await getDocs(userRef);

            const logins = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();

                if (data.login_type === "main_page") {
                    logins.push(data);
                }
            }

            return logins;
        }),

    getAnalyticsLogins: publicProcedure
        .query(async () => {
            const userRef = collection(db, 'login_history');
            const querySnapshot = await getDocs(userRef);

            const logins = [];

            for (const doc of querySnapshot.docs) {
                const data = doc.data();

                if (data.login_type === "stats_page") {
                    logins.push(data);
                }
            }

            return logins;
        }),

    setHotWarmCold: publicProcedure
        .input(
            z.object({
                email: z.string(),
                hotWarmCold: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, hotWarmCold } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                hotWarmCold,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    hot_warm_cold__1_: hotWarmCold,
                },
            });
        }),

    updateSocials: publicProcedure
        .input(
            z.object({
                email: z.string(),
                website: z.string(),
                instagram: z.string(),
                facebook: z.string(),
                twitter: z.string(),
                whatsApp: z.string(),
                signal: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, website, instagram, facebook, twitter, whatsApp, signal } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                website,
                instagram,
                facebook,
                twitter,
                whatsApp,
                signal,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    website__1_: website,
                    instagram__1_: instagram,
                    facebook: facebook,
                    twitter: twitter,
                    whatsapp: whatsApp,
                    signal: signal,
                },
            });
        }),

    updateProfession: publicProcedure
        .input(
            z.object({
                email: z.string(),
                profession: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, profession } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                profession,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    profession: profession,
                },
            });
        }),

    updateAge: publicProcedure
        .input(
            z.object({
                email: z.string(),
                age: z.number(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, age } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                age,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    age: age,
                },
            });
        }),

    updateKids: publicProcedure
        .input(
            z.object({
                email: z.string(),
                kids: z.number(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, kids } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                kids,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    kids: kids,
                },
            });
        }),

    updateRelationshipStatus: publicProcedure
        .input(
            z.object({
                email: z.string(),
                relationshipStatus: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, relationshipStatus } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                relationshipStatus,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    relationship_status__1_: relationshipStatus,
                },
            });
        }),

    updatePets: publicProcedure
        .input(
            z.object({
                email: z.string(),
                hasPets: z.boolean(),
                petTypes: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, hasPets, petTypes } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                hasPets,
                petTypes,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    has_pets: hasPets,
                    pet_types: petTypes.join(','),
                },
            });
        }),

    updatePersonalityType: publicProcedure
        .input(
            z.object({
                email: z.string(),
                personalityType: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, personalityType } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                personalityType,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    personality_type: personalityType,
                },
            });
        }),

    updateFirstTimeBuyer: publicProcedure
        .input(
            z.object({
                email: z.string(),
                firstTimeBuyer: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, firstTimeBuyer } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                firstTimeBuyer,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    first_time_buyer: firstTimeBuyer,
                },
            });
        }),

    updateCashBuyer: publicProcedure
        .input(
            z.object({
                email: z.string(),
                cashBuyer: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, cashBuyer } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                cashBuyer,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    cash_buyer: cashBuyer,
                },
            });
        }),

    updateBroker: publicProcedure
        .input(
            z.object({
                email: z.string(),
                broker: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, broker } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                broker,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    broker: broker,
                },
            });
        }),

    updateAttorney: publicProcedure
        .input(
            z.object({
                email: z.string(),
                attorney: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, attorney } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                attorney,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    attorney: attorney,
                },
            });
        }),

    updateWhosPaying: publicProcedure
        .input(
            z.object({
                email: z.string(),
                whosPaying: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, whosPaying } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                whosPaying,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    who_s_paying: whosPaying,
                },
            });
        }),

    updateMortgagePreQualified: publicProcedure
        .input(
            z.object({
                email: z.string(),
                mortgagePreQualified: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, mortgagePreQualified } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                mortgagePreQualified,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    mortgage_pre_qualified: mortgagePreQualified,
                },
            });
        }),

    updateHomePurchaseType: publicProcedure
        .input(
            z.object({
                email: z.string(),
                homePurchaseType: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, homePurchaseType } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                homePurchaseType,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    home_purchase_type: homePurchaseType,
                },
            });
        }),

    updateWantsHelpFinancing: publicProcedure
        .input(
            z.object({
                email: z.string(),
                wantsHelpFinancing: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, wantsHelpFinancing } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                wantsHelpFinancing,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    wants_help_financing: wantsHelpFinancing,
                },
            });
        }),

    updateNecessityOrAmenity: publicProcedure
        .input(
            z.object({
                email: z.string(),
                necessityOrAmenity: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, necessityOrAmenity } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                necessityOrAmenity,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    necessity_or_amenity: necessityOrAmenity,
                },
            });
        }),

    updateCommunityScore: publicProcedure
        .input(
            z.object({
                email: z.string(),
                communityScore: z.number(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, communityScore } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                communityScore,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    community_score: communityScore,
                },
            });
        }),

    updateRelevance: publicProcedure
        .input(
            z.object({
                email: z.string(),
                relevance: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, relevance } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                relevance,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    relevance: relevance.join(','),
                },
            });
        }),

    updateKnowOMA: publicProcedure
        .input(
            z.object({
                email: z.string(),
                knowOMA: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, knowOMA } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                knowOMA,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    know_oma: knowOMA,
                },
            });
        }),

    updateInterestInHomeSwapping: publicProcedure
        .input(
            z.object({
                email: z.string(),
                interestInHomeSwapping: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, interestInHomeSwapping } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                interestInHomeSwapping,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    interest_in_home_swapping: interestInHomeSwapping,
                },
            });
        }),

    updateInterestInFurniture: publicProcedure
        .input(
            z.object({
                email: z.string(),
                interestInFurniture: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, interestInFurniture } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                interestInFurniture,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    interest_in_furniture: interestInFurniture,
                },
            });
        }),

    updateHomeType: publicProcedure
        .input(
            z.object({
                email: z.string(),
                homeType: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, homeType } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                homeType,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    home_type__1_: homeType,
                },
            });
        }),

    updateLookingForUnitType: publicProcedure
        .input(
            z.object({
                email: z.string(),
                lookingForUnitType: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, lookingForUnitType } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                lookingForUnitType,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    looking_for_unit_type: lookingForUnitType,
                },
            });
        }),

    updateMaxBudget: publicProcedure
        .input(
            z.object({
                email: z.string(),
                maxBudget: z.number().nullable().optional(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, maxBudget } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                maxBudget: maxBudget || null,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    max_budget: maxBudget,
                },
            });
        }),

    updateBuyingTimeline: publicProcedure
        .input(
            z.object({
                email: z.string(),
                buyingTimeline: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, buyingTimeline } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                buyingTimeline,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    buying_timeline__1_: buyingTimeline.join(','),
                },
            });
        }),

    updateTravelForWork: publicProcedure
        .input(
            z.object({
                email: z.string(),
                travelForWork: z.boolean().nullable(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, travelForWork } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                travelForWork,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    travel_for_work: travelForWork,
                },
            });
        }),

    updateTravelFrequency: publicProcedure
        .input(
            z.object({
                email: z.string(),
                travelFrequency: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, travelFrequency } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                travelFrequency,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    travel_frequency: travelFrequency,
                },
            });
        }),

    updateFamilyAbroad: publicProcedure
        .input(
            z.object({
                email: z.string(),
                familyAbroad: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, familyAbroad } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                familyAbroad,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    family_abroad: familyAbroad,
                },
            });
        }),

    updateFrequentedCities: publicProcedure
        .input(
            z.object({
                email: z.string(),
                frequentedCities: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, frequentedCities } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                frequentedCities,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    frequented_cities: frequentedCities,
                },
            });
        }),

    updateDesiredCities: publicProcedure
        .input(
            z.object({
                email: z.string(),
                desiredCities: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, desiredCities } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                desiredCities,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    desired_cities: desiredCities,
                },
            });
        }),

    updateOtherCities: publicProcedure
        .input(
            z.object({
                email: z.string(),
                otherCities: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, otherCities } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                otherCities,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    other_cities: otherCities,
                },
            });
        }),

    updateRelevantProperty: publicProcedure
        .input(
            z.object({
                email: z.string(),
                relevantProperty: z.array(z.string()),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, relevantProperty } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                relevantProperty,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    relevant_property: relevantProperty.join(','),
                },
            });
        }),

    updateCurrentLivingSituation: publicProcedure
        .input(
            z.object({
                email: z.string(),
                currentLivingSituation: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, currentLivingSituation } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                currentLivingSituation,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    current_living_situation: currentLivingSituation,
                },
            });
        }),

    updateCurrentlyLivingIn: publicProcedure
        .input(
            z.object({
                email: z.string(),
                currentlyLivingIn: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, currentlyLivingIn } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                currentlyLivingIn,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    currently_living_in: currentlyLivingIn,
                },
            });
        }),

    updateLookingForCity: publicProcedure
        .input(
            z.object({
                email: z.string(),
                lookingForCity: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, lookingForCity } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                lookingForCity,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    looking_for_city: lookingForCity,
                },
            });
        }),

    updateLookingForNeighborhood: publicProcedure
        .input(
            z.object({
                email: z.string(),
                lookingForNeighborhood: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, lookingForNeighborhood } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                lookingForNeighborhood,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    looking_for_neighborhoold: lookingForNeighborhood,
                },
            });
        }),

    updatePersonalNotes: publicProcedure
        .input(
            z.object({
                email: z.string(),
                personalNotes: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, personalNotes } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                personalNotes,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    personal_notes: personalNotes,
                },
            });
        }),

    updateCommunityFit: publicProcedure
        .input(
            z.object({
                email: z.string(),
                communityFit: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, communityFit } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                communityFit,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    community_fit: communityFit,
                },
            });
        }),

    updateEyeCatchingNote: publicProcedure
        .input(
            z.object({
                email: z.string(),
                eyeCatchingNote: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const { email, eyeCatchingNote } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                eyeCatchingNote,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    eye_catching_notes: eyeCatchingNote,
                },
            });
        }),

    updateHowTheyFoundHome0001: publicProcedure
        .input(
            z.object({
                email: z.string(),
                howTheyFoundHome0001: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, howTheyFoundHome0001 } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                howTheyFoundHome0001,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    how_they_found_home0001: howTheyFoundHome0001,
                },
            });
        }),

    updateWhatSparkInterest: publicProcedure
        .input(
            z.object({
                email: z.string(),
                whatSparkInterest: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, whatSparkInterest } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                whatSparkInterest,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    what_spark_interest: whatSparkInterest,
                },
            });
        }),

    updateWhatTheyLikeAboutApartments: publicProcedure
        .input(
            z.object({
                email: z.string(),
                whatTheyLikeAboutApartments: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, whatTheyLikeAboutApartments } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                whatTheyLikeAboutApartments,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    what_they_like_about_apartments: whatTheyLikeAboutApartments,
                },
            });
        }),

    updateWhatTheyDontLikeAboutApartments: publicProcedure
        .input(
            z.object({
                email: z.string(),
                whatTheyDontLikeAboutApartments: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, whatTheyDontLikeAboutApartments } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                whatTheyDontLikeAboutApartments,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    what_they_don_t_like_about_apartments: whatTheyDontLikeAboutApartments,
                },
            });
        }),

    updateAdditionalNotes: publicProcedure
        .input(
            z.object({
                email: z.string(),
                additionalNotes: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, additionalNotes } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                additionalNotes,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    additional_notes: additionalNotes,
                },
            });
        }),

    updateOMANotes: publicProcedure
        .input(
            z.object({
                email: z.string(),
                OMANotes: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, OMANotes } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                OMANotes,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    oma_notes: OMANotes,
                },
            });
        }),

    updateBio: publicProcedure
        .input(
            z.object({
                email: z.string(),
                bio: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, bio } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                bio,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    bio,
                },
            });
        }),

    updateFunnelType: publicProcedure
        .input(
            z.object({
                email: z.string(),
                funnelType: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, funnelType } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                funnelType,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    funnel_type: funnelType,
                },
            });
        }),

    updateInterestInFurnitureNotes: publicProcedure
        .input(
            z.object({
                email: z.string(),
                interestInFurnitureNotes: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, interestInFurnitureNotes } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                interestInFurnitureNotes,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    interest_in_furniture_notes: interestInFurnitureNotes,
                },
            });
        }),

    updateInterestInHomeSwappingNotes: publicProcedure
        .input(
            z.object({
                email: z.string(),
                interestInHomeSwappingNotes: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, interestInHomeSwappingNotes } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                interestInHomeSwappingNotes,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    interest_in_home_swapping_notes: interestInHomeSwappingNotes,
                },
            });
        }),

    updateOtherNeighborhoods: publicProcedure
        .input(
            z.object({
                email: z.string(),
                otherNeighborhoods: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, otherNeighborhoods } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                otherNeighborhoods,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    other_neighborhoods: otherNeighborhoods,
                },
            });
        }),

    updateRealBuyerTimeline: publicProcedure
        .input(
            z.object({
                email: z.string(),
                realBuyerTimeline: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, realBuyerTimeline } = input;

            const userRef = collection(db, 'potentialCustomers');
            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];
            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                realBuyerTimeline,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    real_buyer_timeline: realBuyerTimeline,
                },
            });
        }),

    updateGender: publicProcedure
        .input(
            z.object({
                email: z.string(),
                gender: z.string(),
            }),
        )
        .mutation(async ({ input }) => {
            const { email, gender } = input;

            const userRef = collection(db, 'potentialCustomers');

            const querySnapshot = await getDocs(query(userRef, where('email', '==', email)));

            if (querySnapshot.empty) {
                throw new Error('User not found');
            }

            const doc = querySnapshot.docs[0];

            // @ts-expect-error TODO: fix this
            await updateDoc(doc.ref, {
                gender,
            });

            await axios.post(`${API_URL}/hubspot/update-contact-properties?email=${email}`, {
                properties: {
                    gender__1_: gender,
                },
            });
        }),
});