import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { direction, field } from "../types";

export interface ReduxState {
    search: string;
    category: string;
    payMethod: string;
    minAmount:string;
    maxAmount: string;
    startDate: string;
    endDate: string;
    sortBy: field;
    order: direction;
    page: number;
}

type filterBy = "search" | "category" | "payMethod" | "maxAmount" | "minAmount" | "startDate" | "endDate";

const start: ReduxState = {
    search: "",
    category: "",
    payMethod: "",
    minAmount:"",
    maxAmount: "",
    startDate: "",
    endDate: "",
    sortBy: "date",
    order: "desc",
    page: 1
}

const filterSlice = createSlice({
    name: "filterExpenses",
    initialState: start,
    reducers: {
        setFilter (state, action: PayloadAction< {field: filterBy, value: string}>) {
            state[action.payload.field] = action.payload.value;
            state.page = 1;
    },

    setSort (state, action: PayloadAction< {sortBy: field, order: direction}>) {
        state.sortBy = action.payload.sortBy;
        state.order = action.payload.order;
        state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
        state.page = action.payload;
    },
    reset() {
        return start;
    },
},
})

export const {setFilter, setSort, setPage, reset} = filterSlice.actions;
export default filterSlice.reducer;