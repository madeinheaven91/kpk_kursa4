import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Account } from "./entity";
import type { Employee } from "../employees";

interface AuthState {
	account?: Account
	employee?: Employee
}

const initialState: AuthState = {
	account: undefined,
	employee: undefined,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<{ account: Account, employee: Employee }>) => {
			state.account = action.payload.account;
            state.employee = action.payload.employee;
		},
		logout: (state) => {
			state.account = undefined;
		},
	},
});

export const { login, logout } = authSlice.actions;
export { type AuthState };
export default authSlice.reducer;
