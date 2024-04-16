'use client'
import React, { FC, createContext, useState, useLayoutEffect } from 'react';
import axios from 'axios';
import { LoginContextProps, RegisterValues, LoginFormValues, LoginContextProviderProps } from '../models/loginContext.model';

export const LoginContext = createContext<LoginContextProps>({
    isLoggedIn: false,
    isAdmin: false,
    name: null,
    login: () => {},
    logout: () => {},
    register: () => {},
});

export const LoginContextProvider: FC<LoginContextProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [name, setName] = useState<string | null>(null); 

    useLayoutEffect(() => {
        const isBrowser = typeof window !== 'undefined';
    
        if (isBrowser) {
            try {
                const storedLoginState = localStorage.getItem('isLoggedIn');
                setIsLoggedIn(storedLoginState ? JSON.parse(storedLoginState) : false);
    
                const storedAdminState = localStorage.getItem('isAdmin');
                setIsAdmin(storedAdminState ? JSON.parse(storedAdminState) : false);
    
                const storedName = localStorage.getItem('name');
    
                if (storedName) {
                    const cleanedName = storedName.replace(/"/g, '');
                    setName(cleanedName);
                } else {
                    setName(null);
                }
            } catch (error) {
                console.error('Error parsing localStorage data:', error);
            }
        }
    }, []);
    


    const login = async (values: LoginFormValues) => {
        const response = await axios.post('http://localhost:4000/login', values);
        console.log(response.data)
        if (response.status === 200) {
            setIsLoggedIn(response.data.email);
            localStorage.setItem('isLoggedIn', JSON.stringify(response.data.email));
    
            setIsAdmin(response.data.isAdmin || false);
            localStorage.setItem('isAdmin', JSON.stringify(response.data.isAdmin || false));
        
            setName(response.data.name || null); 
            localStorage.setItem('name', JSON.stringify(response.data.name || null));
            
            const token = response.data.token;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        }
    };
    
    const register = async (values: RegisterValues) => {
        try {
            const response = await axios.post('http://localhost:4000/register', values);
            if (response.data) {
                setIsLoggedIn(response.data.email);
                localStorage.setItem('isLoggedIn', JSON.stringify(response.data.email));

                setName(values.name); 
                localStorage.setItem('name', JSON.stringify(values.name));

                const token = response.data.token;
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                localStorage.setItem('token', token);
            }
        } catch (error) {
            console.error(error);
        }
    };
    

    const logout = () => {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setName(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
    };


    return (
        <LoginContext.Provider value={{ isLoggedIn, isAdmin, name, login, logout, register }}>
            {children}
        </LoginContext.Provider>
    );
};