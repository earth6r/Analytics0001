import admin from 'firebase-admin';import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
    maxDuration: 300,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string);

    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: process.env.PROJECT_ID,
        });
    }

    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ message: "Email is required.", code: "email_required" });
        return;
    }

    if (!password) {
        res.status(400).json({ message: "Password is required.", code: "password_required" });
        return;
    }

    try {
        // create a new user
        const response = await admin.auth().createUser({
            email,
            password,
        });
        await admin.database().ref('users').push({
            email,
            uid: response.uid,

            // epoch
            createdAt: parseInt(String(Date.now() / 1000)),
        });
        res.status(200).json({ user: response, code: "success" });
    } catch (error: unknown) {
        // @ts-expect-error error is unknown
        if (error?.code === "auth/too-many-requests") {
            res.status(429).json({ user: null, message: "Too many requests.", code: "too_many_requests" });
            return;
        }

        res.status(500).json({ user: null, message: "Internal server error.", code: "internal_server_error" });
    }
};

export default handler;
