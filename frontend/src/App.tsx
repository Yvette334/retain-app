import { Route, Routes, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login"
import ExpenseDetail from "./pages/ExpenseDetails";
import ExpensesList from "./pages/ExpenseList";
import ExpenseForm from "./pages/ExpenseForm";
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
        <Route path="/expenses" element={<ExpensesList/>}/>
        <Route path="/expenses/new" element={<ExpenseForm/>}/>
        <Route path="/expenses/:id" element={<ExpenseDetail/>}/>
        <Route path="/expenses/:id/edit" element={<ExpenseForm/>}/>
      </Route>
       <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}