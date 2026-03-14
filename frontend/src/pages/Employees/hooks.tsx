import { useAxios } from "@/hooks/use-axios";
import { FetchEmployees, type Employee, type EmployeesResponse } from "@/lib/api/employees";
import { FetchEmployeeOrders, type Order, type OrdersResponse } from "@/lib/api/orders";
import { ApiRoutes } from "@/lib/routes";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const EMPLOYEE_PAGE_LIMIT = 15;
const ORDER_PAGE_LIMIT = 5;

function useEmployees() {
	const { result, error, loading, fetchData } = useAxios<EmployeesResponse>();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const fetchEmployees = useCallback(() => {
		fetchData(FetchEmployees(EMPLOYEE_PAGE_LIMIT, page, search));
	}, [page, search, fetchData]);

	const handleSearch = useCallback(() => {
		setPage(1);
		fetchData(FetchEmployees(EMPLOYEE_PAGE_LIMIT, 1, search));
	}, [search, fetchData]);

	const handleClearSearch = useCallback(() => {
		setSearch("");
		setPage(1);
		fetchData(FetchEmployees(EMPLOYEE_PAGE_LIMIT, 1));
	}, [fetchData]);

	return {
		employees: result?.employees || [],
		total: result?.total || 0,
		error,
		loading,
		page,
		setPage,
		search,
		setSearch,
		handleSearch,
		handleClearSearch,
		fetchEmployees,
		pageTotal: Math.ceil((result?.total || 0) / EMPLOYEE_PAGE_LIMIT),
	};
}

const Mode = {
	Viewing: "viewing",
	Editing: "editing",
	Adding: "adding",
	Deleting: "deleting",
	Saving: "saving",
} as const;

type ModeEnum = typeof Mode[keyof typeof Mode];

function useEmployeeMutations(onSuccess: () => void) {
	const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
	const [editedEmployee, setEditedEmployee] = useState<Partial<Employee>>({});
	const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({});
	const [mode, setMode] = useState<ModeEnum>(Mode.Viewing);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const isEditing = mode === Mode.Editing;
	const isAdding = mode === Mode.Adding;
	const isDeleting = mode === Mode.Deleting;
	const isSaving = mode === Mode.Saving;

	const handleSelectEmployee = (employee: Employee | null) => {
		setSelectedEmployee(employee);
		setEditedEmployee(employee || {});
		setMode(Mode.Viewing);
	};

	const handleFieldChange = (field: keyof Employee, value: string) => {
		if (isEditing) {
			setEditedEmployee(prev => ({ ...prev, [field]: value }));
		} else if (isAdding) {
			setNewEmployee(prev => ({ ...prev, [field]: value }));
		}
	};

	const handleEdit = () => {
		setEditedEmployee(selectedEmployee || {});
		setMode(Mode.Editing);
	};

	const handleAdd = () => {
		setMode(Mode.Adding);
		setSelectedEmployee(null);
		setNewEmployee({});
	};

	const handleCancel = () => {
		setEditedEmployee({});
		setNewEmployee({});
		setMode(Mode.Viewing);
	};

	const handleSave = async () => {
		const prevMode = mode;
		setMode(Mode.Saving);
		let isSuccessful = true;

		try {
			if (prevMode === Mode.Editing && selectedEmployee) {
				const resp = await axios.put(
					ApiRoutes.getEmployeeURL(selectedEmployee.id),
					editedEmployee,
					{ withCredentials: true }
				);
				if (resp.status === 200) {
					setSelectedEmployee(resp.data);
					toast.success("Сотрудник обновлен");
					onSuccess();
				}
			} else if (prevMode === Mode.Adding) {
				if (!newEmployee.name || !newEmployee.phone) {
					throw new Error("Заполните все обязательные поля");
				}
				const resp = await axios.post(
					ApiRoutes.getEmployeesURL(),
					newEmployee,
					{ withCredentials: true }
				);
				setSelectedEmployee(resp.data);
				setNewEmployee({});
				toast.success("Сотрудник добавлен");
				onSuccess();
			}
		} catch (err) {
			isSuccessful = false;
			console.error("Error saving employee:", err);
			let errorMsg = "";
			switch (prevMode) {
    			case Mode.Editing:
      				errorMsg = "Ошибка обновления";
					break;
				case Mode.Adding:
					errorMsg = "Ошибка добавления";
					break;
			}
			toast.error(errorMsg, { description: (err as Error).message });
		} finally {
			if (isSuccessful) {
				setMode(Mode.Viewing);
			} else {
				setMode(prevMode);
			}
		}
	};

	const handleDelete = async () => {
		if (!selectedEmployee) return;
		setMode(Mode.Deleting);

		try {
			const resp = await axios.delete(
				ApiRoutes.getEmployeeURL(selectedEmployee.id),
				{ withCredentials: true }
			);
			if (resp.status === 204) {
				setIsDeleteDialogOpen(false);
				setSelectedEmployee(null);
				toast.success("Сотрудник удален");
				onSuccess();
			}
		} catch (err) {
			console.error("Error deleting employee:", err);
			toast.error("Ошибка удаления");
			setIsDeleteDialogOpen(false);
		} finally {
			setMode(Mode.Viewing);
		}
	};

	return {
		selectedEmployee,
		editedEmployee,
		newEmployee,
		mode,
		isEditing,
		isAdding,
		isDeleting,
		isSaving,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		handleSelectEmployee,
		handleFieldChange,
		handleEdit,
		handleAdd,
		handleCancel,
		handleSave,
		handleDelete,
	};
}

function useEmployeeOrders(employeeID: string | null) {
	const { result, error, loading, fetchData } = useAxios<OrdersResponse>();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const fetchOrders = useCallback(() => {
		if (employeeID) {
			fetchData(FetchEmployeeOrders(ORDER_PAGE_LIMIT, page, employeeID));
		}
	}, [employeeID, page, search, fetchData]);

	return {
		orders: result?.orders || [],
		total: result?.total || 0,
		error,
		loading: loading && employeeID !== null,
		page,
		setPage,
		search,
		setSearch,
		fetchOrders,
		pageTotal: Math.ceil((result?.total || 0) / ORDER_PAGE_LIMIT),
	};
}

export { EMPLOYEE_PAGE_LIMIT, ORDER_PAGE_LIMIT, useEmployeeMutations, useEmployeeOrders, useEmployees, type Order };
