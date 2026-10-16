import { useState, type FormEvent } from "react"
import { errorMessage } from "../utils/helpers"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function Login(){
    const {user, loading, login} = useAuth()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [password, setPassword] = useState("")
    const [submitt, setSubmitt] = useState(false)

    if(loading) return <p className="center-message">Loading...</p>
    if (user) return <Navigate to={user.role ==="admin" ? "/admin" : "/dashboard"} replace />

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("");
        setSubmitt(true)

        try {
            await login(email, password)
        } catch (err) {
            setError(errorMessage(err))
        }finally {
            setSubmitt(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Retain</h1>
                <p>Sign in</p>
                {error && <p>{error}</p> }

                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>
                <button type="submit" disabled={submitt}>
                    {submitt ? "Signing in" : "Sign in"}
                </button>
                <p>Don't have an account? <Link to="/register">Sign up</Link></p>
            </form>
        </div>
    )
}