import { configureStore } from "@reduxjs/toolkit";
import reducer from "./redux"

export const store = configureStore({
    reducer: {
        filter: reducer,
    },
})

export type Dispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;