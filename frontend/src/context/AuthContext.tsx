import { createContext,useState } from "react";

type Role = "admin" | "user";

type user = {
    id:number;
    name:string;
    username?:string;
    email?:string;
    role:Role;
}

type LoginResponse = {
    accessToken: string;
    user: user;
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
        const data: LoginResponse = await respone.json()

        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("accessToken", data.accessToken);

        return true;
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
    }

    return  (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;
