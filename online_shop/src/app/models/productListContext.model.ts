export interface ProductListContextProps {
    productList: string | null;
    setProductList: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ProductListProviderProps {
    children: React.ReactNode;
}