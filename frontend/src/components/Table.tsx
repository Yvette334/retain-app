import type { CategoryStat } from "../types"
import { money } from "../utils/helpers"

interface TableProps {
    title: string
    rows: CategoryStat[]
}

export default function Table({title, rows} : TableProps) {

    return (
        <section style={{marginTop: "24px"}}>
            <h2>{title}</h2>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Expenses</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.name}</td>
                                <td>{row.count}</td>
                                <td>{money(row.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}