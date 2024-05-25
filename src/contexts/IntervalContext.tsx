import React, { createContext, useState, useContext, type ReactNode } from 'react';

export type Interval = number | false;

interface IntervalContextProps {
  interval: Interval;
  setInterval: React.Dispatch<React.SetStateAction<Interval>>;
  setIntervalWithLocalStorage: (value: Interval) => void;
}

const IntervalContext = createContext<IntervalContextProps | undefined>(undefined);

const IntervalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interval, setInterval] = useState<number | false>(false);

  const setIntervalWithLocalStorage = (value: Interval) => {
    if (value) {
      localStorage.setItem('interval', value.toString());
      setInterval(value);
    } else {
      localStorage.removeItem('interval');
      setInterval(false);
    }
  };

  return (
    <IntervalContext.Provider value={{ interval, setInterval, setIntervalWithLocalStorage }}>
      {children}
    </IntervalContext.Provider>
  );
};

const useInterval = (): IntervalContextProps => {
  const context = useContext(IntervalContext);
  if (!context) {
    throw new Error('useInterval must be used within an IntervalProvider');
  }
  return context;
};

export { IntervalProvider, useInterval };
