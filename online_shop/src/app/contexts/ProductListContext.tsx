'use client'
import React, { useState, createContext, FC, ReactNode } from 'react';
import { ProductListContextProps, ProductListProviderProps } from '../models/productListContext.model';


export const ProductListContext = createContext<ProductListContextProps>({
    productList: null,
    setProductList: () => {},
});

export const ProductListProvider: FC<ProductListProviderProps> = ({ children }) => {
    const [productList, setProductList] = useState<string | null>(null);

    return (
        <ProductListContext.Provider value={{ productList, setProductList }}>
            {children}
        </ProductListContext.Provider>
    );
};

