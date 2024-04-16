export interface SelectedTitleContextProps {
    selectedTitle: string | null;
    setSelectedTitle: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface SelectedTitleProviderProps {
    children: React.ReactNode;
}