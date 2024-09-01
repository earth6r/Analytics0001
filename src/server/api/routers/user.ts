import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { z } from "zod";
import admin from 'firebase-admin';
import { put } from '@vercel/blob';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { db } from "@/utils/firebase/initialize";

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
                    const { nextStepsDropdownValue, deferredDate, nextStepsNotes } = data;

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

                    nextSteps.push({
                        email: data.email,
                        firstName,
                        lastName,
                        nextStepsDropdownValue,
                        deferredDate,
                        nextStepsNotes,
                    });
                }
            }

            return nextSteps;
        }),
});