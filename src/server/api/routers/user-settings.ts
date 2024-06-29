import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { addDoc, collection, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { z } from "zod";

export const userSettingsRouter = createTRPCRouter({
    updateUserProfilePicture: publicProcedure
        .input(z.object({ url: z.string(), email: z.string() }))
        .mutation(async ({ input }) => {
            const url = input.url;
            const email = input.email;

            const userSettingsRef = collection(db, "userSettings");
            const q = query(userSettingsRef, where("email", "==", email));
            const querySnapshot: any = await getDocs(q);

            if (querySnapshot.empty) {
                // create new userSettings
                await addDoc(userSettingsRef, {
                    email,
                    profilePictureUrl: url,
                    name: "",
                    theme: "system", // light, dark, system
                    color: "default", // default, red, green, blue, orange
                    notifications: true,
                    interval: null,
                })
            } else {
                // update existing userSettings
                const doc = querySnapshot.docs[0];
                await updateDoc(doc.ref, {
                    profilePictureUrl: url,
                });
            }
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
});
