import { useCallback, useState } from "react";
import { useAxios } from "@/hooks/use-axios";
import { FetchClients, type Client, type ClientsResponse } from "@/lib/api/clients";
import { ApiRoutes } from "@/lib/routes";
import axios from "axios";
import { toast } from "sonner";
import { type OrdersResponse, type Order, FetchClientOrders } from "@/lib/api/orders";

const CLIENT_PAGE_LIMIT = 15;
const ORDER_PAGE_LIMIT = 5;

function useClients() {
	const { result, error, loading, fetchData } = useAxios<ClientsResponse>();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const fetchClients = useCallback(() => {
		fetchData(FetchClients(CLIENT_PAGE_LIMIT, page, search));
	}, [page, search, fetchData]);

	const handleSearch = useCallback(() => {
		setPage(1);
		fetchData(FetchClients(CLIENT_PAGE_LIMIT, 1, search));
	}, [search, fetchData]);

	const handleClearSearch = useCallback(() => {
		setSearch("");
		setPage(1);
		fetchData(FetchClients(CLIENT_PAGE_LIMIT, 1));
	}, [fetchData]);

	return {
		clients: result?.clients || [],
		total: result?.total || 0,
		error,
		loading,
		page,
		setPage,
		search,
		setSearch,
		handleSearch,
		handleClearSearch,
		fetchClients,
		pageTotal: Math.ceil((result?.total || 0) / CLIENT_PAGE_LIMIT),
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

function useClientMutations(onSuccess: () => void) {
	const [selectedClient, setSelectedClient] = useState<Client | null>(null);
	const [editedClient, setEditedClient] = useState<Partial<Client>>({});
	const [newClient, setNewClient] = useState<Partial<Client>>({});
	const [mode, setMode] = useState<ModeEnum>(Mode.Viewing);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const isEditing = mode === Mode.Editing;
	const isAdding = mode === Mode.Adding;
	const isDeleting = mode === Mode.Deleting;
	const isSaving = mode === Mode.Saving;

	const handleSelectClient = (client: Client | null) => {
		setSelectedClient(client);
		setEditedClient(client || {});
		setMode(Mode.Viewing);
	};

	const handleFieldChange = (field: keyof Client, value: string) => {
		if (isEditing) {
			setEditedClient(prev => ({ ...prev, [field]: value }));
		} else if (isAdding) {
			setNewClient(prev => ({ ...prev, [field]: value }));
		}
	};

	const handleEdit = () => {
		setEditedClient(selectedClient || {});
		setMode(Mode.Editing);
	};

	const handleAdd = () => {
		setMode(Mode.Adding);
		setSelectedClient(null);
		setNewClient({});
	};

	const handleCancel = () => {
		setEditedClient({});
		setNewClient({});
		setMode(Mode.Viewing);
	};

	const handleSave = async () => {
		const prevMode = mode;
		setMode(Mode.Saving);
		let isSuccessful = true;

		try {
			if (prevMode === Mode.Editing && selectedClient) {
				const resp = await axios.put(
					ApiRoutes.getClientURL(selectedClient.id), 
					editedClient, 
					{ withCredentials: true }
				);
				if (resp.status === 200) {
					setSelectedClient(resp.data);
					toast.success("Клиент обновлен");
					onSuccess();
				}
			} else if (prevMode === Mode.Adding) {
				if (!newClient.name || !newClient.phone) {
					throw new Error("Заполните обязательные поля");
				}
				const resp = await axios.post(
					ApiRoutes.getClientsURL(), 
					newClient, 
					{ withCredentials: true }
				);
				setSelectedClient(resp.data);
				setNewClient({});
				toast.success("Клиент добавлен");
				onSuccess();
			}
		} catch (err) {
			isSuccessful = false;
			console.error("Error saving client:", err);
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
		if (!selectedClient) return;
		setMode(Mode.Deleting);
		
		try {
			const resp = await axios.delete(
				ApiRoutes.getClientURL(selectedClient.id), 
				{ withCredentials: true }
			);
			if (resp.status === 204) {
				setIsDeleteDialogOpen(false);
				setSelectedClient(null);
				toast.success("Клиент удален");
				onSuccess();
			}
		} catch (err) {
			console.error("Error deleting client:", err);
			toast.error("Ошибка удаления");
			setIsDeleteDialogOpen(false);
		} finally {
			setMode(Mode.Editing);
		}
	};

	return {
		selectedClient,
		editedClient,
		newClient,
		mode,
		isEditing,
		isAdding,
		isDeleting,
		isSaving,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		handleSelectClient,
		handleFieldChange,
		handleEdit,
		handleAdd,
		handleCancel,
		handleSave,
		handleDelete,
	};
}

function useClientOrders(clientID: string | null) {
	const { result, error, loading, fetchData } = useAxios<OrdersResponse>();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const fetchOrders = useCallback(() => {
		if (clientID) {
			fetchData(FetchClientOrders(ORDER_PAGE_LIMIT, page, clientID));
		}
	}, [clientID, page, search, fetchData]);

	return {
		orders: result?.orders || [],
		total: result?.total || 0,
		error,
		loading: loading && clientID !== null,
		page,
		setPage,
		search,
		setSearch,
		fetchOrders,
		pageTotal: Math.ceil((result?.total || 0) / ORDER_PAGE_LIMIT),
	};
}

export { CLIENT_PAGE_LIMIT, ORDER_PAGE_LIMIT, useClients, useClientMutations, useClientOrders, type Order };
