import { useState, useEffect, type FormEvent } from "react";
import type { Category } from "../types";
import { errorMessage } from "../utils/helpers";
import { apiRequest } from "../api/api";

interface CategoryProps {
  onChanged: () => void;
}

export default function CategoryManage({onChanged}: CategoryProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [reload, setReload] = useState(0);
  const [error, setError] = useState("")

  useEffect(() => {
    apiRequest<Category[]>("/categories")
      .then(setCategories)
      .catch((err: unknown) => setError(errorMessage(err)));
  }, [reload]);

  function refresh() {
    setReload((count) => count + 1)
    onChanged();
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    
    if (!name.trim()){
        setError("Category name is required")
        return
    }

    try {
        await apiRequest<Category>("/categories", {method: "POST", body: {name: name.trim()}})
        setName("")
        refresh()
    }
    catch (err) {
        setError(errorMessage(err))
    }
  }
  function startEdit(category: Category) {
    setEditId(category._id)
    setEditName(category.name)
  }

  async function handleSave(id: string) {
    setError("")

    if (!editName.trim()) {
        setError("Category name is required")
        return
    }

    try {
        await apiRequest<Category>(`/categories/${id}`, {method: "PUT", body: {name: editName.trim()}})
        setEditId(null)
        refresh()
    }
    catch (err) {
        setError(errorMessage(err))
    }
  }
  async function handleDelete(category: Category) {
    if (!window.confirm(`Delete "${category.name}"? Its expenses will be in the Uncategorized.`)) return
    setError("")

    try {
        await apiRequest<{message: string}>(`/categories/${category._id}`, {method: "DELETE"})
        refresh()
    }
    catch (err) {
        setError(errorMessage(err))
    }
  }

  return (
    <section>
        <h2>Manage categories</h2>
        <form className="catform" onSubmit={handleCreate}>
            <input type="text" placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn" type="submit">Add</button>
        </form>
        {error && <p className="error">{error}</p>}

        <ul className="catlist">
          {categories.map((category) => (
            <li key={category._id} className="catrow">
              {editId === category._id ? (
                <div className="catedit">
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
                  <div className="cateditbtns">
                    <button className="btn" onClick={() => handleSave(category._id)}>Save</button>
                    <button className="outline" onClick={() => setEditId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <span className="catname">
                    {category.name}
                    {category.isDefault && <span className="badge defaultbadge">Default</span>}
                  </span>
                  {!category.isDefault && (
                    <div className="catbtns">
                      <button className="btn" onClick={() => startEdit(category)}>Edit</button>
                      <button className="delete" onClick={() => handleDelete(category)}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
    </section>
  )
}
