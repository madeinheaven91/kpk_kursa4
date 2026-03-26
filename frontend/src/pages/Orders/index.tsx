import type { LayoutContext } from "@/components/layouts/app/Layout";
import { SearchCombobox } from "@/components/search-combobox";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Client } from "@/lib/api/clients";
import type { EmployeeRole } from "@/lib/api/employees";
import { OrdersToRepr } from "@/lib/api/orders";
import { ApiRoutes } from "@/lib/routes";
import { permRoleToNumber } from "@/lib/utils";
import axios from "axios";
import {
	Loader2,
	PencilIcon,
	PlusIcon,
	SaveIcon,
	TrashIcon,
	XIcon,
} from "lucide-react";
import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { DateTimePicker, DeleteDialog, EmployeeRolesEditor, FilterBar, OrdersTable } from "./components";
import { useOrderMutations, useOrders } from "./hooks";

function OrdersPage() {
	const auth = useOutletContext<LayoutContext>();
	const account = auth.account!;
	const {
		orders,
		total,
		error,
		loading,
		page,
		setPage,
		filter,
		fetchOrders,
		handleApplyFilter,
		handleClearFilter,
		pageTotal,
	} = useOrders();

	const {
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
	} = useOrderMutations(fetchOrders);

	useEffect(() => {
		fetchOrders();
	}, [page]);

	// Helpers
	const repr = selectedOrder ? OrdersToRepr([selectedOrder])[0] : null;

	return (
		<section className='h-screen p-4'>
			<h1 className='text-4xl py-5'>Заказы</h1>
			<div className='grid grid-cols-2 gap-10'>
				{/* Таблица заказов */}
				<div className='flex flex-col gap-5'>
					<div className='flex flex-row gap-5 items-end justify-between align-baseline'>
						<FilterBar filter={filter} onApply={handleApplyFilter} onClear={handleClearFilter} />
						{permRoleToNumber(auth.account?.role ?? "employee") > 0 && <Button onClick={handleAdd}><PlusIcon /> Добавить</Button>}
					</div>
					<div className='border-1 border-text shadow-md rounded-lg'>
						{loading ?
							<div className="flex justify-center items-center p-20">
								<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
							</div>
							: error ?
								<p>Ошибка загрузки заказов: {error}</p>
								:
								<OrdersTable
									orders={orders}
									selectedOrder={selectedOrder}
									handleSelectOrder={handleSelectOrder}
									page={page}
									totalPages={pageTotal}
									total={total}
									onPageChange={setPage}
									account={account} />
						}
					</div>
				</div>

				{/* Информация о заказе */}
				<div className={`flex flex-col justify-between rounded-lg p-4 ${selectedOrder || isAdding ? 'border-1 border-text shadow-md' : ''}`}>
					{selectedOrder && repr && (
						<>
							<div>
								<div className='flex gap-5 justify-between'>
									<div className='flex gap-2 flex-wrap'>
										<h2 className='text-2xl mb-10'>{isEditing ? "Редактирование" : "Информация о заказе"}</h2>
										{!isEditing &&
											permRoleToNumber(account.role) > 0 &&
											<Button variant="outline" onClick={handleEdit}><PencilIcon />Редактировать</Button>
										}
										{isEditing &&
											permRoleToNumber(account.role) > 0 &&
											<>
												<Button variant='outline' onClick={handleCancel}><XIcon />Отмена</Button>
												<Button onClick={handleSave} disabled={isSaving}>
													{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SaveIcon className="mr-2 h-4 w-4" />}
													Сохранить
												</Button>
											</>
										}
										{permRoleToNumber(account.role) > 0 &&
											<Button variant='destructive' onClick={() => setIsDeleteDialogOpen(true)}><TrashIcon /> Удалить</Button>
										}
									</div>
									<Button variant='ghost' onClick={() => handleSelectOrder(null)}><XIcon /></Button>
								</div>

								{/* Order number + status badge */}
								<div className='flex items-center gap-3 mb-1'>
									<h2 className='text-3xl font-bold'>Заказ №{selectedOrder.id}</h2>
									<span className={`text-sm px-2 py-0.5 rounded-full border ${repr.status === 'ongoing' ? 'bg-accent/80 text-background border-accent' :
										repr.status === 'done' ? 'opacity-50 border-muted-foreground' :
											'border-muted-foreground'
										}`}>
										{{ upcoming: 'Предстоит', ongoing: 'В процессе', done: 'Завершён' }[repr.status]}
									</span>
								</div>

								{/* Price */}
								{permRoleToNumber(account.role) > 1 &&
								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-1'>Цена</p>
									{isEditing ?
										<div className='flex gap-2 items-center'>
											<Input
												type='text'
												placeholder='Цена'
												value={editedOrder.price ?? ''}
												onChange={e => handleFieldChange('price', e.target.value ? Number(e.target.value) : undefined)}
												className='md:text-xl py-5 w-32' />
											<p className='text-xl'>Р.</p>
										</div>
										:
										<p className='text-2xl'>{selectedOrder.price ? `${selectedOrder.price} р.` : "Не указана"}</p>
									}
								</div>
								}

								{/* Datetime */}
								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-1'>Дата и время</p>
									{isEditing ?
										<Input
											type='datetime-local'
											value={typeof editedOrder.datetime === 'string' ? editedOrder.datetime.replace(' ', 'T').slice(0, 16) : ''}
											onChange={e => handleFieldChange('datetime', e.target.value)}
											className='md:text-xl py-5' />
										:
										<p className={`text-2xl`}>{repr.date} в {repr.time}</p>
									}
								</div>

								{/* Duration */}
								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-1'>Длительность</p>
									{isEditing ?
										<Input
											type='number'
											min={1}
											placeholder='Длительность'
											value={editedOrder.duration ?? ''}
											onChange={e => handleFieldChange('duration', e.target.value ? Number(e.target.value) : undefined)}
											className='md:text-xl py-5 w-32' />
										:
										<p className={`text-xl`}>{repr.duration}</p>
									}
								</div>

								<Separator className='my-4' />

								{/* Client */}
								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-1'>Клиент</p>
									<p className='text-xl'>{selectedOrder.client?.name || <span className='opacity-50'>Не указан</span>}</p>
									{selectedOrder.client && <p className='text-sm opacity-50'>{selectedOrder.client.phone}</p>}
								</div>

								{/* Address */}
								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-1'>Адрес</p>
									{isEditing ?
										<Input
											value={(editedOrder as { address?: string }).address || ''}
											onChange={e => handleFieldChange('address', e.target.value)}
											placeholder="Адрес"
											className='md:text-xl py-5' />
										: <p className={`text-xl`}>{selectedOrder.address}</p>
									}
								</div>

								<Separator className='my-4' />

								{/* Employees */}
								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-2'>Сотрудники</p>
									{isEditing ?
										<EmployeeRolesEditor
											employees={editedOrder.employees || []}
											onChange={v => handleFieldChange('employees', v)} />
										:
										selectedOrder.employees && selectedOrder.employees.length > 0 ?
											<ul className='flex flex-col gap-1'>
												{selectedOrder.employees.map((er: EmployeeRole, i: number) => (
													<li key={i} className='flex gap-2 text-lg'>
														<span>{er.employee.name}</span>
														<span className='opacity-50'>— {er.role}</span>
													</li>
												))}
											</ul>
											: <p className='opacity-50'>Нет сотрудников</p>

									}
								</div>

								<div className='mb-3'>
									<p className='text-sm opacity-60 mb-2'>Заметки</p>
									{isEditing ?
										<Textarea
											value={editedOrder.description || ''}
											onChange={(e) => handleFieldChange('description', e.target.value)}
											placeholder="Заметки"
											rows={4}
											className='md:text-xl p-3 mb-3' />
										:
										selectedOrder.description ?
											<h2 className='text-xl whitespace-pre-line'>{selectedOrder.description}</h2>
											:
											<h2 className='text-xl opacity-50'>Нет заметок</h2>
									}
								</div>

							</div>
						</>
					)}

					{/* ── Add new order ── */}
					{isAdding && (
						<>
							<div>
								<div className='flex gap-5 mb-10'>
									<h2 className='text-2xl'>Добавление заказа</h2>
									<Button variant='destructive' onClick={handleCancel}><XIcon />Отмена</Button>
								</div>
								<div className='flex flex-col gap-5'>
									<Field>
										<FieldLabel className='text-xl'>
											Клиент <span className='text-red-500'>*</span>
										</FieldLabel>
										<SearchCombobox<Client>
											query={''}
											placeholder="Начните вводить имя клиента..."
											onSearch={async (query) => await axios.get(ApiRoutes.getClientsURL(), {
												params: { name: query, limit: 10 },
												withCredentials: true,
											}).then(r => r.data.clients)
											}
											renderOption={(client: Client) => (
												<span>{client.name}</span>
											)}
											getLabel={(client: Client) => client.name}
											onSelect={(client: Client) => handleFieldChange('client_id', client?.id ?? '')} />
									</Field>
									<Field>
										<FieldLabel className='text-xl'>Цена</FieldLabel>
										<Input
											type='text'
											value={newOrder.price ?? ''}
											onChange={e => handleFieldChange('price', e.target.value ? Number(e.target.value) : undefined)}
											placeholder="Цена"
											className='md:text-xl py-6 w-32' />
									</Field>
									<Field>
										<FieldLabel className='text-xl'>
											Дата и время <span className='text-red-500'>*</span>
										</FieldLabel>
										<DateTimePicker
											value={newOrder.datetime || ''}
											onChange={v => handleFieldChange('datetime', v)} />
									</Field>
									<Field>
										<FieldLabel className='text-xl'>Длительность (ч.)</FieldLabel>
										<Input
											type='number'
											min={1}
											value={newOrder.duration ?? ''}
											onChange={e => handleFieldChange('duration', e.target.value ? Number(e.target.value) : undefined)}
											placeholder="Длительность"
											className='md:text-xl py-6 w-32' />
									</Field>
									<Field>
										<FieldLabel className='text-xl'>
											Адрес <span className='text-red-500'>*</span>
										</FieldLabel>
										<Input
											required
											value={newOrder.address || ''}
											onChange={e => handleFieldChange('address', e.target.value)}
											placeholder="Адрес"
											className='md:text-xl py-6' />
									</Field>
									<Field>
										<FieldLabel className='text-xl'>
											Сотрудники <span className='text-red-500'>*</span>
										</FieldLabel>
										<EmployeeRolesEditor
											employees={newOrder.employees || []}
											onChange={v => handleFieldChange('employees', v)} />
									</Field>
									<Textarea
										value={newOrder.description || ''}
										onChange={(e) => handleFieldChange('description', e.target.value)}
										placeholder="Заметки"
										rows={4}
										className='md:text-xl p-3 mb-3' />
								</div>
							</div>
							<div className='flex gap-2 h-fit mt-6'>
								<Button onClick={handleSave} disabled={isSaving}>
									{isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <SaveIcon className="mr-2 h-4 w-4" />}
									Сохранить
								</Button>
							</div>
						</>
					)}
				</div>
			</div>

			<DeleteDialog
				isDeleteDialogOpen={isDeleteDialogOpen}
				setIsDeleteDialogOpen={setIsDeleteDialogOpen}
				isDeleting={isDeleting}
				handleDelete={handleDelete}
				selectedOrder={selectedOrder}
			/>
		</section>
	);
}

export const Component = React.memo(OrdersPage);
