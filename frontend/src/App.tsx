import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"
import { ProtectedRoute } from "./components/Protect";
import Layout from "./components/Layout";

export default function App(){
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route element={
        <ProtectedRoute>
          <Layout/>
        </ProtectedRoute>
       }
       >
       <Route path="/dashboard" element={<h1>Dashboard coming soon</h1>}/>
       </Route>
       <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}