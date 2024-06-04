import admin from 'firebase-admin';
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
    maxDuration: 300,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string);

    if (!admin.apps.length)
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: "homeearthnet",
        });

    const { email } = req.body;

    if (!email) {
        res.status(400).json({ message: "Email is required.", request_password: false, code: "email_required" });
        return;
    }

    const whitelistEmail = [
        "apinanapinan@icloud.com",
        "yan@earth.net",
    ];

    try {
        const user = await admin.auth().getUserByEmail(email);
        res.status(200).json({ user, request_password: false, code: "success" });
    } catch (error: unknown) {
        if (error?.code === "auth/user-not-found") {
            res.status(400).json({ user: null, message: "Wrong password.", request_password: false, code: "wrong_password" });
            return;
        }

        if (error?.code === "auth/too-many-requests") {
            res.status(429).json({ user: null, message: "Too many requests.", request_password: false, code: "too_many_requests" });
            return;
        }

        res.status(500).json({ user: null, message: "Internal server error.", request_password: false, code: "internal_server_error" });
    }
};

export default handler;
