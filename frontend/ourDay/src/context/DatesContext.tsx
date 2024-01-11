import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchDates } from '../utils/api';
import { IDate } from '../utils/types';

interface DatesContextProps {
  dates: IDate[];
  setDates: React.Dispatch<React.SetStateAction<IDate[]>>;
  isLoading: boolean;
}

interface DatesProviderProps {
  children: ReactNode;
}

const DatesContext = createContext<DatesContextProps | undefined>(undefined);

const DatesProvider: React.FC<DatesProviderProps> = ({ children }) => {
  const [dates, setDates] = useState<IDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datesFromAPI = await fetchDates();
        setDates(datesFromAPI);
      } catch (error) {
        console.error('Error fetching dates:', error);
      }
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <DatesContext.Provider value={{ dates, setDates, isLoading }}>
      {children}
    </DatesContext.Provider>
  );
};

const useDates = (): DatesContextProps => {
  const context = useContext(DatesContext);
  if (!context) {
    throw new Error('useDates must be used within a DatesProvider');
  }
  return context;
};

export { DatesProvider, useDates };