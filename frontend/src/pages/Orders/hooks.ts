import { useAxios } from "@/hooks/use-axios";
import { ApiRoutes } from "@/lib/routes";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const ORDER_PAGE_LIMIT = 15;

interface AddOrderForm {
	client_id: string;
	employees: EmployeeRoleTrunc[];
	datetime: string; // ISO or formatted string
	duration?: number;
	address: string;
}

import { FetchOrdersFiltered, type FilterParams, type Order, type OrdersResponse } from "@/lib/api/orders";
import type { EmployeeRoleTrunc } from "@/lib/api/employees";

function useOrders() {
	const { result, error, loading, fetchData } = useAxios<OrdersResponse>();
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState<FilterParams>({
		dateRange: {
			from: undefined,
			to: undefined,
		}
	});

	const fetchOrders = useCallback(() => {
		fetchData(FetchOrdersFiltered(ORDER_PAGE_LIMIT, page, filter));	
	}, [page, filter, fetchData]);

	const handleApplyFilter = useCallback((newFilter: FilterParams) => {
		setFilter(newFilter);
		setPage(1);
		fetchData(FetchOrdersFiltered(ORDER_PAGE_LIMIT, page, filter));	
	}, [fetchData]);

	const handleClearFilter = useCallback(() => {
		setFilter({});
		setPage(1);
		fetchData(FetchOrdersFiltered(ORDER_PAGE_LIMIT, page, {}));	
	}, [fetchData]);

	return {
		orders: result?.orders || [],
		total: result?.total || 0,
		error,
		loading,
		page,
		setPage,
		filter,
		fetchOrders,
		handleApplyFilter,
		handleClearFilter,
		pageTotal: Math.ceil((result?.total || 0) / ORDER_PAGE_LIMIT),
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

function useOrderMutations(onSuccess: () => void) {
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [editedOrder, setEditedOrder] = useState<Partial<Order>>({});
	const [newOrder, setNewOrder] = useState<Partial<AddOrderForm>>({});
	const [mode, setMode] = useState<ModeEnum>(Mode.Viewing);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const isEditing = mode === Mode.Editing;
	const isAdding = mode === Mode.Adding;
	const isDeleting = mode === Mode.Deleting;
	const isSaving = mode === Mode.Saving;

	const handleSelectOrder = (order: Order | null) => {
		setSelectedOrder(order);
		setEditedOrder(order || {});
		setMode(Mode.Viewing);
	};

	const handleFieldChange = (field: string, value: unknown) => {
		if (isEditing) {
			setEditedOrder(prev => ({ ...prev, [field]: value }));
		} else if (isAdding) {
			setNewOrder(prev => ({ ...prev, [field]: value }));
		}
	};

	const handleEdit = () => {
		setEditedOrder(selectedOrder || {});
		setMode(Mode.Editing);
	};

	const handleAdd = () => {
		setMode(Mode.Adding);
		setSelectedOrder(null);
		setNewOrder({ employees: [] });
	};

	const handleCancel = () => {
		setEditedOrder({});
		setNewOrder({});
		setMode(Mode.Viewing);
	};

	const handleSave = async () => {
		const prevMode = mode;
		setMode(Mode.Saving);
		let isSuccessful = true;

		try {
			if (prevMode === Mode.Editing && selectedOrder) {
				const resp = await axios.put(
					ApiRoutes.getOrderURL(selectedOrder.id),
					editedOrder,
					{ withCredentials: true }
				);
				if (resp.status === 200) {
					setSelectedOrder(resp.data);
					toast.success("Заказ обновлён");
					onSuccess();
				}
			} else if (prevMode === Mode.Adding) {
				if (!newOrder.client_id || !newOrder.datetime || !newOrder.address) {
					throw new Error("Заполните обязательные поля");
				}
				if (!newOrder.employees || newOrder.employees.length === 0) {
					throw new Error("Добавьте хотя бы одного сотрудника");
				}
				const resp = await axios.post(
					ApiRoutes.getOrdersURL(),
					newOrder,
					{ withCredentials: true }
				);
				setSelectedOrder(resp.data);
				setNewOrder({});
				toast.success("Заказ добавлен");
				onSuccess();
			}
		} catch (err) {
			isSuccessful = false;
			console.error("Error saving order:", err);
			const errorMsg = prevMode === Mode.Editing ? "Ошибка обновления" : "Ошибка добавления";
			toast.error(errorMsg, { description: (err as Error).message });
		} finally {
			setMode(isSuccessful ? Mode.Viewing : prevMode);
		}
	};

	const handleDelete = async () => {
		if (!selectedOrder) return;
		setMode(Mode.Deleting);

		try {
			const resp = await axios.delete(
				ApiRoutes.getOrderURL(selectedOrder.id),
				{ withCredentials: true }
			);
			if (resp.status === 204) {
				setIsDeleteDialogOpen(false);
				setSelectedOrder(null);
				toast.success("Заказ удалён");
				onSuccess();
			}
		} catch (err) {
			console.error("Error deleting order:", err);
			toast.error("Ошибка удаления");
			setIsDeleteDialogOpen(false);
		} finally {
			setMode(Mode.Viewing);
		}
	};

	return {
		selectedOrder,
		editedOrder,
		newOrder,
		isEditing,
		isAdding,
		isDeleting,
		isSaving,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		handleSelectOrder,
		handleFieldChange,
		handleEdit,
		handleAdd,
		handleCancel,
		handleSave,
		handleDelete,
	};
}

export { ORDER_PAGE_LIMIT, useOrderMutations, useOrders, type AddOrderForm, type EmployeeRoleTrunc as EmployeeRole, type FilterParams };
