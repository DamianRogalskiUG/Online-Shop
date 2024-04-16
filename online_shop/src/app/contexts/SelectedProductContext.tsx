'use client'
import React, { FC, createContext, useState } from 'react';
import { SelectedProductContextProps, Product, SelectedProductProviderProps } from '../models/selectedProductContext.model';


export const SelectedProductContext = createContext<SelectedProductContextProps>({
  selectedProduct: null,
  setSelectedProduct: () => {},
});


export const SelectedProductProvider: FC<SelectedProductProviderProps> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState< Product | null>(null);

  return (
    <SelectedProductContext.Provider value={{ selectedProduct, setSelectedProduct }}>
      {children}
    </SelectedProductContext.Provider>
  );
};
