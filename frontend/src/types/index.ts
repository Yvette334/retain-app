export type Role = "user" | "admin"

export interface User {
    id: string
    name: string
    email: string
    role: Role
}

export interface AuthResponse {
    token: string
    user: User
}

export type PayMethod = "Cash" | "Mobile money" | "Card";

export interface Category {
    _id: string;
    name: string;
    isDefault: boolean;
}

export interface Expense {
    _id: string;
    title: string;
    amount: number;
    category: {_id: string; name: string}
    date: string;
    payMethod: PayMethod;
    notes: string;
}

export interface ExpenseData {
    title: string;
    amount: number;
    category: string;
    date: string;
    payMethod: PayMethod;
    notes : string;
}

export interface ExpenseResult {
    expenses: ExpenseData[];
    total: number;
    page: number;
    pages : number;
}

export type field = "date" | "amount";
export type  direction = "asc" |"desc"
