import type { CategoryItem } from "../types";
import { money } from "../utils/helpers";

interface SpendProps {
    items: CategoryItem[];
}

export default function SpendBar ({items}: SpendProps){
if (items.length === 0) return <p>No spending for this month</p>
const sorted = [...items].sort((a,b) => b.total - a.total)
const big = sorted[0].total

return (
    <div>
    {sorted.map((item) => (
        <div key={item.name}>
            <span>{item.name}</span>
            <div>
                <div style={{width: `${(item.total / big) * 100}%`}}/>
            </div>
            <span>{money(item.total)}</span>
        </div>
    ))}
    </div>
)
}