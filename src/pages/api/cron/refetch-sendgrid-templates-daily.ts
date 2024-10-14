import { db } from "@/utils/firebase/initialize";
import { type NextApiRequest, type NextApiResponse } from "next/types";
import axios from "axios";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "@firebase/firestore/lite";

const apiKey = process.env.SENDGRID_API_KEY;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const singleSendsUrl = `https://api.sendgrid.com/v3/marketing/singlesends`;
    const response = await axios.get(singleSendsUrl, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
        },
    });

    const singleSends = response.data.result;

    for (const singleSend of singleSends) {
        const singleSendDetailsUrl = `https://api.sendgrid.com/v3/marketing/singlesends/${singleSend.id}`;
        const singleSendResponse = await axios.get(singleSendDetailsUrl, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        const singleSendId = singleSendResponse.data.id;
        const { subject } = singleSendResponse.data.email_config;
        const htmlContent = singleSendResponse.data.email_config.html_content;
        const plainContent = singleSendResponse.data.email_config.plain_content;

        const emailMarketingTemplatesRef = collection(db, 'emailMarketingTemplates');
        const q = query(emailMarketingTemplatesRef, where('singleSendId', '==', singleSendId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            await addDoc(emailMarketingTemplatesRef, {
                singleSendId,
                subject,
                htmlContent,
                plainContent,
                createdAt: Math.floor(new Date().getTime() / 1000),
                updatedAt: Math.floor(new Date().getTime() / 1000),
            });
        } else {
            const docSnapshot = querySnapshot.docs[0];
            if (docSnapshot) {
                const docRef = doc(db, 'emailMarketingTemplates', docSnapshot.id);
                await updateDoc(docRef, {
                    singleSendId,
                    subject,
                    htmlContent,
                    plainContent,
                    updatedAt: Math.floor(new Date().getTime() / 1000),
                });
            }
        }
    }

    res.status(200).json({ message: "Cron job executed successfully" });
}