import type { BudgetStatus } from "../types";

export function errorMessage(error: unknown): string{
    return error instanceof Error ? error.message: "Something went wrong"
}

export function money(amount: number): string {
    return `${amount.toLocaleString()} RWF`;
}

export function date(iso: string): string {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC"
    });
}

export function today(): string {
    return new Date().toISOString().slice(0, 10);
}

export function monthText(): string {
    return new Date().toISOString().slice(0, 7)
}

export function getStatusClass(status: BudgetStatus): string {
    return "status-" + status.replace(" ", "-")
}