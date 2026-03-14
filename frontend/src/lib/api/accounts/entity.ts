const AccountRoleV = {
	Employee: "employee",
	Manager: "manager",
	Admin: "admin",
} as const;

type AccountRole = typeof AccountRoleV[keyof typeof AccountRoleV];

interface Account {
	login: string;
	role: AccountRole;
}

function displayRole(role: AccountRole): string {
	switch (role) {
		case AccountRoleV.Admin:
			return "Администратор";
		case AccountRoleV.Manager:
			return "Менеджер";
		case AccountRoleV.Employee:
			return "Сотрудник";
	}
};

interface AccountsResponse {
	accounts: Account[];
	total: number;
}

interface AccountForm {
	login: string;
    password: string;
	role: AccountRole;
}

export { type Account, type AccountRole, AccountRoleV, displayRole, type AccountsResponse, type AccountForm }
