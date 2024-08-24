import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs, query, where } from "firebase/firestore/lite";
import { z } from "zod";

function getPropertyValue(registers: any, property: string) {
    const register = registers.find((register: any) => register?.[property] !== undefined && register?.[property] !== null && register?.[property] !== "");
    return register ? register[property] : undefined;
}

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

            const _else = getPropertyValue(registers, "Else");
            const adSet = getPropertyValue(registers, "adSet");
            const bedroomPreference = getPropertyValue(registers, "bedroomPreference")?.length > 0 ? getPropertyValue(registers, "bedroomPreference") : undefined;
            const buyingTimelinedec2023 = getPropertyValue(registers, "buyingTimelinedec2023");
            const campaign = getPropertyValue(registers, "campaign");
            const city = getPropertyValue(registers, "city");
            const content = getPropertyValue(registers, "content");
            const createdAt = getPropertyValue(registers, "createdAt");
            const email = getPropertyValue(registers, "email");
            const firstName = getPropertyValue(registers, "firstName");
            const fullQuery = getPropertyValue(registers, "fullQuery");
            const hutk = getPropertyValue(registers, "hutk");
            const lastName = getPropertyValue(registers, "lastName");
            const locationsOfInterest = getPropertyValue(registers, "locationsOfInterest");
            const medium = getPropertyValue(registers, "medium");
            const page = getPropertyValue(registers, "page");
            const routes = getPropertyValue(registers, "routes");
            const source = getPropertyValue(registers, "source");
            const userAgent = getPropertyValue(registers, "userAgent");

            const data = {
                "Else": _else ? _else["Else"] : null,
                "adSet": adSet || null,
                "bedroomPreference": bedroomPreference || null,
                "buyingTimelinedec2023": buyingTimelinedec2023 || null,
                "campaign": campaign || null,
                "city": city || null,
                "content": content || null,
                "createdAt": createdAt || null,
                "email": email || null,
                "firstName": firstName || null,
                "fullQuery": fullQuery || null,
                "hutk": hutk || null,
                "ipAddress": registers[0]?.ipAddress || null,
                "lastName": lastName || null,
                "locationsOfInterest": locationsOfInterest || null,
                "medium": medium || null,
                "page": page || null,
                "routes": routes || null,
                "source": source || null,
                "userAgent": userAgent || null,
            };

            return {
                data,
                count: registers.length,
            }
        }),

    getRegisterCount: publicProcedure
        .input(
            z.object({
                startDate: z.date(),
                endDate: z.date(),
            }),
        )
        .query(async ({ input }) => {
            const registerRef = collection(db, "register");
            const register = await getDocs(query(registerRef, where("createdAt", ">=", input.startDate.getTime().toString()), where("createdAt", "<=", input.endDate.getTime().toString())));

            return register.size;
        }),
});
