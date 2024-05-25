import React, { createContext, useState, useContext, type ReactNode } from 'react';

type Interval = number | false;

interface IntervalContextProps {
  interval: Interval;
  setInterval: React.Dispatch<React.SetStateAction<Interval>>;
}

const IntervalContext = createContext<IntervalContextProps | undefined>(undefined);

const IntervalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [interval, setInterval] = useState<number | false>(false);

  return (
    <IntervalContext.Provider value={{ interval, setInterval }}>
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
