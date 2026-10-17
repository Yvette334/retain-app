import type { Category, direction, field } from "../types";
import {appDispatch, appSelector } from "../store/hooks"
import { PAY_METHODS } from "../payment";
import { reset, setFilter, setSort } from "../store/redux";


interface SearchProps {
    categories : Category[]
}

export default function Search ({categories}: SearchProps) {
    const filter = appSelector((state) => state.filter)
    const dispatch = appDispatch()
    function sortchange(value: string) {
        const [sortBy, order] = value.split("-") as [field, direction]
        dispatch(setSort({sortBy, order}))
    }

    return (
        <div className="flex flex-col md:flex-row gap-2 mb-4">
            <label>
                Search
                <input type="text" placeholder="Search" value={filter.search}
                onChange={(e) => dispatch(setFilter({field: "search", value: e.target.value}))}
                 />
            </label>

            <label>
                Category
                <select value={filter.category}
                onChange={(e) => dispatch(setFilter({field: "category", value: e.target.value}))}
                 >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
            </label>

            <label>
                Payment method
                <select value={filter.payMethod}
                onChange={(e) => dispatch(setFilter({field: "payMethod", value: e.target.value}))}
                 >
                    <option value="">All pay Method</option>
                    {PAY_METHODS.map((method) => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </select>
            </label>

            <label>
                From
                <input type="date"  value={filter.startDate}
                onChange={(e) => dispatch(setFilter({field: "startDate", value: e.target.value}))}
                 />
            </label>

            <label>
                To
                <input type="date"  value={filter.endDate}
                onChange={(e) => dispatch(setFilter({field: "endDate", value: e.target.value}))}
                 />
            </label>

            <label>
                Amount(min)
                <input type="number" min= "0"  value={filter.minAmount}
                onChange={(e) => dispatch(setFilter({field: "minAmount", value: e.target.value}))}
                 />
            </label>

            <label>
                Amount(max)
                <input type="number" min= "0"  value={filter.maxAmount}
                onChange={(e) => dispatch(setFilter({field: "maxAmount", value: e.target.value}))}
                 />
            </label>

            <label>
                Sort by
                <select value={`${filter.sortBy}-${filter.order}`} 
                onChange={(e) => sortchange(e.target.value)}>
                    <option value="date-desc">New first</option>
                    <option value="date-asc">Old first</option>
                    <option value="amount-desc">Highest</option>
                    <option value="amount-asc">Lowest</option>
                </select>
                <button className="clear" onClick={() => dispatch(reset())}>Clear</button>
            </label>
        </div>
    )
}