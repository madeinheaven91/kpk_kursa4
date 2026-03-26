import { EmptyRows } from "@/components/empty-rows";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader, TableRow } from "@/components/ui/table";
import { OrdersToRepr, StatusClass, type Order } from "@/lib/api/orders";
import { ChevronDownIcon, ChevronLeft, ChevronRight, Loader2, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import type { FilterParams } from "./hooks";
import { ORDER_PAGE_LIMIT } from "./hooks";
import { SearchCombobox } from "@/components/search-combobox";
import type { Employee, EmployeeRole } from "@/lib/api/employees";
import { ApiRoutes } from "@/lib/routes";
import axios from "axios";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns/format";
import { ru } from "date-fns/locale";
import { useState } from "react";
import { parseISO } from "date-fns";
import { DateRangePicker } from "@/components/date-range-picker";
import type { Client } from "@/lib/api/clients";
import type { DateRange } from "react-day-picker";
import { permRoleToNumber } from "@/lib/utils";
import type { Account } from "@/lib/api/accounts";

const Pagination = ({ page, total, onPageChange }: {
	page: number;
	total: number;
	onPageChange: (page: number) => void;
}) => {
	const isFirstPage = page <= 1;
	const isLastPage = page >= total;
	return (
		<div className='flex justify-center gap-10 items-center'>
			<ChevronLeft
				onClick={() => onPageChange(page - 1)}
				className={`cursor-pointer transition-opacity ${isFirstPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'}`} />
			<p>{page} из {total}</p>
			<ChevronRight
				onClick={() => onPageChange(page + 1)}
				className={`cursor-pointer transition-opacity ${isLastPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'}`} />
		</div>
	);
};

const FilterBar = ({ filter, onApply, onClear }: {
	filter: FilterParams;
	onApply: (f: FilterParams) => void;
	onClear: () => void;
}) => {
	const handleChange = (key: keyof FilterParams, value: string) => {
		const updated = { ...filter };
		(updated as Record<string, string>)[key] = value;
		onApply(updated);
	};

	return (
		<div className='flex flex-wrap gap-3 items-end'>
			<div className='flex w-full gap-3 justify-between'>
				<div className='flex flex-col w-full gap-1'>
					<span className='text-sm opacity-60'>Клиент</span>
					<SearchCombobox<Client>
						query=""
						placeholder="Начните вводить имя"
						onSearch={async (q) => await axios.get(ApiRoutes.getClientsURL(), {
								params: { name: q, limit: 10 },
								withCredentials: true,
							}).then(r => r.data.clients)
						}
						renderOption={(client: Client) => client.name}
						getLabel={(client: Client) => client.name}
						onSelect={(client: Client) => handleChange('client_id', client?.id ?? '')}
					/>
				</div>
				<div className='flex flex-col w-full gap-1'>
					<span className='text-sm opacity-60'>Сотрудник</span>
					<SearchCombobox<Employee>
						query=""
						placeholder="Начните вводить имя"
						onSearch={async (q) => await axios.get(ApiRoutes.getEmployeesURL(), {
								params: { name: q, limit: 10 },
								withCredentials: true,
							}).then(r => r.data.employees)
						}
						renderOption={(e: Employee) => e.name}
						getLabel={(e: Employee) => e.name}
						onSelect={(e: Employee) => handleChange('employee_id', e?.id ?? '')}
					/>
				</div>
			</div>
			<DateRangePicker
				date={filter.dateRange ?? undefined}
				setDate={(range: DateRange | undefined) => onApply({ ...filter, dateRange: range })}
			/>
			<Button variant='outline' onClick={onClear}><XIcon className='mr-1 h-4 w-4' />Сбросить</Button>
		</div>
	);
};

const OrdersTable = ({ orders, selectedOrder, handleSelectOrder, page, totalPages, total, onPageChange, account }: {
	orders: Order[];
	selectedOrder: Order | null;
	handleSelectOrder: (o: Order) => void;
	page: number;
	totalPages: number;
	total: number;
	onPageChange: (page: number) => void;
    account: Account;
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead className="pl-5">Дата</TableHead>
				<TableHead>Время</TableHead>
				<TableHead>Длительность</TableHead>
				<TableHead>Клиент</TableHead>
				<TableHead>Адрес</TableHead>
				{permRoleToNumber(account.role) > 1 && <TableHead>Цена</TableHead>}
			</TableRow>
		</TableHeader>
		<TableBody>
			{OrdersToRepr(orders).map((order, i) => {
				const raw = orders[i];
				const isSelected = selectedOrder?.id === raw.id;
				return (
					<TableRow
						key={order.id}
						onClick={() => handleSelectOrder(raw)}
						className={[
							i % 2 === 0 ? "bg-muted/30" : "",
							order.status === "ongoing" ? "bg-accent/50 hover:bg-accent/70 text-background" : "",
							isSelected ? "bg-accent/90 hover:bg-accent text-background" : "",
							"cursor-pointer"
						].join(" ")}
					>
						<TableCell className={`pl-5 ${StatusClass(order.status)}`}>{order.date}</TableCell>
						<TableCell className={StatusClass(order.status)}>{order.time}</TableCell>
						<TableCell className={StatusClass(order.status)}>{order.duration}</TableCell>
						<TableCell className={`max-w-[140px] truncate ${StatusClass(order.status)}`}>
							{raw.client?.name}
						</TableCell>
						<TableCell className={`max-w-[180px] truncate ${StatusClass(order.status)}`}>{order.address}</TableCell>
						{permRoleToNumber(account.role) > 1 && 
							<TableCell className={`max-w-[180px] truncate ${StatusClass(order.status)}`}>{order.price} Р.</TableCell>
						}
					</TableRow>
				);
			})}
			<EmptyRows count={ORDER_PAGE_LIMIT - orders.length} startIndex={orders.length - 1} colSpan={6} />
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colSpan={4} className='pl-5'>Всего заказов: {total}</TableCell>
				<TableCell colSpan={2}>
					{totalPages > 1 && <Pagination page={page} total={totalPages} onPageChange={onPageChange} />}
				</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
);

const EmployeeRolesEditor = ({ employees, onChange }: {
    employees: EmployeeRole[];
    onChange: (employees: EmployeeRole[]) => void;
}) => {
    const handleAdd = () => onChange([...employees, {} as EmployeeRole]);
	// FIXME remove
    const handleRemove = (i: number) => onChange(employees.filter((_, idx) => idx !== i));
    const handleUpdate = (i: number, field: keyof EmployeeRole, value: any) => {
        const updated = employees.map((e, idx) => idx === i ? { ...e, [field]: value } : e);
        onChange(updated);
		console.log(updated);
    };

    return (
        <div className='flex flex-col gap-2'>
            {employees.map((e, i) => (
                <div key={i} className='flex gap-2 items-center relative z-10'>
                    <SearchCombobox<Employee>
						query={e.employee?.name ?? ''}
                        placeholder="Начните вводить имя сотрудника..."
                        onSearch={async (query) => {
                            const resp = await axios.get(ApiRoutes.getEmployeesURL(), {
                                params: { name: query, limit: 10 },
                                withCredentials: true,
                            });
                            return resp.data.employees;
                        }}
                        renderOption={(emp: Employee) => (
                                <span>{emp.name}</span>
                        )}
                        getLabel={(emp: Employee) => emp.name}
                        onSelect={(emp: Employee) => handleUpdate(i, 'employee', emp)}
						className='w-full'
                    />
					<Input className='w-1/3' value={e.role} onChange={v => handleUpdate(i, 'role', v.target.value)} placeholder="Роль" />
                    <Button variant='ghost' size='icon' onClick={() => handleRemove(i)}>
                        <TrashIcon className='h-4 w-4' />
                    </Button>
                </div>
            ))}
            <Button variant='outline' onClick={handleAdd} className='w-fit'>
                <PlusIcon className='mr-1 h-4 w-4' />Добавить сотрудника
            </Button>
        </div>
    );
};

const DeleteDialog = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, isDeleting, handleDelete, selectedOrder }: {
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (v: boolean) => void;
	isDeleting: boolean;
	handleDelete: () => void;
	selectedOrder: Order | null;
}) => (
	<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogDescription>
					Вы уверены, что хотите удалить заказ №{selectedOrder?.id}?
					Это действие нельзя отменить.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeleting}>
					Отмена
				</Button>
				<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
					{isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Удаление...</> : "Удалить"}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);

