import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Account } from "./entity";

interface AuthState {
	account?: Account
}

const initialState: AuthState = {
	account: undefined,
}

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login: (state, action: PayloadAction<Account>) => {
			state.account = action.payload;
		},
		logout: (state) => {
			state.account = undefined;
		},
	},
});

export const { login, logout } = authSlice.actions;
export { type AuthState };
export default authSlice.reducer;
