export interface DarkModeContextType {
    isDarkMode: boolean | null;
    toggleDarkMode: () => void;
}

export interface DarkModeProviderProps {
    children: React.ReactNode;
}