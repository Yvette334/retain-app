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
    <header className="navbar">
        <span className="logo">Retain</span>
        <nav className="nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/expenses">Expenses</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="user">
            <span>{user?.name}</span>
            <button className="btn btn-small btn-light" onClick={handleLogout}>Sign out</button>
        </div>
    </header>
    )
}