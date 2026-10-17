import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import type { Expense, Category, ExpenseData, PayMethod } from "../types";
import { apiRequest } from "../api/api";
import { today, errorMessage } from "../utils/helpers";
import { PAY_METHODS } from "../payment";

interface Value {
  title: string;
  amount: string;
  category: string;
  date: string;
  payMethod: string;
  notes: string;
}

export default function ExpenseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<Value>({
    title: "",
    amount: "",
    category: "",
    date: today(),
    payMethod: "Cash",
    notes: "",
  });
  const [errorText, setErrorText] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    apiRequest<Category[]>("/categories")
      .then(setCategories)
      .catch((err: unknown) => setErrorText(errorMessage(err)));
  }, []);

  useEffect(() => {
    if (!id) return;
    apiRequest<Expense>(`/expenses/${id}`)
      .then((expense) =>
        setValues({
          title: expense.title,
          amount: String(expense.amount),
          category: expense.category._id,
          date: expense.date.slice(0, 10),
          payMethod: expense.payMethod,
          notes: expense.notes,
        }),
      )
      .catch((err: unknown) => setErrorText(errorMessage(err)));
  }, [id]);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }
  function validate(): string {
    if (!values.title.trim()) return "Title is required";
    if (!(Number(values.amount) > 0)) return "Amount must be bigger than 0";
    if (!values.category) return "Choose the category";
    if (!values.date) return "Choose date";
    return "";
  }
  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = validate();
    if (problem) {
      setErrorText(problem);
      return;
    }
    const body: ExpenseData = {
      title: values.title.trim(),
      amount: Number(values.amount),
      category: values.category,
      date: values.date,
      payMethod: values.payMethod as PayMethod,
      notes: values.notes.trim(),
    };
    setErrorText("");
    setSaving(true);
    try {
      if (id) {
        await apiRequest<Expense>(`/expenses/${id}`, { method: "PUT", body });
      } else {
        await apiRequest<Expense>("/expenses", { method: "POST", body });
      }
      navigate("/expenses");
    } catch (err) {
      setErrorText(errorMessage(err));
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={handleSave}>
      <h1>{id ? "Edit expense" : "Add expense"}</h1>
      {errorText && <p className="error">{errorText}</p>}
      <label>
        Title
        <input
          type="text"
          name="title"
          value={values.title}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Amount
        <input
          type="number"
          name="amount"
          min="0"
          step="any"
          value={values.amount}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Category
        <select name="category" value={values.category} onChange={handleChange} required>
          <option value="">Choose category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Date
        <input
          type="date"
          name="date"
          value={values.date}
          onChange={handleChange}
          required
        />
      </label>
      <label>
        Payment method
        <select
          name="payMethod"
          value={values.payMethod}
          onChange={handleChange}
        >
          {PAY_METHODS.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes
        <textarea
          name="notes"
          value={values.notes}
          rows={3}
          onChange={handleChange}
        />
      </label>
      <div className="actions">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
        <Link className="btn" to="/expenses">
          Cancel
        </Link>
      </div>
    </form>
  );
}
