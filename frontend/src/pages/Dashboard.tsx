import { useEffect, useState } from "react";
import { errorMessage, money, monthText, date } from "../utils/helpers";
import type { DashboardData } from "../types";
import { apiRequest } from "../api/api";
import BudgetManager from "../components/BudgetManger";
import SpendBar from "../components/SpendBar";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [month, setMonth] = useState<string>(monthText());
  const [info, setInfo] = useState<DashboardData | null>(null);
  const [reload, setReload] = useState(0);
  const [errorText, seterrorText] = useState("");

  useEffect(() => {
    let change = false;

    apiRequest<DashboardData>(`/dashboard?month=${month}`)
      .then((data) => {
        if (!change) {
          setInfo(data);
          seterrorText("");
        }
      })
      .catch((err: unknown) => {
        if (!change) seterrorText(errorMessage(err));
      });
    return () => {
      change = true;
    };
  }, [month, reload]);

  return (
    <div>
      <div className="title">
        <h1>Dashboard</h1>
        <label className="expmonth">
          Month
          <input
            type="month"
            onChange={(e) => {
              if (e.target.value) setMonth(e.target.value);
            }}
          />
        </label>
      </div>
      {errorText && <p className="error">{errorText}</p>}
      {!info && !errorText && <p className="load">Dashboard...</p>}

      {info && (
        <>
          <div className="grid">
            <div className="card">
              <span>Total spent</span>
              <strong>{money(info.spent)}</strong>
            </div>
            <div className="card">
              <span>Budget remaining</span>
              <strong>
                {info.status === "no budget" ? "No budget" : money(info.remaining)}
              </strong>
            </div>
            <div className="card">
              <span>Highest Expenses</span>
              <strong>
                {info.highExpense ? money(info.highExpense?.amount) : "-"}
              </strong>
              {info.highExpense && <span>{info.highExpense.title}</span>}
            </div>
          </div>
          <BudgetManager
            key={info.month}
            info={info}
            onSaved={() => setReload((count) => count + 1)}
          />
          <section>
            <h2>Spending by category</h2>
            <SpendBar items={info.spending} />
          </section>

          <section>
            <div className="title" style={{marginBottom: "16px"}}>
              <h2>Recent expense</h2>
              <Link className="btn" to="/expenses">View</Link>
            </div>
            {info.recentExpenses.length === 0 && (
              <p>No expenses this month yet.</p>
            )}
            <ul className="recentlist">
              {info.recentExpenses.map((expense) => (
                <li key={expense._id} className="recentrow">
                  <span>
                    <strong className="recenttitle">{expense.title}</strong>
                    <span className="recentmeta">
                      {expense.category.name} &middot; {date(expense.date)}
                    </span>
                  </span>
                  <strong className="recentamt">{money(expense.amount)}</strong>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
