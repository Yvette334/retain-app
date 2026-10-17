import type { BudgetStatus, PayMethod } from "./types";

export const PAY_METHODS: PayMethod[] = ["Cash", "Mobile money", "Card"]

export const STATUS: Record<BudgetStatus, string> = {
    "no budget": "No budget",
    within: "Within budget",
    approaching: "Approaching budget",
    "over budget": "Over budget"
}