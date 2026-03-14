import {
	Loader2,
	PencilIcon,
	PlusIcon,
	SaveIcon,
	TrashIcon,
	XIcon
} from "lucide-react";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatPhoneNumber } from "@/lib/utils";
import { ClientsTable, DeleteDialog, OrdersTable, SearchBar } from "./components";
import { useClientMutations, useClientOrders, useClients } from "./hooks";

function ClientsPage() {
	const {
		clients,
		total: clientsTotal,
		error: clientsError,
		loading: clientsLoading,
		page: clientsPage,
		setPage: clientsSetPage,
		search: clientsSearch,
		setSearch: clientsSetSearch,
		handleSearch: clientsHandleSearch,
		handleClearSearch: clientsHandleClearSearch,
		fetchClients,
		pageTotal: clientsPageTotal,
	} = useClients();

	const {
		selectedClient,
		editedClient,
		newClient,
		mode: _mode,
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
	} = useClientMutations(fetchClients);

	const {
		orders,
		total: ordersTotal,
		loading: ordersLoading,
		error: ordersError,
		page: ordersPage,
		setPage: ordersSetPage,
		fetchOrders,
		pageTotal: ordersPageTotal,
	} = useClientOrders(selectedClient?.id || null);

	useEffect(() => {
		fetchClients();
	}, [clientsPage])

	useEffect(() => {
		fetchOrders();
	}, [ordersPage, selectedClient]);

	return (
		<section className='h-screen p-4'>
			<h1 className='text-4xl py-5'>Клиенты</h1>
			<div className='grid grid-cols-2 gap-10'>
				{/* Список клиентов */}
				<div className='flex flex-col gap-5'>
					<div className='flex flex-row gap-5'>
						<SearchBar
							search={clientsSearch}
							onSearchChange={clientsSetSearch}
							onSearch={clientsHandleSearch}
							onClear={clientsHandleClearSearch} />
						<Button onClick={handleAdd}><PlusIcon /> Добавить</Button>
					</div>
					<div className='border-1 border-text shadow-md rounded-lg'>

						{clientsLoading ?
							<div className="flex justify-center items-center p-20">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
							</div>
							: clientsError ?
								<p>Ошибка загрузки клиентов: {clientsError}</p>
								: <ClientsTable
									clients={clients}
									selectedClient={selectedClient}
									handleSelectClient={handleSelectClient}
									page={clientsPage}
									totalPages={clientsPageTotal}
									total={clientsTotal}
									onPageChange={clientsSetPage}
								/>
						}
					</div>
				</div>

				{/* Окно с информацией */}
				<div className={`flex flex-col justify-between rounded-lg p-4 ${selectedClient || isAdding ? 'border-1 border-text shadow-md' : ''}`}>
					{selectedClient &&
						<>
							<div>
								<div className='flex gap-5 justify-between'>
									<div className='flex gap-2'>
										<h2 className='text-2xl mb-10'>{isEditing ? "Редактирование" : "Информация о клиенте"}</h2>
										{!isEditing && <Button variant="outline" onClick={handleEdit}><PencilIcon />Редактировать</Button>}
										{isEditing &&
											<>
												<Button variant='outline' onClick={handleCancel}><XIcon />Отмена</Button>
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
											</>
										}
										<Button variant='destructive' onClick={() => setIsDeleteDialogOpen(true)}><TrashIcon /> Удалить</Button>
									</div>
									<Button variant='ghost' onClick={() => handleSelectClient(null)}><XIcon /></Button>
								</div>
								{isEditing ?
									<Input
										value={editedClient.name || ''}
										onChange={(e) => handleFieldChange('name', e.target.value)}
										placeholder="Имя"
										className='md:text-4xl py-6'
									/>
									:
									<h2 className='text-4xl text-pretty'>{selectedClient.name}</h2>}
								<h2 className='text-lg opacity-50 mb-3'>{selectedClient.id}</h2>
								{isEditing ?
									<Input
										value={editedClient.phone || ''}
										onChange={(e) => handleFieldChange('phone', e.target.value)}
										placeholder="Телефон"
										className='md:text-3xl py-5'
									/>
									:
									<h2 className='text-3xl'><a href={`tel:${formatPhoneNumber(selectedClient.phone)}`}>{formatPhoneNumber(selectedClient.phone)}</a></h2>}
								<Separator className='my-5' />
								<h2 className='text-2xl mb-2'>Заметки</h2>
								{isEditing ?
									<Textarea
										value={editedClient.description || ''}
										onChange={(e) => handleFieldChange('description', e.target.value)}
										placeholder="Заметки"
										rows={4}
										className='md:text-xl p-3 mb-3'
									/>
									: (

										selectedClient.description ?
											<h2 className='text-xl whitespace-pre-line'>{selectedClient.description}</h2>
											:
											<h2 className='text-xl opacity-50'>Нет заметок</h2>

									)}
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
											onPageChange={ordersSetPage}
										/>
								}
							</div>
						</>
					}

					{isAdding &&
						<>
							<div>
								<div className='flex gap-5'>
									<h2 className='text-2xl mb-10'>Добавление клиента</h2>
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
											value={newClient.name || ''}
											onChange={(e) => handleFieldChange('name', e.target.value)}
											placeholder="Имя"
											className='md:text-xl py-6'
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor='input-name' className='text-xl'>
											Номер телефона <span className='text-red-500'>*</span>
										</FieldLabel>
										<Input
											required
											id='input-phone'
											value={newClient.phone || ''}
											onChange={(e) => handleFieldChange('phone', e.target.value)}
											placeholder="Номер телефона"
											className='md:text-xl py-5'
										/>
									</Field>
									<Field>
										<FieldLabel htmlFor='input-desc' className='text-xl'>
											Заметки
										</FieldLabel>
										<Textarea
											id='input-desc'
											value={newClient.description || ''}
											onChange={(e) => handleFieldChange('description', e.target.value)}
											placeholder="Заметки"
											rows={4}
											className='md:text-xl p-3 mb-3'
										/>
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
				selectedClient={selectedClient} />
		</section>
	)
}

export const Component = React.memo(ClientsPage);
