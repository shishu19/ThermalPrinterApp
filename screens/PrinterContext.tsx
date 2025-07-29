import React, { createContext, useContext, useState } from 'react';

interface PrinterContextType {
  macAddress: string;
  connected: boolean;
  setMacAddress: (mac: string) => void;
  setConnected: (val: boolean) => void;
}

const PrinterContext = createContext<PrinterContextType | null>(null);

export const PrinterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [macAddress, setMacAddress] = useState('');
  const [connected, setConnected] = useState(false);

  return (
    <PrinterContext.Provider value={{ macAddress, connected, setMacAddress, setConnected }}>
      {children}
    </PrinterContext.Provider>
  );
};

export const usePrinter = () => {
  const context = useContext(PrinterContext);
  if (!context) {
    throw new Error('usePrinter must be used within a PrinterProvider');
  }
  return context;
};