const DateTimePicker = ({ value, onChange }: {
    value: string; // "yyyy-MM-ddTHH:mm"
    onChange: (value: string) => void;
}) => {
    const [open, setOpen] = useState(false);

    const date = value ? parseISO(value) : undefined;
    const timeVal = value ? value.slice(11, 16) : "";

    const handleDateChange = (newDate: Date | undefined) => {
        if (!newDate) return;
        const datePart = format(newDate, "yyyy-MM-dd");
        const timePart = timeVal || "00:00";
        onChange(`${datePart}T${timePart}`);
        setOpen(false);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const datePart = date ? format(date, "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd");
        onChange(`${datePart}T${e.target.value}`);
    };

    return (
        <FieldGroup className="flex-row">
            <Field>
                <FieldLabel>Время</FieldLabel>
                <Input
                    type="time"
					step={60}
					lang="ru-RU"
                    value={timeVal}
                    onChange={handleTimeChange}
                    className="w-32 appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden"
                />
            </Field>
            <Field>
                <FieldLabel>Дата</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-36 justify-between font-normal">
                            {date ? format(date, "dd.MM.yy") : "Выберите дату"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
							locale={ru}
                            defaultMonth={date}
                            onSelect={handleDateChange}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
        </FieldGroup>
    );
};

export { DeleteDialog, EmployeeRolesEditor, FilterBar, OrdersTable, Pagination, DateTimePicker };
