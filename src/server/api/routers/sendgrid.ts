import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { API_URL } from "./bookings";
import { collection, type DocumentData, getDocs, query, where } from "firebase/firestore/lite";
import { db } from "@/utils/firebase/initialize";

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

    getMarketingEmailStats: publicProcedure
        .query(async () => {
            const emailMarketingTemplatesRef = collection(db, "emailMarketingTemplates");
            const querySnapshot = await getDocs(emailMarketingTemplatesRef);

            const emailMarketingTemplates: DocumentData[] = [];
            querySnapshot.forEach((doc) => {
                emailMarketingTemplates.push(doc.data());
            });

            const emailStats = [] as { singleSendId: string, opens: number, clicks: number, urls: string[], templateData: DocumentData, received: number }[];
            for (const emailMarketingTemplate of emailMarketingTemplates) {
                const { singleSendId } = emailMarketingTemplate;

                const emailsSentHistoryRef = collection(db, "emailsSentHistory");
                const q = query(emailsSentHistoryRef, where("singleSendId", "==", singleSendId));
                const querySnapshot = await getDocs(q);

                let received = 0;
                let opens = 0;
                let clicks = 0;
                const urls = new Set<string>();

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    opens += data.opened.length;
                    clicks += data.clickedUrls.length;
                    received += (data.delivered ? 1 : 0);


                    for (const url of data.clickedUrls) {
                        if (!url.url) {
                            continue;
                        }
                        urls.add(url.url);
                    }
                });

                emailStats.push({
                    singleSendId,
                    opens,
                    clicks,
                    urls: Array.from(urls),
                    received,
                    templateData: emailMarketingTemplate,
                });
            }

            return emailStats;
        }),
});
