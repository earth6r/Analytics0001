import signIn from "@/utils/firebase/signin";
import { FirebaseError } from "firebase/app";
import { type NextApiRequest, type NextApiResponse } from "next";

export const config = {
    maxDuration: 300,
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;

    if (!email) {
        res.status(400).json({ message: "Email and password are required.", request_password: false, code: "email_password_required"});
        return;
    }

    const whitelistEmail = [
        "apinanapinan@icloud.com",
        "yan@earth.net",
    ];

    if (!password) {
        if (whitelistEmail.includes(email)) {
            res.status(200).json({ user: { email }, request_password: true, code: "setup_password" });
            return;
        }
        res.status(400).json({ message: "Email and password are required.", request_password: false, code: "email_password_required"});
        return;
    }

    try {
        const user = await signIn(email, password);
        res.status(200).json({ user, request_password: false, code: "success"});
    } catch (error: unknown) {

        if (!(error instanceof FirebaseError)) {
            res.status(500).json({ user: null, message: "Internal server error.", request_password: false, code: "internal_server_error" });
            return;
        }

        if (error.code === "auth/wrong-password") {
            res.status(400).json({ user: null, message: "Wrong password.", request_password: false, code: "wrong_password"});
            return;
        }

        if (error.code === "auth/too-many-requests") {
            res.status(429).json({ user: null, message: "Too many requests.", request_password: false, code: "too_many_requests"});
            return;
        }

        res.status(500).json({ user: null, message: "Internal server error.", request_password: false, code: "internal_server_error"});
    }
};

export default handler;
