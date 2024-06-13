import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./initialize";

const signIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
        );
        return userCredential.user;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
};

export default signIn;
