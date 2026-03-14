import { useAxios } from "@/hooks/use-axios";
import { FetchAccounts, type Account, type AccountForm, type AccountsResponse } from "@/lib/api/accounts";
import { ApiRoutes } from "@/lib/routes";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const ACCOUNTS_PAGE_LIMIT = 15;

function useAccounts() {
	const { result, error, loading, fetchData } = useAxios<AccountsResponse>();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");

	const fetchAccounts = useCallback(() => {
		fetchData(FetchAccounts(ACCOUNTS_PAGE_LIMIT, page, search));
	}, [page, search, fetchData]);

	const handleSearch = useCallback(() => {
		setPage(1);
		fetchData(FetchAccounts(ACCOUNTS_PAGE_LIMIT, 1, search));
	}, [search, fetchData]);

	const handleClearSearch = useCallback(() => {
		setSearch("");
		setPage(1);
		fetchData(FetchAccounts(ACCOUNTS_PAGE_LIMIT, 1));
	}, [fetchData]);

	return {
		accounts: result?.accounts || [],
		total: result?.total || 0,
		error,
		loading,
		page,
		setPage,
		search,
		setSearch,
		handleSearch,
		handleClearSearch,
		fetchAccounts,
		pageTotal: Math.ceil((result?.total || 0) / ACCOUNTS_PAGE_LIMIT),
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

function useAccountMutations(onSuccess: () => void) {
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
	const [editedAccount, setEditedAccount] = useState<Partial<Account>>({});
	const [newAccount, setNewAccount] = useState<Partial<AccountForm>>({});
	const [mode, setMode] = useState<ModeEnum>(Mode.Viewing);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const isEditing = mode === Mode.Editing;
	const isAdding = mode === Mode.Adding;
	const isDeleting = mode === Mode.Deleting;
	const isSaving = mode === Mode.Saving;

	const handleSelectAccount = (account: Account | null) => {
		setSelectedAccount(account);
		setEditedAccount(account || {});
		setMode(Mode.Viewing);
	};

	const handleFieldChange = (field: keyof AccountForm, value: string) => {
		if (isEditing) {
			setEditedAccount(prev => ({ ...prev, [field]: value }));
		} else if (isAdding) {
			setNewAccount(prev => ({ ...prev, [field]: value }));
		}
	};

	const handleAdd = () => {
		setMode(Mode.Adding);
		setSelectedAccount(null);
		setNewAccount({});
	};

	const handleCancel = () => {
		setEditedAccount({});
		setNewAccount({});
		setMode(Mode.Viewing);
	};

	const handleSave = async () => {
		const prevMode = mode;
		setMode(Mode.Saving);
		let isSuccessful = true;

		try {
			if (prevMode === Mode.Editing && selectedAccount) {
				const resp = await axios.put(
					ApiRoutes.getAccountURL(selectedAccount.login),
					editedAccount,
					{ withCredentials: true }
				);
				if (resp.status === 200) {
					setSelectedAccount(resp.data);
					toast.success("Сотрудник обновлен");
					onSuccess();
				}
			} else if (prevMode === Mode.Adding) {
				if (!newAccount.login || !newAccount.password) {
					throw new Error("Заполните все обязательные поля");
				}
				newAccount.login = newAccount.login.trim();
				newAccount.password = newAccount.password.trim();
				if (newAccount.password.length < 8) {
					throw new Error("Пароль должен быть длиннее 8 символов");
				}
				const resp = await axios.post(
					ApiRoutes.getAccountsURL(),
					newAccount,
					{ withCredentials: true }
				);
				setSelectedAccount(resp.data);
				setNewAccount({});
				toast.success("Сотрудник добавлен");
				onSuccess();
			}
		} catch (err) {
			isSuccessful = false;
			console.error("Error saving account:", err);
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
		if (!selectedAccount) return;
		setMode(Mode.Deleting);

		try {
			const resp = await axios.delete(
				ApiRoutes.getAccountURL(selectedAccount.login),
				{ withCredentials: true }
			);
			if (resp.status === 204) {
				setIsDeleteDialogOpen(false);
				setSelectedAccount(null);
				toast.success("Сотрудник удален");
				onSuccess();
			}
		} catch (err) {
			console.error("Error deleting account:", err);
			toast.error("Ошибка удаления");
			setIsDeleteDialogOpen(false);
		} finally {
			setMode(Mode.Viewing);
		}
	};

	return {
		selectedAccount,
		newAccount,
		mode,
		isAdding,
		isSaving,
		isDeleting,
		isDeleteDialogOpen,
		setIsDeleteDialogOpen,
		handleSelectAccount,
		handleFieldChange,
		handleAdd,
		handleSave,
		handleCancel,
		handleDelete,
	};
}

export { ACCOUNTS_PAGE_LIMIT, useAccountMutations, useAccounts };
