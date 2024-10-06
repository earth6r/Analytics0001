import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { API_URL } from "./bookings";


export const sendgridRouter = createTRPCRouter({
    getDesigns: publicProcedure
        .query(async () => {
            const response = await fetch(`${API_URL}/sendgrid/get-templates`);
            return response.json();
        }),

    getDesign: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const response = await fetch(`${API_URL}/sendgrid/get-template-content?singleSendId=${input.id}`);
            return response.json();
        }),
});