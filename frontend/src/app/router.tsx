import { AppRoutes } from "@/lib/routes";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import { AppLayout } from "@/components/layouts/app/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";

export const router = createBrowserRouter([
	{
		path: "",
		element: (
			<TooltipProvider>
				<Provider store={store}>
					<Outlet />
				</Provider>
			</TooltipProvider>
		),
		children: [
			{
				index: true,
				lazy: async () => await import('@/pages/Index'),
			},
			{
				path: AppRoutes.getSignInURL(),
				lazy: async () => await import('@/pages/SignIn'),
			},
			{
				path: "/app",
				element: <AppLayout />,
				children: [
					{
						path: AppRoutes.getDashboardURL("/app"),
						lazy: async () => await import('@/pages/Dashboard'),
					},
					{
						path: AppRoutes.getMeURL("/app"),
						lazy: async () => await import('@/pages/Me'),
					},
					{
						path: AppRoutes.getClientsURL("/app"),
						lazy: async () => await import('@/pages/Clients'),
					},
					{
						path: AppRoutes.getOrdersURL("/app"),
						lazy: async () => await import('@/pages/Orders'),
					},
					{
						path: AppRoutes.getEmployeesURL("/app"),
						lazy: async () => await import('@/pages/Employees'),
					},
					{
						path: AppRoutes.getAccountsURL("/app"),
						lazy: async () => await import('@/pages/Accounts'),
					},
					{
						path: AppRoutes.getOrdersURL("/app"),
						lazy: async () => await import('@/pages/Index'),
					},
				],
			},
			// {
			//   path: "*",
			//   lazy: async () => await import('@/pages/NotFound'),
			// },
		],
	},
]);
