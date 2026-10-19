import { useState, type FormEvent } from "react";
import type {Budget} from "../types"
import { apiRequest } from "../api/api";
import { errorMessage, money, getStatusClass } from "../utils/helpers";
import { STATUS } from "../payment";
interface BudgetProps {
    info: Budget;
    onSaved: () => void;
}

export default function BudgetManager ({info, onSaved}: BudgetProps) {
    const [amount, setAmount] = useState<string>(info.budget > 0 ? String(info.budget) : "")
    const [errorText, setErrorText] = useState("")
    const[saved, setSaved] = useState(false)

    const used = info.budget > 0 ? Math.round((info.spent / info.budget) *100) : 0
    const width = Math.min(100, used)

    async function saveBudget(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setErrorText("")

        if (!(Number(amount) > 0)){
            setErrorText("Budget must be greater than 0")
            return
        }
        setSaved(true)
        try {
            await apiRequest<Budget>(`/budget/${info.month}`, {
                method: "PUT",
                body: {amount: Number(amount)}
            })
            onSaved()
        }catch (err) {
            setErrorText(errorMessage(err))
        } finally {
            setSaved(false)
        }
    }

    return (
        <section>
            <div className="budgetheader">
                <h2>Monthly budget</h2>
                <span className={`status ${getStatusClass(info.status)}`}>{STATUS[info.status]}</span>
            </div>
            {info.budget > 0 && (
                <>
                <div className="track">
                    <div className={`fill ${getStatusClass(info.status)}`} style={{width: `${width}%`}}/>
                </div>
                <p className="budgetmeta">{money(info.spent)} spent of {money(info.budget)} ({used}%)</p>
                </>
            )}
            <form className="budgetform" onSubmit={saveBudget}>
                <label>
                    {info.budget > 0 ? "Update the budget" : "Set the budget"}
                    <input
                        type="number"
                        min="1"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        />
                </label>
                <button className="btn" type="submit" disabled={saved}>
                    {saved ? "Saving..." : "Save budget"}
                </button>
            </form>
            {errorText && <p className="error">{errorText}</p>}
        </section>
    )
}