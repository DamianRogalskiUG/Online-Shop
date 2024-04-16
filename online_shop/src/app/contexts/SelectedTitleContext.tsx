import React, { FC, createContext, useState } from 'react';
import { SelectedTitleContextProps, SelectedTitleProviderProps } from '../models/selectedTitleContext.model';


export const SelectedTitleContext = createContext<SelectedTitleContextProps>({
    selectedTitle: null,
    setSelectedTitle: () => {},
});

export const SelectedTitleProvider: FC<SelectedTitleProviderProps> = ({ children }) => {
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

    return (
        <SelectedTitleContext.Provider value={{ selectedTitle, setSelectedTitle }}>
            {children}
        </SelectedTitleContext.Provider>
    );
};
