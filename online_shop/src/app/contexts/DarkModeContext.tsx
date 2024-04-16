'use client'
import React, { createContext, useState, useLayoutEffect } from 'react';
import { DarkModeContextType, DarkModeProviderProps } from '../models/darkModeContext.model';


export const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const DarkModeProvider: React.FC<DarkModeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useLayoutEffect(() => {
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
        try {
            const storedLoginState = localStorage.getItem('isDarkMode');
            setIsDarkMode(storedLoginState ? JSON.parse(storedLoginState) : false);


        } catch (error) {
            console.error('Error parsing localStorage data:', error);
        }
    }
}, []);


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
  };

  const contextValue: DarkModeContextType = {
    isDarkMode,
    toggleDarkMode,
  };

  return (
    <DarkModeContext.Provider value={contextValue}>
      {children}
    </DarkModeContext.Provider>
  );
};
