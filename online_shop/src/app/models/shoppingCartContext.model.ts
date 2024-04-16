export interface ShoppingCartContextProps {
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

export interface ShoppingCartProviderProps {
    children: React.ReactNode;
}
  