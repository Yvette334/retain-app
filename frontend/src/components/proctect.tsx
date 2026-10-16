import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

interface ProctectedRouteProps{
    children: ReactNode;
    adminOnly?: boolean
}

export function ProtectedRoute({children, adminOnly = false}: ProctectedRouteProps) {
    const {user, loading, isAdmin} = useAuth()
    if(loading) return <p className="center-message">Loading...</p>

    if(!user) return <Navigate to="/login" replace />
    if(adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />
    return <>{children}</>
}