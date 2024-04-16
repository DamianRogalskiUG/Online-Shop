import React, { createContext, useState } from 'react';
import { ShoppingCartContextProps, ShoppingCartProviderProps } from '../models/shoppingCartContext.model';

export const ShoppingCartContext = createContext<ShoppingCartContextProps>({
  isCartOpen: false,
  openCart: () => {},
  closeCart: () => {},
});

export const ShoppingCartProvider: React.FC<ShoppingCartProviderProps> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <ShoppingCartContext.Provider value={{ isCartOpen, openCart, closeCart }}>
      {children}
    </ShoppingCartContext.Provider>
  );
};
