'use client'
import React, { FC } from 'react';
import { LoginContextProvider } from '../contexts/LoginContext';
import { LoginComponent } from './LoginComponent';
import './LoginStyle.scss';
import { DarkModeProvider } from '../contexts/DarkModeContext';


const app: FC = () => {

  return (
    <DarkModeProvider>
    <LoginContextProvider>
      <LoginComponent />
    </LoginContextProvider>
    </DarkModeProvider>
  );
};

export default app;