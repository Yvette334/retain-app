import { useEffect, useState } from "react";
import type { Insights } from "../types";
import { apiRequest } from "../api/api";
import { date, errorMessage, money } from "../utils/helpers";
import CategoryManage from "../components/CategoryManager";
import Table from "../components/Table";

export default function Admin() {
  const [insights, setinsights] = useState<Insights | null>(null);
  const [error, setError] = useState("");
  const [reload, setReload] = useState(0);

  useEffect(() => {
    apiRequest<Insights>("/admin/insights")
      .then((result) => {
        setinsights(result);
        setError("");
      })
      .catch((err: unknown) => setError(errorMessage(err)));
  }, [reload]);

  return (
    <div>
      <h1>Admin dashboard</h1>
      <CategoryManage onChanged={() => setReload((count) => count + 1)} />
      {error && <p className="error">{error}</p>}
      {!insights && !error && <p className="load">Loading...</p>}

      {insights && (
        <>
          <div className="statgrid">
            <div className="statcard">
              <span className="statlabel">Registered users</span>
              <strong className="statvalue">{insights.totalUsers}</strong>
            </div>
            <div className="statcard">
              <span className="statlabel">Total expenses recorded</span>
              <strong className="statvalue">{insights.totalExpenses}</strong>
            </div>
            <div className="statcard">
              <span className="statlabel">Total value of expenses</span>
              <strong className="statvalue">{money(insights.totalValue)}</strong>
            </div>
            <div className="statcard">
              <span className="statlabel">Expenses for this month</span>
              <strong className="statvalue">{insights.expenses}</strong>
            </div>
          </div>
          <Table
            title="Total spending per category"
            rows={insights.spendingCat}
          />
          <div className="tablegrid">
            <Table title="Top 5 most used categories" rows={insights.top} />
            <Table title="Bottom 5 least categories" rows={insights.bottom} />
          </div>
          <section>
            <h2>Recently added expenses</h2>
            <div className="tablewrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>User</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.recentExpenses.map((expense) => (
                    <tr key={expense._id}>
                      <td>{expense.title}</td>
                      <td>{expense.user.name}</td>
                      <td>{expense.category.name}</td>
                      <td>{money(expense.amount)}</td>
                      <td>{date(expense.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2>Registered users</h2>
            <div className="tablewrap">
              <table className="datatable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {insights.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{date(user.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
