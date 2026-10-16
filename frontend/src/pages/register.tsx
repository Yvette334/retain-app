import { useState, type FormEvent } from "react"
import { errorMessage } from "../utils/helpers"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../context/authContext"

export default function Register(){
    const {user, loading, register} = useAuth()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [password, setPassword] = useState("")
    const [submitt, setSubmitt] = useState(false)

    if(loading) return <p className="center-message">Loading...</p>
    if (user) return <Navigate to={user.role ==="admin" ? "/admin" : "/dashboard"} replace />

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError("");
        
        if(password.length < 6) {
            setError("Password must have atleast 6 characters")
            return
        }
        setSubmitt(true)

        try {
            await register(name, email, password)
        } catch (err) {
            setError(errorMessage(err))
        }finally {
            setSubmitt(false)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Create an account</h1>
                <p>Track your expenses</p>
                {error && <p>{error}</p> }

                <label>
                    Name
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </label>
                <label>
                    Email
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </label>
                <label>
                    Password
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </label>

                <button type="submit" disabled={submitt}>
                    {submitt ? "Creating an account" : "Sign up"}
                </button>
                <p>Already have an account <Link to="/login">Sign in</Link></p>
            </form>
        </div>
    )
}