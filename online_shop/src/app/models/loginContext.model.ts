export interface LoginContextProps {
    isLoggedIn: boolean;
    isAdmin: boolean;
    name: string | null;
    login: (values: LoginFormValues) => void;
    logout: () => void;
    register: (values: RegisterValues) => void;
}

export interface RegisterValues {
    name: string;
    password: string;
}

export interface LoginFormValues {
    email: string;
    password: string;
  }

export interface LoginContextProviderProps {
    children: React.ReactNode;
}