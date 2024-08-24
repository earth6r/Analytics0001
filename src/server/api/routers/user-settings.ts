import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { Statuses } from "@/utils/status";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { z } from "zod";

const generateDefaultSettings = async (email: string) => {
    const userSettingsRef = collection(db, "userSettings");
    const response = await addDoc(userSettingsRef, {
        email,
        profilePictureUrl: "",
        name: "",
        theme: "system", // light, dark, system
        color: "default", // default, red, green, blue, orange
        notifications: true,
        interval: null,
        statusFilters: Statuses,
    });

    // return the docRef
    return response;
}

export const userSettingsRouter = createTRPCRouter({
    updateUserProfilePicture: publicProcedure
        .input(z.object({ url: z.string(), email: z.string() }))
        .mutation(async ({ input }) => {
            const url = input.url;
            const email = input.email;

            const userSettingsRef = collection(db, "userSettings");
            const q = query(userSettingsRef, where("email", "==", email));
            const querySnapshot: any = await getDocs(q);

            let docRef = null;
            if (querySnapshot.empty) {
                // create new userSettings
                docRef = await generateDefaultSettings(email);
            } else {
                docRef = querySnapshot.docs[0].ref;
            }

            await updateDoc(docRef, {
                profilePictureUrl: url,
            });
        }),

    getUserProfilePicture: publicProcedure
        .input(
            z.object({
                email: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const { email } = input;

            const userSettingsRef = collection(db, "userSettings");
            const q = query(userSettingsRef, where("email", "==", email));
            const querySnapshot: any = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return doc.data().profilePictureUrl;
        }),

    getUserSettings: publicProcedure
        .input(z.object({ email: z.string() }))
        .query(async ({ input }) => {
            const { email } = input;

            const userSettingsRef = collection(db, "userSettings");
            const q = query(userSettingsRef, where("email", "==", email));
            const querySnapshot: any = await getDocs(q);

            if (querySnapshot.empty) {
                return null;
            }

            const doc = querySnapshot.docs[0];
            return doc.data();
        }),

    updateUserBookingStatusFilters: publicProcedure
        .input(z.object({ email: z.string(), statusFilters: z.array(z.string()) }))
        .mutation(async ({ input }) => {
            const { email, statusFilters } = input;

            const userSettingsRef = collection(db, "userSettings");
            const q = query(userSettingsRef, where("email", "==", email));
            const querySnapshot: any = await getDocs(q);

            let docRef = null;
            if (querySnapshot.empty) {
                // create new userSettings
                docRef = await generateDefaultSettings(email);
            } else {
                docRef = querySnapshot.docs[0].ref;
            }

            await updateDoc(docRef, {
                statusFilters,
            });
        }),
});
