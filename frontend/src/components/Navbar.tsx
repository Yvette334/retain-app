import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {

    const {user, isAdmin, logout} = useAuth()
    const navigate = useNavigate()

    function handleLogout() {
        logout()
        navigate("/login")
    }

    return(
    <header>
        <span>Retain</span>
        <nav>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/expenses">Expenses</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div>
            <span>{user?.name}</span>
            <span>{user?.role}</span>
            <button onClick={handleLogout}>Sign out</button>
        </div>
    </header>
    )
}