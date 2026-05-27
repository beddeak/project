import { createContext,useState } from "react";

type Role = "admin" | "user";

type user = {
    id:number;
    name:string;
    role:Role;
}

type AuthContextType = {
    user: user | null;
    login: (id:number, name:string, role:Role) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthContextProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<user | null>(null)
    const login = (id:number, name:string, role:Role) => {
        setUser({id:id, name:name, role:role})
    }
    const logout = () => {
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
