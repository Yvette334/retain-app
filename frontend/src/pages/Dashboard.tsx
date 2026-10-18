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
        <label style={{margin: 0}}>
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
          <div className="grid" style={{marginBottom: "24px"}}>
            <div className="card">
              <span>Total spent</span>
              <strong style={{fontSize: "1.4rem", marginTop: "8px"}}>{money(info.spent)}</strong>
            </div>
            <div className="card">
              <span>Budget remaining</span>
              <strong style={{fontSize: "1.4rem", marginTop: "8px"}}>
                {info.status === "no budget"
                  ? "No budget"
                  : money(info.remaining)}
              </strong>
            </div>
            <div className="card">
              <span>Highest Expenses</span>
              <strong style={{fontSize: "1.4rem", marginTop: "8px"}}>
                {info.highExpense ? money(info.highExpense?.amount) : "-"}
              </strong>
              {info.highExpense && <span style={{marginTop: "4px"}}>{info.highExpense.title}</span>}
            </div>
          </div>
          <BudgetManager
            key={info.month}
            info={info}
            onSaved={() => setReload((count) => count + 1)}
          />
          <section style={{marginTop: "24px", marginBottom: "24px"}}>
            <h2>Spending by category</h2>
            <SpendBar items={info.spending} />
          </section>

          <section style={{marginTop: "24px"}}>
            <div className="title" style={{marginBottom: "16px"}}>
              <h2 style={{margin: 0}}>Recent expense</h2>
              <Link className="btn" style={{margin: 0}} to="/expenses">View</Link>
            </div>
            {info.recentExpenses.length === 0 && (
              <p>No expenses this month yet.</p>
            )}
            <ul style={{listStyle: "none", padding: 0, margin: 0}}>
              {info.recentExpenses.map((expense) => (
                <li key={expense._id} style={{display:"flex", justifyContent:"space-between", alignItems: "center", padding:"10px 0", borderBottom: "1px solid #E2E8F0"}}>
                  <span>
                    <strong style={{color: "#1A2332", display:"block"}}>{expense.title}</strong>
                    <span style={{fontSize: "0.85rem", color: "#64748B"}}>
                      {" "}
                      . {expense.category.name} . {date(expense.date)}{" "}
                    </span>
                  </span>
                  <strong style={{ color: "#00C853" }}>{money(expense.amount)}</strong>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
