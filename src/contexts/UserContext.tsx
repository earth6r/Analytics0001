import { api } from "@/utils/api";
import React, {
    createContext,
    useState,
    useContext,
    type ReactNode,
    useEffect,
} from "react";

interface UserContextProps {
    email: string | null;
    setEmail: (email: string | null) => void;
    profilePictureUrl: string | null;
    refetchProfilePictureUrl: () => Promise<any>;
}

const UserContext = createContext<UserContextProps | undefined>(
    undefined,
);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [email, _setEmail] = useState<string | null>(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);

    const getUserProfilePicture = api.userSettings.getUserProfilePicture.useQuery({
        email: email as string,
    }, {
        enabled: !!email,
    });

    // use effect for profile picture
    useEffect(() => {
        if (getUserProfilePicture.isSuccess) {
            const profilePicture = getUserProfilePicture.data;
            if (profilePicture) {
                setProfilePictureUrl(profilePicture);
            }
        }
    }, [email, getUserProfilePicture.data, getUserProfilePicture.isSuccess, profilePictureUrl]);

    // use effect for storing email from local storage
    useEffect(() => {
        const email = localStorage.getItem("email");
        if (email) {
            _setEmail(email);
        }
    }, []);

    const setEmail = (email: string | null) => {
        if (email) {
            localStorage.setItem("email", email);
        }

        _setEmail(email);
    };

    return (
        <UserContext.Provider
            value={{
                email,
                setEmail,
                profilePictureUrl,
                refetchProfilePictureUrl: getUserProfilePicture.refetch,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

const useUser = (): UserContextProps => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within an UserProvider");
    }
    return context;
};

export { UserProvider, useUser };
