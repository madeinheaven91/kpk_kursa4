import { EmptyRows } from "@/components/empty-rows";
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
import type { Client } from "@/lib/api/clients";
import { OrdersToRepr, StatusClass } from "@/lib/api/orders";
import { formatPhoneNumber } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Loader2, SearchIcon, XIcon } from "lucide-react";
import { CLIENT_PAGE_LIMIT, ORDER_PAGE_LIMIT, type Order } from "./hooks";

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

const DeleteDialog = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, isDeleting, handleDelete, selectedClient }: {
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (value: boolean) => void;
	isDeleting: boolean;
	handleDelete: () => void;
	selectedClient: Client | null;
}) => (
	<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogDescription>
					Вы уверены, что хотите удалить клиента {selectedClient?.name}?
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

const ClientsTable = ({ clients, selectedClient, handleSelectClient, page, totalPages, total, onPageChange }: {
	clients: Client[];
	selectedClient: Client | null;
	handleSelectClient: (client: Client) => void;
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
				<TableHead>Заметки</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{clients.map((client, i) =>
				<TableRow onClick={() => handleSelectClient(client)} key={client.id} className={`${i % 2 === 0 ? "bg-muted/30" : ""} ${selectedClient && client.id === selectedClient.id ? "bg-accent/90 hover:bg-accent text-background" : ""} cursor-pointer`}>
					<TableCell className='pl-5 max-w-[200px] truncate'>{client.name}</TableCell>
					<TableCell className='max-w-[100px] truncate'><a href={`tel:${formatPhoneNumber(client.phone)}`}>{formatPhoneNumber(client.phone)}</a></TableCell>
					{client.description ?
						<TableCell className='max-w-[200px] truncate'>{client.description}</TableCell>
						:
						<TableCell className='opacity-50'>Нет заметок</TableCell>}
				</TableRow>
			)}
			<EmptyRows count={CLIENT_PAGE_LIMIT - clients.length} startIndex={clients.length - 1} colSpan={3} />
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colSpan={2} className='pl-5'>Найдено клиентов: {total}</TableCell>
				<TableCell>
					{totalPages > 1 &&
						<Pagination page={page} total={totalPages} onPageChange={onPageChange} />}
				</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
)

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
			<EmptyRows count={ORDER_PAGE_LIMIT - orders.length} startIndex={orders.length - 1} colSpan={3} />
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

export { ClientsTable, DeleteDialog, OrdersTable, SearchBar };
