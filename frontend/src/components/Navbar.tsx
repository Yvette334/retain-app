import { useAuth } from "../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reset } from "../store/redux";

export default function Navbar() {

    const {user, isAdmin, logout} = useAuth()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleLogout() {
        logout()
        dispatch(reset())
        navigate("/login")
    }

    return(
    <header className="header">
        <span className="logo">Retain</span>
        <nav className="nav">
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/expenses">Expenses</NavLink>
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="user">
            <span>{user?.name}</span>
            <button className="light" onClick={handleLogout}>Sign out</button>
        </div>
    </header>
    )
}