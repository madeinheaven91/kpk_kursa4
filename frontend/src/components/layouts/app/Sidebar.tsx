import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";
import { displayRole, logout, Logout, type AuthState } from "@/lib/api/accounts";
import { useAppDispatch } from "@/hooks/store";
import { AppRoutes } from "@/lib/routes";
import { BookUserIcon, CalendarIcon, CircleUserRoundIcon, LogOutIcon, ScrollTextIcon, ShieldUserIcon, UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { permRoleToNumber } from "@/lib/utils";

interface SidebarProps {
	auth: AuthState
}

function AppSidebar({ auth }: SidebarProps) {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const onLogout = () => {
		Logout();
		navigate(AppRoutes.getSignInURL());
		dispatch(logout());
	};

	const account = auth.account!;

	return (
		<Sidebar>
			<SidebarHeader className='p-5' >
				<h1>Аниматоры CRM</h1>
			</SidebarHeader >
			<Separator />
			<SidebarContent className='p-5'>
				<SidebarNavItem to={AppRoutes.getDashboardURL("/app")} icon={<CalendarIcon />} title='Главная' />
				<SidebarNavItem to={AppRoutes.getClientsURL("/app")} icon={<BookUserIcon />} title='Клиенты' />
				<SidebarNavItem to={AppRoutes.getOrdersURL("/app")} icon={<ScrollTextIcon />} title='Заказы' />
				{permRoleToNumber(account.role) > 0 && <SidebarNavItem to={AppRoutes.getEmployeesURL("/app")} icon={<UserIcon />} title='Сотрудники' />}
				{permRoleToNumber(account.role) === 2 && <SidebarNavItem to={AppRoutes.getAccountsURL("/app")} icon={<ShieldUserIcon />} title='Аккаунты' />}
			</SidebarContent>
			<Separator />
			<SidebarFooter className='flex flex-row justify-between items-center gap-2'>
				<div className='flex items-center gap-2'>
					<CircleUserRoundIcon size='36' />
					<div>
						<p><b>{account.login}</b></p>
						<p>{displayRole(account.role)}</p>
					</div>
				</div>
				<LogOutIcon onClick={onLogout} />
			</SidebarFooter>
		</Sidebar >
	)
}

interface SidebarNavItemProps {
	to: string;
	title: string;
	icon: ReactNode;
}

function SidebarNavItem({ to, icon, title }: SidebarNavItemProps) {
	return (
		<NavLink
			to={to}
			className={({ isActive }) =>
				`flex flex-row gap-2 p-2 rounded-md transition-colors ${isActive
					? 'bg-primary text-primary-foreground [&_svg]:text-primary-foreground'
					: 'hover:bg-muted [&_svg]:text-muted-foreground'
				}`
			}
		>
			{icon}
			{title}
		</NavLink>
	);
}

export default AppSidebar;
