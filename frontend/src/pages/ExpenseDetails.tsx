import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Expense } from "../types";
import { apiRequest } from "../api/api";
import { errorMessage, money, date } from "../utils/helpers";

export default function ExpenseDetail() {
    const {id} = useParams<{id: string}>()
    const navigate = useNavigate()
    const [expense, setExpense] = useState<Expense | null>(null)
    const [errorText, setErrorText] = useState("")

    useEffect(() => {
        apiRequest<Expense>(`/expenses/${id}`)
          .then(setExpense)
          .catch((err: unknown) => setErrorText(errorMessage(err)));
      }, [id]);

async function handleDelete() {
    if (!expense || !window.confirm(`Are you sure you want to delete "${expense.title}"?`)) return;

    try {
        await apiRequest<{message: string}>(`/expenses/${expense._id}`, {method: "DELETE"})
        navigate("/expenses")
    }
    catch (err) {
        setErrorText(errorMessage(err))
    }   
}
if (errorText) return <p className="error">{errorText}</p>
if (!expense) return <p className="loading">Loading ...</p>

return (
    <section>
        <h1>{expense.title}</h1>
        <dl>
            <dt>Amount</dt>
            <dd>{money(expense.amount)}</dd>
            <dt>Category</dt>
            <dd>{expense.category.name}</dd>
            <dt>Payment Method</dt>
            <dd>{expense.payMethod}</dd>
            <dt>Date</dt>
            <dd>{date(expense.date)}</dd>
            <dt>Notes</dt>
            <dd>{expense.notes || "No note"}</dd>
        </dl>
        <div className="actions">
            <Link to={`/expenses/${expense._id}/edit`}>Edit</Link>
            <button className="delete" onClick={handleDelete}>Delete</button>
            <Link className="" to ="/expenses">Back</Link>
        </div>
    </section>
)
}
