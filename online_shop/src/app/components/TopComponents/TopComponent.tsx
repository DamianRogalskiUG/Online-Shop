'use client'
import React, { FC, useContext } from 'react';
import { SearchBarComponent } from './SearchBar';
import { LogoComponent } from './Logo';
import { TopRightButtonsComponent } from './TopRightButtons';
import { ProductListContext } from 'src/app/contexts/ProductListContext';
import './TopComponentsStyle.scss';
import { DarkModeContext } from 'src/app/contexts/DarkModeContext'
import { SelectedProductContext } from 'src/app/contexts/SelectedProductContext';

export const TopComponent: FC = () => {
  const { setProductList } = useContext(ProductListContext)!;
  const { isDarkMode } = useContext(DarkModeContext)!;
  const { setSelectedProduct } = useContext(SelectedProductContext)!;
  const handleButton = (type: string) => {
    setProductList(type);
    setSelectedProduct(null);  
  }

  return (
    <>
    <div className={`TopComponentContainer ${isDarkMode ? 'darkMode' : 'lightMode'}`}>
      <div className='row1'>
        <LogoComponent />
        <SearchBarComponent />
        <TopRightButtonsComponent />
      </div>
      <div className='row2'>
          <button onClick={(): void => handleButton('phone')}><i className="gg-smartphone"></i><span>Smartphones</span></button>
          <button onClick={(): void => handleButton('laptop')}><i className="gg-laptop"></i><span>Laptops</span></button>
          <button onClick={(): void => handleButton('pc')}><i className="gg-screen"></i><span>PC</span></button>
          <button onClick={(): void => handleButton('tv')}><i className="gg-tv"></i><span>TV</span></button>
          <button onClick={(): void => handleButton('audio')}><i className="gg-music-speaker"></i><span>Audio</span></button>
          <button onClick={(): void => handleButton('peripheral')}><i className="gg-mouse"></i><span>Peripherals</span></button>
      </div>
    </div>
    </>
  );
};