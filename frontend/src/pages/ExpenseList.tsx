import { useEffect, useState } from "react";
import { appDispatch, appSelector } from "../store/hooks";
import type { Category, ExpenseResult } from "../types/index";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/api";
import { setPage } from "../store/redux";
import { errorMessage, money, date } from "../utils/helpers";
import Search from "../components/Search";
import Page from "../components/Pagination";

export default function ExpensesList(){
    const filter = appSelector((state) => state.filter)
    const dispatch = appDispatch();

    const [categories, setCategories] = useState<Category[]>([]);
    const [result, setResult] = useState<ExpenseResult | null>(null)
    const [errorText, setErrorText] = useState("")
    const [reload, setReload] = useState(0)
    const [isloading, setIsloading] = useState(true)

    useEffect(() => {
        apiRequest<Category[]>("/categories")
        .then(setCategories)
        .catch((err: unknown) => setErrorText(errorMessage(err)));
    }, [])

    useEffect(() => {
        let cancel = false

        const timer = setTimeout(() => {
            const query = new URLSearchParams()
            if(filter.search) query.set("search", filter.search)
            if(filter.category) query.set("category", filter.category)
            if(filter.payMethod) query.set("payMethod", filter.payMethod)
            if(filter.minAmount) query.set("minAmount", filter.minAmount)
            if(filter.maxAmount) query.set("maxAmount", filter.maxAmount)
            if(filter.startDate) query.set("startDate", filter.startDate)
            if(filter.endDate) query.set("endDate", filter.endDate)
            query.set("sortBy", filter.sortBy)
            query.set("order", filter.order)
            query.set("page", filter.page.toString())
            query.set("limit", "9")

            setIsloading(true)
            setErrorText("")
            apiRequest<ExpenseResult>(`/expenses?${query.toString()}`)
            .then((data) => {
                if (!cancel) setResult(data)
            })
           .catch((err: unknown) => {
            if (!cancel) setErrorText(errorMessage(err))
        })
        .finally(() => {
            if (!cancel) setIsloading(false)
        })
        }, 300)

        return () => {
            cancel = true
            clearTimeout(timer)
        }; }, [filter, reload])

        async function handleDelete(id: string, title: string) {
            if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
            
            try {
                await apiRequest<{message: string}>(`/expenses/${id}`, {method: "DELETE"})
            
            if (result && result.expenses.length === 1 && filter.page > 1) {
                dispatch(setPage(filter.page - 1))
            }
            else {
                setReload((count) => count + 1)}
            } catch (err) {
                setErrorText(errorMessage(err))
            }
        }

        return (
            <div>
                <div className="title">
                    <h1>Expenses</h1>
                    <Link className="btn" to="/expenses/new">+ Add</Link>
                </div>

            <Search categories={categories} />
            {errorText && <p className="error">{errorText}</p>}
            {isloading && <p className="loading">Loading expenses...</p>}
            {result && (
                <>
                <p>{result.total} expense{result.total === 1 ? "" : "s"} found </p>
                {result?.expenses.length === 0 && !isloading && <p className="no expenses">No expenses</p>}
                <div className="expenses">
                {result?.expenses.map((expense) => (
                    <article key={expense._id}>
                        <div>
                            <h3>{expense.title}</h3>
                            <strong>{money(expense.amount)}</strong>
                        </div>
                        <p>{expense.category.name}.{expense.payMethod}</p>
                        <p>{date(expense.date)}</p>
                        <div className="actions">
                            <Link to={`/expenses/${expense._id}/edit`}>Edit</Link>
                            <Link to={`/expenses/${expense._id}`}>View</Link>
                            <button className="delete" onClick={() => handleDelete(expense._id, expense.title)}>Delete</button>
                        </div>
                    </article>
                    
                ))}
                </div>
                <Page page={result.page} pages= {result.pages} onchange ={(page) => dispatch(setPage(page))} />
                </>
            )}
            </div>
        )
    }