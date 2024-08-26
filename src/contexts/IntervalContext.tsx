import { api } from "@/utils/api";
import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";
import { useUser } from "./UserContext";

export type Interval = number | false;

interface IntervalContextProps {
  interval: Interval;
  timezone: string;
}

const IntervalContext = createContext<IntervalContextProps | undefined>(
  undefined,
);

const IntervalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interval, setInterval] = useState<number | false>(false);
  const [timezone, setTimezone] = useState<string>("America/New_York");
  const { email } = useUser();

  useEffect(() => {
    // TODO: change this logic to be completely from useUser
    const authenticatedData = JSON.parse(
      localStorage.getItem("authenticated") ?? "{}",
    );
    if (
      !authenticatedData.authenticated ||
      authenticatedData.expires < new Date().getTime() ||
      !localStorage.getItem("email")
    ) {
      window.location.href = "/";
    }
  }, [email]);

  const userSettings = api.userSettings.getUserSettings.useQuery({
    email: email as string,
  }, {
    enabled: !!email,
  });

  useEffect(() => {
    if (userSettings.data) {
      setInterval(userSettings.data.interval ?? false);
      setTimezone(userSettings.data.timezone ?? "America/New_York");
    }
  }, [userSettings.data]);

  return (
    <IntervalContext.Provider
      value={{ interval, timezone }}
    >
      {children}
    </IntervalContext.Provider>
  );
};

const useInterval = (): IntervalContextProps => {
  const context = useContext(IntervalContext);
  if (!context) {
    throw new Error("useInterval must be used within an IntervalProvider");
  }
  return context;
};

export { IntervalProvider, useInterval };
