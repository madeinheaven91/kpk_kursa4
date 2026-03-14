import AppSidebar from "@/components/layouts/app/Sidebar";
import { SidebarProvider, } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { login, type AuthState, Me, Refresh } from "@/lib/api/accounts";
import { useAppDispatch, useAppSelector } from "@/hooks/store";
import { AppRoutes } from "@/lib/routes";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export type LayoutContext = AuthState;

// FIXME
export function AppLayout() {
	const auth = useAppSelector(state => state.auth);
	const dispatch = useAppDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		let isMounted = true;

		// FIXME: wtf vibecoding, sprosi danyu kostina
		async function validateAuth() {
			try {
				// If we already have account in Redux, we're good
				if (auth.account) {
					if (isMounted) {
						setIsAuthenticated(true);
						setIsLoading(false);
					}
					return;
				}

				// Try to get account with existing token
				let account = await Me();

				// If Me() fails, try to refresh
				if (!account) {
					console.error("Me failed, trying refresh...");
					const refreshSuccess = await Refresh();

					if (refreshSuccess) {
						account = await Me();
					}
				}

				if (account && isMounted) {
					dispatch(login(account));
					setIsAuthenticated(true);
				} else if (isMounted) {
					// Both Me and Refresh failed, redirect to login
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Auth validation error:", error);
				if (isMounted) {
					setIsAuthenticated(false);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		}

		validateAuth();

		return () => {
			isMounted = false;
		};
	}, [auth.account, dispatch]);

	// Загрузка
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
					<p className="mt-4 text-gray-600">Проверяем авторизацию...</p>
				</div>
			</div>
		);
	}

	// Перенапрвляем на авторизацию если она не выполнена
	if (!isAuthenticated) {
		return <Navigate to={AppRoutes.getSignInURL()} replace />;
	}

	// Основной скелет приложения
	return (
		<SidebarProvider>
			<div className="flex h-screen w-screen">
				<AppSidebar account={auth.account!} />
				<main className="flex-1 overflow-auto">
					<Outlet context={auth satisfies LayoutContext} />
				</main>
				<Toaster />
			</div>
		</SidebarProvider>
	);
}
