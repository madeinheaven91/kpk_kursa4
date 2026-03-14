import {
	Loader2,
	PlusIcon,
	SaveIcon,
	TrashIcon,
	XIcon
} from "lucide-react";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AccountsTable, DeleteDialog, SearchBar } from "./components";
import { useAccountMutations, useAccounts } from "./hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountRoleV, displayRole, type AccountRole } from "@/lib/api/accounts";

function AccountsPage() {
	const {
		accounts,
		total: accountsTotal,
		error: accountsError,
		loading: accountsLoading,
		page: accountsPage,
		setPage: accountsSetPage,
		search: accountsSearch,
		setSearch: accountsSetSearch,
		handleSearch: accountsHandleSearch,
		handleClearSearch: accountsHandleClearSearch,
		fetchAccounts,
		pageTotal: accountsPageTotal,
	} = useAccounts();

	const {
		selectedAccount,
		newAccount,
		mode: _mode,
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
	} = useAccountMutations(fetchAccounts);

	useEffect(() => {
		fetchAccounts();
	}, [accountsPage])

	return (
		<section className='h-screen p-4'>
			<h1 className='text-4xl py-5'>Аккаунты</h1>
			<div className='grid grid-cols-2 gap-10'>
				{/* Список аккаунтов */}
				<div className='flex flex-col gap-5'>
					<div className='flex flex-row gap-5'>
						<SearchBar
							search={accountsSearch}
							onSearchChange={accountsSetSearch}
							onSearch={accountsHandleSearch}
							onClear={accountsHandleClearSearch} />
						<Button onClick={handleAdd}><PlusIcon /> Добавить</Button>
					</div>
					<div className='border-1 border-text shadow-md rounded-lg'>
						{accountsLoading ?
							<div className="flex justify-center items-center p-20">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
							</div>
							: accountsError ?
								<p>Ошибка загрузки аккаунтов: {accountsError}</p>
								: <AccountsTable
									accounts={accounts}
									selectedAccount={selectedAccount}
									handleSelectAccount={handleSelectAccount}
									page={accountsPage}
									totalPages={accountsPageTotal}
									total={accountsTotal}
									onPageChange={accountsSetPage}
								/>
						}
					</div>
				</div>

				{/* Окно с информацией */}
				<div className={`flex flex-col justify-between rounded-lg p-4 ${selectedAccount || isAdding ? 'border-1 border-text shadow-md' : ''}`}>
					{selectedAccount &&
						<>
							<div>
								<div className='flex gap-5 justify-between'>
									<div className='flex gap-2'>
										<h2 className='text-2xl mb-10'>Информация об аккаунте</h2>
										<Button variant='destructive' onClick={() => setIsDeleteDialogOpen(true)}><TrashIcon /> Удалить</Button>
									</div>
									<Button variant='ghost' onClick={() => handleSelectAccount(null)}><XIcon /></Button>
								</div>
								<h2 className='text-4xl text-pretty'>{selectedAccount.login}</h2>
								<h2 className='text-2xl mt-3 text-pretty'>{displayRole(selectedAccount.role)}</h2>
							</div>
						</>
					}

					{isAdding &&
						<>
							<div>
								<div className='flex gap-5'>
									<h2 className='text-2xl mb-10'>Добавление аккаунта</h2>
									<Button variant='destructive' onClick={handleCancel}><XIcon />Отмена</Button>
								</div>
								<div className='flex flex-col gap-5'>
									<Field>
										<FieldLabel htmlFor='input-name' className='text-xl'>
											Логин <span className='text-red-500'>*</span>
										</FieldLabel>
										<Input
											required
											id='input-name'
											value={newAccount.login || ''}
											onChange={(e) => handleFieldChange('login', e.target.value)}
											placeholder="Имя"
											className='md:text-xl py-6'
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor='input-name' className='text-xl'>
											Пароль <span className='text-red-500'>*</span>
										</FieldLabel>
										<Input
											required
											id='input-name'
											type="password"
											value={newAccount.password || ''}
											onChange={(e) => handleFieldChange('password', e.target.value)}
											placeholder="Пароль"
											className='md:text-xl py-6'
										/>
									</Field>
									<Field>
										<FieldLabel className='text-xl'>
											Роль
										</FieldLabel>
										<Select
											value={newAccount.role || ''}
											onValueChange={(value) => handleFieldChange('role', value as AccountRole)}
										>
											<SelectTrigger className='md:text-xl py-6'>
												<SelectValue placeholder="Выберите роль" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={AccountRoleV.Manager}>Менеджер</SelectItem>
												<SelectItem value={AccountRoleV.Employee}>Сотрудник</SelectItem>
											</SelectContent>
										</Select>
									</Field>
								</div>
							</div>
							<div className='flex gap-2 h-fit'>
								<Button
									onClick={handleSave}
									disabled={isSaving}
								>
									{isSaving ? (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									) : (
										<SaveIcon className="mr-2 h-4 w-4" />
									)}
									Сохранить
								</Button>
							</div>
						</>
					}
				</div>
			</div>
			<DeleteDialog
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				isDeleting={isDeleting}
				handleDelete={handleDelete}
				selectedAccount={selectedAccount} />
		</section>
	)
}

export const Component = React.memo(AccountsPage);
