import React, { createContext, useState } from 'react';
import { OrderContextType, OrderContextProviderProps } from '../models/orderContext.model';


export const OrderContext = createContext<OrderContextType>({
    isOrdering: false,
    setOrdering: () => {},
});

const OrderContextProvider: React.FC<OrderContextProviderProps> = ({ children }) => {
    const [isOrdering, setOrdering] = useState(false);

    return (
        <OrderContext.Provider value={{ isOrdering, setOrdering }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContextProvider;
