export type OrderContextType = {
    isOrdering: boolean;
    setOrdering: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface OrderContextProviderProps {
    children: React.ReactNode;
}