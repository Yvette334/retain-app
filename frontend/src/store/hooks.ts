import type { State, Dispatch } from "./store";
import { useDispatch, useSelector } from "react-redux";

export  const  appDispatch = useDispatch.withTypes<Dispatch>();
export  const  appSelector = useSelector.withTypes<State>();
