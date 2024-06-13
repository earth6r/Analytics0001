import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs, query } from "firebase/firestore/lite";

const buyingProgressStepNumberToLabel = {
    1: "escrow-deposit",
    2: "download-documents",
    3: "schedule-closing",
    4: "full-payment",
    5: "completed",
};

export const customerRouter = createTRPCRouter({
    getBuyingProgressBarChart: publicProcedure
        .query(async () => {
            const usersBuyingProgressRef = collection(db, "usersBuyingProgress");
            const q = query(usersBuyingProgressRef);
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map((doc) => doc.data());

            const stepsData = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };

            data.forEach((item) => {
                // @ts-expect-error - fix this
                stepsData[item.buyingProgress] += 1;
            });

            return Object.entries(stepsData).map(([key, value]) => ({
                // @ts-expect-error - fix this
                name: buyingProgressStepNumberToLabel[key],
                total: value,
            }));
        }),

    getBuyingProgressPieChart: publicProcedure
        .query(async () => {
            const usersBuyingProgressRef = collection(db, "usersBuyingProgress");
            const q = query(usersBuyingProgressRef);
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map((doc) => doc.data());

            const stepsData = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };

            data.forEach((item) => {
                // @ts-expect-error - fix this
                stepsData[item.buyingProgress] += 1;
            });

            return Object.entries(stepsData).map(([key, value]) => ({
                // @ts-expect-error - fix this
                [buyingProgressStepNumberToLabel[key]]: value,
            }));
        }),
});
