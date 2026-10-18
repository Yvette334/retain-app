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
        <div key={item.name} style={{marginBottom: "12px"}}>
            <div style={{display: "flex", justifyContent: "space-between", marginBottom: "4px"}}>
            <span>{item.name}</span>
            <div className="track">
                <div className="fill" style={{width: `${(item.total / big) * 100}%`}}/>
            </div>
            <span>{money(item.total)}</span>
        </div>
        </div>
    ))}
    </div>
)
}