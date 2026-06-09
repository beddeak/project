import { createContext,useState } from "react";

type Role = "admin" | "user";

type user = {
    id:number;
    name:string;
    role:Role;
}

type AuthContextType = {
    user: user | null;
    login: (username:string,password:string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthContextProvider({children}: {children: React.ReactNode}) {
    const [user, setUser] = useState<user | null>(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    })

    const login = async (username:string,password:string) => {
        const respone = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });
        if (!respone.ok) {
            return false;
        }
        const loginUser = await respone.json()

        setUser(loginUser);
        localStorage.setItem("user", JSON.stringify(loginUser));

        return true;
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    }

    return  (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
