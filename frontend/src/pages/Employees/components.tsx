import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from "@/components/ui/table";
import type { Employee } from "@/lib/api/employees";
import { OrdersToRepr, StatusClass } from "@/lib/api/orders";
import { formatPhoneNumber } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, SearchIcon, XIcon } from "lucide-react";
import { EMPLOYEE_PAGE_LIMIT, ORDER_PAGE_LIMIT, type Order } from "./hooks";

// Пустые строчки для заполнения таблицы сотрудников
const EmployeeEmptyRows = ({ count, startIndex }: { count: number; startIndex: number }) => (
	<>
		{Array.from({ length: count }).map((_, index) => (
			<TableRow
				key={`empty-${index}`}
				className={`${(startIndex + index) % 2 !== 0 ? "bg-muted/30" : ""}`}
			>
				<TableCell colSpan={3} className="opacity-0">—</TableCell>
			</TableRow>
		))}
	</>
)

const SearchBar = ({ search, onSearchChange, onSearch, onClear }: {
	search: string;
	onSearchChange: (value: string) => void;
	onSearch: () => void;
	onClear: () => void;
}) => (
	<ButtonGroup className='w-full'>
		<Input
			placeholder="Поиск по имени"
			value={search}
			onChange={(e) => onSearchChange(e.target.value)}
			onKeyDown={(e) => e.key === 'Enter' && onSearch()}
		/>
		<Button variant='outline' onClick={onClear}><XIcon /></Button>
		<Button variant='outline' onClick={onSearch}><SearchIcon /></Button>
	</ButtonGroup>
);

const Pagination = ({ page, total, onPageChange }: {
	page: number;
	total: number;
	onPageChange: (page: number) => void
}) => {
	const isFirstPage = page <= 1;
	const isLastPage = page >= total;

	return (
		<div className='flex justify-center gap-10 items-center'>
			<ChevronLeft
				onClick={() => onPageChange(page - 1)}
				className={`cursor-pointer transition-opacity ${isFirstPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'
					}`}
			/>
			<p>{page} из {total}</p>
			<ChevronRight
				onClick={() => onPageChange(page + 1)}
				className={`cursor-pointer transition-opacity ${isLastPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'
					}`}
			/>
		</div>
	);
};

const DeleteDialog = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, isDeleting, handleDelete, selectedEmployee }: {
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (value: boolean) => void;
	isDeleting: boolean;
	handleDelete: () => void;
	selectedEmployee: Employee | null;
}) => (
	<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogDescription>
					Вы уверены, что хотите удалить сотрудника {selectedEmployee?.name}?
					Это действие нельзя отменить.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="outline"
					onClick={() => setIsDeleteDialogOpen(false)}
					disabled={isDeleting}
				>
					Отмена
				</Button>
				<Button
					variant="destructive"
					onClick={handleDelete}
					disabled={isDeleting}
				>
					{isDeleting ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Удаление...
						</>
					) : (
						"Удалить"
					)}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
)

const EmployeesTable = ({ employees, selectedEmployee, handleSelectEmployee, page, totalPages, total, onPageChange }: {
	employees: Employee[];
	selectedEmployee: Employee | null;
	handleSelectEmployee: (employee: Employee) => void;
	page: number;
	totalPages: number;
	total: number;
	onPageChange: (page: number) => void;
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead className="pl-5">Имя</TableHead>
				<TableHead>Номер телефона</TableHead>
				<TableHead>Аккаунт</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{employees.map((employee, i) =>
				<TableRow onClick={() => handleSelectEmployee(employee)} key={employee.id} className={`${i % 2 === 0 ? "bg-muted/30" : ""} ${selectedEmployee && employee.id === selectedEmployee.id ? "bg-accent/90 hover:bg-accent text-background" : ""} cursor-pointer`}>
					<TableCell className='pl-5 max-w-[200px] truncate'>{employee.name}</TableCell>
					<TableCell className='max-w-[100px] truncate'><a href={`tel:${formatPhoneNumber(employee.phone)}`}>{formatPhoneNumber(employee.phone)}</a></TableCell>
					{employee.account_login ?
						<TableCell className='max-w-[200px] truncate'>{employee.account_login}</TableCell>
						:
						<TableCell className='opacity-50'>Нет аккаунта</TableCell>}
				</TableRow>
			)}
			<EmployeeEmptyRows count={EMPLOYEE_PAGE_LIMIT - employees.length} startIndex={employees.length - 1} />
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colSpan={2} className='pl-5'>Найдено сотрудников: {total}</TableCell>
				<TableCell>
					{totalPages > 1 &&
						<Pagination page={page} total={totalPages} onPageChange={onPageChange} />}
				</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
)

// Пустые строчки для заполнения таблицы заказов
const OrderEmptyRows = ({ count, startIndex }: { count: number; startIndex: number }) => (
	<>
		{Array.from({ length: count }).map((_, index) => (
			<TableRow
				key={`empty-${index}`}
				className={`${(startIndex + index) % 2 !== 0 ? "bg-muted/30" : ""}`}
			>
				<TableCell colSpan={3} className="opacity-0">—</TableCell>
			</TableRow>
		))}
	</>
);

const OrdersTable = ({
	orders,
	page,
	totalPages,
	total,
	onPageChange
}: {
	orders: Order[],
	page: number,
	totalPages: number,
	total: number,
	onPageChange: (page: number) => void
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead className="pl-5">Дата</TableHead>
				<TableHead>Время</TableHead>
				<TableHead>Длительность</TableHead>
				<TableHead>Адрес</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{OrdersToRepr(orders).map((order, i) =>
				<TableRow key={order.id} className={`${i % 2 === 0 ? "bg-muted/30" : ""} ${order.status === "ongoing" ? "bg-accent/50 hover:bg-accent/70 text-background" : ""} cursor-pointer`}>
					<TableCell className={`pl-5 max-w-[200px] truncate ${StatusClass(order.status)}`}>{order.date}</TableCell>
					<TableCell className={`max-w-[100px] truncate ${StatusClass(order.status)}`}>{order.time}</TableCell>
					<TableCell className={`max-w-[100px] truncate ${StatusClass(order.status)}`}>{order.duration}</TableCell>
					<TableCell className={`max-w-[100px] truncate ${StatusClass(order.status)}`}>{order.address}</TableCell>
				</TableRow>
			)}
			<OrderEmptyRows count={ORDER_PAGE_LIMIT - orders.length} startIndex={orders.length - 1} />
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colSpan={3} className='pl-5'>Всего заказов: {total}</TableCell>
				<TableCell>
					{totalPages > 1 &&
						<Pagination page={page} total={totalPages} onPageChange={onPageChange} />}
				</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
)

export { EmployeesTable, DeleteDialog, OrdersTable, SearchBar };
