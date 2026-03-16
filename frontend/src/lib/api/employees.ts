import { ApiRoutes } from "../routes";

interface Employee {
	id: string;
	account_login?: string;
	name: string;
	phone: string;
}

interface EmployeeRole {
	employee: Employee;
	role: string;
}

interface EmployeeRoleTrunc {
	id: string;
	role: string;
}

interface EmployeesResponse {
	employees: Employee[];
	total: number;
}

const FetchEmployees = (limit: number = 15, page: number = 1, name: string | null = null) => ({
	url: ApiRoutes.getEmployeesURL(), method: "GET", params: {
		limit: limit,
		offset: (page - 1) * limit,
		name: name
	}
})

const AddEmployee = (employee: Employee) => ({
	url: ApiRoutes.getEmployeesURL(), method: "POST", data: {
		"name": employee.name,
		"phone": employee.phone,
	}
})


const DeleteEmployee = (id: string) => ({ url: ApiRoutes.getEmployeeURL(id), method: "DELETE" })

export { AddEmployee, DeleteEmployee, FetchEmployees, type Employee, type EmployeeRole, type EmployeeRoleTrunc, type EmployeesResponse };
