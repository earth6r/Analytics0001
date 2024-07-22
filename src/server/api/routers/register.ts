import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { z } from "zod";

export const registerRouter = createTRPCRouter({
    getRegisterDetails: publicProcedure
        .input(
            z.object({
                email: z.string(),
            }),
        )
        .query(async ({ input }) => {
            const registerRef = collection(db, "register");
            const register = await getDocs(query(registerRef, where("email", "==", input.email)));

            if (register.empty || register.docs.length === 0) {
                return null;
            }

            const registers = register.docs.map((doc) => doc.data());

            // sort by createdAt desc
            registers.sort((a, b) => {
                return b.createdAt - a.createdAt;
            });

            return registers;
        }),
});
