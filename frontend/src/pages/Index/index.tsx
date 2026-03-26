import { useAppSelector } from "@/hooks/store";
import { AppRoutes } from "@/lib/routes";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Index() {
	const auth = useAppSelector(state => state.auth);
	const navigate = useNavigate();

	useEffect(() => {
			navigate(AppRoutes.getDashboardURL("/app"));
	}, [auth.account, navigate]);

	return <></>
}

export const Component = React.memo(Index);
