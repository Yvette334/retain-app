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
    expenses: Expense[];
    total: number;
    page: number;
    pages : number;
}

export type field = "date" | "amount";
export type  direction = "asc" |"desc"

export type BudgetStatus = "within" | "no budget" | "approaching" | "over budget"

export interface Budget {
    month: string;
    budget: number
    spent: number
    remaining: number
    status: BudgetStatus
}

export interface CategoryItem {
    name: string
    total: number
}

export interface DashboardData extends Budget {
    highExpense: Expense | null
    spending: CategoryItem[]
    recentExpenses: Expense[]
}

export interface CategoryStat {
    id: string
    name: string
    count: number
    total: number
}

export interface AdminExpense extends Expense {
    user: {_id: string; name: string; email: string}
}

export interface UserItem {
    _id: string
    name: string
    email: string
    role: Role
    createdAt: string
}

export interface Insights {
    totalUsers: number
    totalExpenses: number
    totalValue: number
    expenses: number
    spendingCat: CategoryStat[]
    recentUsers: UserItem[]
    recentExpenses: AdminExpense[]
    top: CategoryStat[]
    bottom: CategoryStat[]
    

}
