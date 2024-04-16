export interface Product {
    _id: string;
    image: string;
    title: string;
    price: number;
    short_description: string;
    long_description: string;
    amount: number;
}

export interface SelectedProductContextProps {
    selectedProduct: Product | null;
    setSelectedProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

export interface SelectedProductProviderProps {
    children: React.ReactNode;
}