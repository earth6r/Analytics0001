import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import axios from "axios";

export const emailRouter = createTRPCRouter({
    getStats: publicProcedure
        .query(async () => {
            const response = await axios.get("https://api.sendgrid.com/v3/stats?start_date=2024-06-12", {
                headers: {
                    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
                },
            });
            return response.data;
        }),
});
