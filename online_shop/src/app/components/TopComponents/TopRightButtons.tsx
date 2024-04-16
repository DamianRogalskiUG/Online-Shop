'use client'
import React, { FC, useContext, useState } from 'react'
import { DarkModeContext } from 'src/app/contexts/DarkModeContext'
import Link from 'next/link';
import { LoginContext } from 'src/app/contexts/LoginContext';
import { ShoppingCartContext } from 'src/app/contexts/ShoppingCartContext';
import { ProductListContext } from 'src/app/contexts/ProductListContext';
import { SelectedProductContext } from 'src/app/contexts/SelectedProductContext';


export const TopRightButtonsComponent: FC = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext)!;
  const { isLoggedIn, logout } = useContext(LoginContext);
  const { openCart } = useContext(ShoppingCartContext);
  const { setProductList } = useContext(ProductListContext);
  const { setSelectedProduct } = useContext(SelectedProductContext);
  
  const cartButton = () => {
    openCart();
    setProductList(null)
    setSelectedProduct(null)
  }

  return (
    <div 
      className={`TopRightButtons ${isDarkMode ? 'darkMode' : 'lightMode'}`}

    >
      <button onClick={toggleDarkMode}>{isDarkMode ? <i style={{ color: 'white' }} className="gg-sun"></i> : <i style={{ color: 'black' }} className="gg-sun"></i>}</button>
      <button onClick={cartButton}><i className="gg-shopping-cart"></i></button>
      {
        isLoggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
            <div>
            <Link href='/login'>Login</Link>
            <Link href='/register'>Register</Link>
            </div>
          )
        
      }
    </div>
  )
}
