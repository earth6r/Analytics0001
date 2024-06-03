import signIn from "@/utils/firebase/signin";
import { FirebaseError } from "firebase/app";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
    maxDuration: 300,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }

    const whitelistEmail = [
        "apinanapinan@icloud.com",
        "yan@earth.net",
    ];

    try {
        const user = await signIn(email, password);
        res.status(200).json({ user, request_password: false });
    } catch (error: unknown) {

        if (!(error instanceof FirebaseError)) {
            res.status(500).json({ user: null, message: "Internal server error.", request_password: false });
            return;
        }

        if (error.code !== "auth/wrong-password") {
            if (whitelistEmail.includes(email)) {
                res.status(200).json({ user: { email }, request_password: true });
                return;
            }
        }

        if (error.code === "auth/user-not-found") {
            res.status(401).json({ user: null, message: "User not found.", request_password: false });
            return;
        }

        if (error.code === "auth/wrong-password") {
            res.status(401).json({ user: null, message: "Wrong password.", request_password: false });
            return;
        }

        if (error.code === "auth/too-many-requests") {
            res.status(429).json({ user: null, message: "Too many requests. Try again later.", request_password: false });
            return;
        }

        res.status(500).json({ user: null, message: "Internal server error.", request_password: false });
    }
};

export default handler;
