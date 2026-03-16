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
import { displayRole, type Account } from "@/lib/api/accounts";
import { ChevronLeft, ChevronRight, Loader2, SearchIcon, XIcon } from "lucide-react";
import { ACCOUNTS_PAGE_LIMIT } from "./hooks";

// Пустые строчки для заполнения таблицы сотрудников
const AccountEmptyRows = ({ count, startIndex }: { count: number; startIndex: number }) => (
	<>
		{Array.from({ length: count }).map((_, index) => (
			<TableRow
				key={`empty-${index}`}
				className={`${(startIndex + index) % 2 !== 0 ? "bg-muted/30" : ""}`} >
				<TableCell colSpan={2} className="opacity-0">—</TableCell>
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
				className={`cursor-pointer transition-opacity ${isFirstPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70' }`} />
			<p>{page} из {total}</p>
			<ChevronRight
				onClick={() => onPageChange(page + 1)}
				className={`cursor-pointer transition-opacity ${isLastPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'}`} />
		</div>
	);
};

const DeleteDialog = ({ isDeleteDialogOpen, setIsDeleteDialogOpen, isDeleting, handleDelete, selectedAccount }: {
	isDeleteDialogOpen: boolean;
	setIsDeleteDialogOpen: (value: boolean) => void;
	isDeleting: boolean;
	handleDelete: () => void;
	selectedAccount: Account | null;
}) => (
	<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Подтверждение удаления</DialogTitle>
				<DialogDescription>
					Вы уверены, что хотите удалить аккаунт {selectedAccount?.login}?
					Это действие нельзя отменить.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<Button
					variant="outline"
					onClick={() => setIsDeleteDialogOpen(false)}
					disabled={isDeleting} >
					Отмена
				</Button>
				<Button
					variant="destructive"
					onClick={handleDelete}
					disabled={isDeleting} >
					{isDeleting ?
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Удаление...
						</>
						:
						"Удалить"}
				</Button>
			</DialogFooter>
		</DialogContent>
	</Dialog>
)

const AccountsTable = ({ accounts, selectedAccount, handleSelectAccount, page, totalPages, total, onPageChange }: {
	accounts: Account[];
	selectedAccount: Account | null;
	handleSelectAccount: (account: Account) => void;
	page: number;
	totalPages: number;
	total: number;
	onPageChange: (page: number) => void;
}) => (
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead className="pl-5">Логин</TableHead>
				<TableHead>Роль</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{accounts.map((account, i) =>
				<TableRow onClick={() => handleSelectAccount(account)} key={account.login} className={`${i % 2 === 0 ? "bg-muted/30" : ""} ${selectedAccount && account.login === selectedAccount.login ? "bg-accent/90 hover:bg-accent text-background" : ""} cursor-pointer`}>
					<TableCell className='pl-5 max-w-[200px] truncate'>{account.login}</TableCell>
					<TableCell className='max-w-[100px] truncate'>{displayRole(account.role)}</TableCell>
				</TableRow>)}
			<AccountEmptyRows count={ACCOUNTS_PAGE_LIMIT - accounts.length} startIndex={accounts.length - 1} />
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell className='pl-5'>Найдено аккаунтов: {total}</TableCell>
				<TableCell>
					{totalPages > 1 && <Pagination page={page} total={totalPages} onPageChange={onPageChange} />}
				</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
)

export { AccountsTable, DeleteDialog, SearchBar };
