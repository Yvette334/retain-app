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
    <div className="bars">
    {sorted.map((item) => (
        <div key={item.name} className="barrow">
            <span className="barlabel">{item.name}</span>
            <div className="bartrack">
                <div className="barfill" style={{width: `${(item.total / big) * 100}%`}}/>
            </div>
            <span className="baramount">{money(item.total)}</span>
        </div>
    ))}
    </div>
)
}