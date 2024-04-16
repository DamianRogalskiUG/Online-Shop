'use client'
import  React, { FC, useContext } from 'react'
import { MainProductsList } from './MainProductsList'
import './MainComponentsStyle.scss'
import { DarkModeContext } from 'src/app/contexts/DarkModeContext'



export const MainComponent: FC = () => {
  const { isDarkMode } = useContext(DarkModeContext)!;
  return (
    <div className={`MainComponentContainer ${isDarkMode ? 'darkMode' : 'lightMode'}`}>
        <MainProductsList />
    </div>
  )
}
