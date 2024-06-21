import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs, query, updateDoc, where } from "firebase/firestore/lite";
import { z } from "zod";

// TODO: move to utils
export const buyingProgressStepNumberToLabel = {
    1: "escrow-deposit",
    2: "schedule-closing",
    3: "download-documents",
    4: "full-payment",
    5: "completed",
};

export const customerRouter = createTRPCRouter({
    getBuyingProgressBarChart: publicProcedure
        .query(async () => {
            const customers = await getDocs(collection(db, "users"));
            const customerUIDs = customers.docs.map((doc) => doc.id);

            const usersBuyingProgressRef = collection(db, "usersBuyingProgress");
            const q = query(usersBuyingProgressRef);
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map((doc) => doc.data());

            for (const item of data) {
                const customerUID = item.userUID;
                if (customerUIDs.includes(customerUID)) {
                    customerUIDs.splice(customerUIDs.indexOf(customerUID), 1);
                }
            }

            const stepsData = {
                1: customerUIDs.length,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };

            data.forEach((item) => {
                if (item.completed) {
                    stepsData[5] += 1;
                } else if (item.fullPayment) {
                    stepsData[4] += 1;
                } else if (item.downloadDocuments) {
                    stepsData[3] += 1;
                } else if (item.scheduleClosing) {
                    stepsData[2] += 1;
                } else if (item.escrowDeposit) {
                    stepsData[1] += 1;
                } else {
                    stepsData[1] += 1;
                }
            });

            return Object.entries(stepsData).map(([key, value]) => ({
                // @ts-expect-error - fix this
                name: buyingProgressStepNumberToLabel[key],
                total: value,
            }));
        }),

    getBuyingProgressPieChart: publicProcedure
        .query(async () => {
            const customers = await getDocs(collection(db, "users"));
            const customerUIDs = customers.docs.map((doc) => doc.id);

            const usersBuyingProgressRef = collection(db, "usersBuyingProgress");
            const q = query(usersBuyingProgressRef);
            const querySnapshot = await getDocs(q);

            const data = querySnapshot.docs.map((doc) => doc.data());

            for (const item of data) {
                const customerUID = item.userUID;
                if (customerUIDs.includes(customerUID)) {
                    customerUIDs.splice(customerUIDs.indexOf(customerUID), 1);
                }
            }

            const stepsData = {
                1: customerUIDs.length,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
            };

            data.forEach((item) => {
                if (item.completed) {
                    stepsData[5] += 1;
                } else if (item.fullPayment) {
                    stepsData[4] += 1;
                } else if (item.downloadDocuments) {
                    stepsData[3] += 1;
                } else if (item.scheduleClosing) {
                    stepsData[2] += 1;
                } else if (item.escrowDeposit) {
                    stepsData[1] += 1;
                } else {
                    stepsData[1] += 1;
                }
            });

            return Object.entries(stepsData).map(([key, value]) => ({
                // @ts-expect-error - fix this
                [buyingProgressStepNumberToLabel[key]]: value,
            }));
        }),

    archiveCustomer: publicProcedure
        .input(
            z.object({
                email: z.string(),
            })
        )
        .mutation(async ({ input }) => {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", input.email));

            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                if (!doc) {
                    return;
                }
                await updateDoc(
                    doc.ref,
                {
                    archived: true,
                });
            }
        }),
});
