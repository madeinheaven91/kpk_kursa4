import { useNavigate } from "react-router-dom";
import { useAppSelector } from "./store";
import { AppRoutes } from "@/lib/routes";
import type { Account } from "@/lib/api/accounts";

export function useAccount(): Account {
	const auth = useAppSelector(state => state.auth);
	const navigate = useNavigate();

	if (auth.account === undefined) {
		navigate(AppRoutes.getSignInURL());
	}

	return auth.account!;
}
