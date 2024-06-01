import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
} from "react";

export type Interval = number | false;

interface IntervalContextProps {
  interval: Interval;
  setInterval: React.Dispatch<React.SetStateAction<Interval>>;
  setIntervalWithLocalStorage: (value: Interval) => void;
}

const IntervalContext = createContext<IntervalContextProps | undefined>(
  undefined,
);

const IntervalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interval, setInterval] = useState<number | false>(false);

  useEffect(() => {
    const interval = localStorage.getItem("interval");
    if (interval) {
      setInterval(parseInt(interval) * 1000);
    }
  }, []);

  const setIntervalWithLocalStorage = (value: Interval) => {
    if (value) {
      localStorage.setItem("interval", (value * 1000).toString());
      setInterval(value);
    } else {
      localStorage.removeItem("interval");
      setInterval(false);
    }
  };

  return (
    <IntervalContext.Provider
      value={{ interval, setInterval, setIntervalWithLocalStorage }}
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
