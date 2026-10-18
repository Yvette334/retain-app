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
      {error && <p>{error}</p>}
      {!insights && !error && <p className="loading">Loading...</p>}

      {insights && (
        <>
          <div>
            <div>
              <span>Users</span>
              <strong>{insights.totalUsers}</strong>
            </div>
            <div>
              <span>Total expenses</span>
              <strong>{insights.totalExpenses}</strong>
            </div>
            <div>
              <span>Total value of expenses</span>
              <strong>{money(insights.totalValue)}</strong>
            </div>
            <div>
              <span>Expenses this month</span>
              <strong>{insights.expenses}</strong>
            </div>
          </div>
          <Table
            title="Total spending per category"
            rows={insights.spendingCat}
          />
          <div>
            <Table title="Most used categories" rows={insights.top} />
            <Table title="Least used categories" rows={insights.bottom} />
          </div>
          <section>
            <h2>Added expenses</h2>
            <div>
              <table>
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
            <div>
              <table>
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
