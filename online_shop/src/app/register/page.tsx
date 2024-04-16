'use client'
import React, { FC, useContext } from 'react';
import { LoginContextProvider } from '../contexts/LoginContext';
import { RegisterComponent } from './RegisterComponent';
import '../login/LoginStyle.scss';
import { DarkModeProvider } from '../contexts/DarkModeContext';


const app: FC = () => {

  return (
    <LoginContextProvider>
      <DarkModeProvider>
        <RegisterComponent />
      </DarkModeProvider>
    </LoginContextProvider>
  );
};

export default app;