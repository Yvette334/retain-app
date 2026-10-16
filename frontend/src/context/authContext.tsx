import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { apiRequest, TOKEN } from "../api/api"
import type { AuthResponse, User } from "../types"

interface AuthType{
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthType | undefined> (undefined)
export function AuthProvider({children}: {children: ReactNode}) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(Boolean(localStorage.getItem(TOKEN)))

    useEffect(() => {
        if (!localStorage.getItem(TOKEN)) return;
        apiRequest<User>("/auth/me")
        .then (setUser)
        .catch(() => localStorage.removeItem(TOKEN))
        .finally(() => setLoading(false))
    }, [])
    function save(data: AuthResponse){
    localStorage.setItem(TOKEN, data.token)
    setUser(data.user)
}

async function login(email:string, password: string) {
    const data = await apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: {email, password}
    })
    save(data)
}
async function register(name: string, email:string, password: string) {
    const data = await apiRequest<AuthResponse>("/auth/register", {
        method: "POST",
        body: {name, email, password}
    })
    save(data)
}
function logout(){
    localStorage.removeItem(TOKEN)
    setUser(null)
}

const value: AuthType = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
}

return<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error ("UseAuth must be used within AuthProvider")
    }
    return context;
}