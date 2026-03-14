import {
	Loader2,
	PencilIcon,
	PlusIcon,
	SaveIcon,
	TrashIcon,
	XIcon
} from "lucide-react";
import React, { useEffect } from "react";

import { SearchCombobox } from "@/components/search-combobox";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { Account } from "@/lib/api/accounts";
import { ApiRoutes } from "@/lib/routes";
import { formatPhoneNumber } from "@/lib/utils";
import axios from "axios";
import { DeleteDialog, EmployeesTable, OrdersTable, SearchBar } from "./components";
import { useEmployeeMutations, useEmployeeOrders, useEmployees } from "./hooks";

function EmployeesPage() {
	const {
		employees,
		total: employeesTotal,
		error: employeesError,
		loading: employeesLoading,
		page: employeesPage,
		setPage: employeesSetPage,
		search: employeesSearch,
		setSearch: employeesSetSearch,
		handleSearch: employeesHandleSearch,
		handleClearSearch: employeesHandleClearSearch,
		fetchEmployees,
		pageTotal: employeesPageTotal,
	} = useEmployees();

	const {
		selectedEmployee,
		editedEmployee,
		newEmployee,
		mode: _mode,
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
	} = useEmployeeMutations(fetchEmployees);

	const {
		orders,
		total: ordersTotal,
		loading: ordersLoading,
		error: ordersError,
		page: ordersPage,
		setPage: ordersSetPage,
		fetchOrders,
		pageTotal: ordersPageTotal,
	} = useEmployeeOrders(selectedEmployee?.id || null);

	useEffect(() => {
		fetchEmployees();
	}, [employeesPage])

	useEffect(() => {
		fetchOrders();
	}, [ordersPage, selectedEmployee]);

	return (
		<section className='h-screen p-4'>
			<h1 className='text-4xl py-5'>Сотрудники</h1>
			<div className='grid grid-cols-2 gap-10'>
				{/* Список сотрудников */}
				<div className='flex flex-col gap-5'>
					<div className='flex flex-row gap-5'>
						<SearchBar
							search={employeesSearch}
							onSearchChange={employeesSetSearch}
							onSearch={employeesHandleSearch}
							onClear={employeesHandleClearSearch} />
						<Button onClick={handleAdd}><PlusIcon /> Добавить</Button>
					</div>
					<div className='border-1 border-text shadow-md rounded-lg'>

						{employeesLoading ?
							<div className="flex justify-center items-center p-20">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
							</div>
							: employeesError ?
								<p>Ошибка загрузки сотрудников: {employeesError}</p>
								: <EmployeesTable
									employees={employees}
									selectedEmployee={selectedEmployee}
									handleSelectEmployee={handleSelectEmployee}
									page={employeesPage}
									totalPages={employeesPageTotal}
									total={employeesTotal}
									onPageChange={employeesSetPage} />
						}
					</div>
				</div>

				{/* Окно с информацией */}
				<div className={`flex flex-col justify-between rounded-lg p-4 ${selectedEmployee || isAdding ? 'border-1 border-text shadow-md' : ''}`}>
					{selectedEmployee &&
						<>
							<div>
								<div className='flex gap-5 justify-between'>
									<div className='flex gap-2'>
										<h2 className='text-2xl mb-10'>{isEditing ? "Редактирование" : "Информация о сотруднике"}</h2>
										{!isEditing && <Button variant="outline" onClick={handleEdit}><PencilIcon />Редактировать</Button>}
										{isEditing &&
											<>
												<Button variant='outline' onClick={handleCancel}><XIcon />Отмена</Button>
												<Button
													onClick={handleSave}
													disabled={isSaving} >
													{isSaving ?
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />
														:
														<SaveIcon className="mr-2 h-4 w-4" />
													}
													Сохранить
												</Button>
											</>
										}
										<Button variant='destructive' onClick={() => setIsDeleteDialogOpen(true)}><TrashIcon /> Удалить</Button>
									</div>
									<Button variant='ghost' onClick={() => handleSelectEmployee(null)}><XIcon /></Button>
								</div>
								{isEditing ?
									<>
										<Input
											value={editedEmployee.name || ''}
											onChange={(e) => handleFieldChange('name', e.target.value)}
											placeholder="Имя"
											className='md:text-4xl py-6' />
										<SearchCombobox<Account>
											placeholder="Начните вводить логин"
											onSearch={async (query) =>
												await axios.get(ApiRoutes.getAccountsURL(), {
													params: { login: query, limit: 10 },
													withCredentials: true,
												}).then(r => r.data.accounts)
											}
											onSelect={(a: Account) => handleFieldChange('account_login', a?.login ?? undefined)}
											getLabel={(item) => item.login}
											renderOption={(item) => item.login} />
									</>
									:
									<h2 className='text-4xl text-pretty'>{selectedEmployee.name} {selectedEmployee.account_login ? `(${selectedEmployee.account_login})` : ""}</h2>}
								<h2 className='text-lg opacity-50 mb-3'>{selectedEmployee.id}</h2>
								{isEditing ?
									<Input
										value={editedEmployee.phone || ''}
										onChange={(e) => handleFieldChange('phone', e.target.value)}
										placeholder="Телефон"
										className='md:text-3xl py-5' />
									:
									<h2 className='text-3xl'><a href={`tel:${formatPhoneNumber(selectedEmployee.phone)}`}>{formatPhoneNumber(selectedEmployee.phone)}</a></h2>}
								<Separator className='my-5' />
								<h2 className='text-2xl my-3'>Заказы</h2>
								{ordersLoading ?
									<div className="flex justify-center items-center p-20">
										<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
									</div>
									: ordersError ?
										<p>Ошибка загрузки заказов: {ordersError}</p>
										: <OrdersTable
											orders={orders}
											page={ordersPage}
											totalPages={ordersPageTotal}
											total={ordersTotal}
											onPageChange={ordersSetPage} />
								}
							</div>
						</>
					}

					{isAdding &&
						<>
							<div>
								<div className='flex gap-5'>
									<h2 className='text-2xl mb-10'>Добавление сотрудника</h2>
									<Button variant='destructive' onClick={handleCancel}><XIcon />Отмена</Button>
								</div>
								<div className='flex flex-col gap-5'>
									<Field>
										<FieldLabel htmlFor='input-name' className='text-xl'>
											Имя <span className='text-red-500'>*</span>
										</FieldLabel>
										<Input
											required
											id='input-name'
											value={newEmployee.name || ''}
											onChange={(e) => handleFieldChange('name', e.target.value)}
											placeholder="Имя"
											className='md:text-xl py-6' />
									</Field>
									<Field>
										<FieldLabel htmlFor='input-name' className='text-xl'>
											Номер телефона <span className='text-red-500'>*</span>
										</FieldLabel>
										<Input
											required
											id='input-phone'
											value={newEmployee.phone || ''}
											onChange={(e) => handleFieldChange('phone', e.target.value)}
											placeholder="Номер телефона"
											className='md:text-xl py-5'
										/>
									</Field>
								</div>
							</div>
							<div className='flex gap-2 h-fit'>
								<Button
									onClick={handleSave}
									disabled={isSaving}>
									{isSaving ?
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										:
										<SaveIcon className="mr-2 h-4 w-4" />}
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
				selectedEmployee={selectedEmployee} />
		</section>
	)
}

export const Component = React.memo(EmployeesPage);
