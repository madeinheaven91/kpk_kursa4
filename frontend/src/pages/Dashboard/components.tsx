import { EmptyRows } from "@/components/empty-rows";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAxios } from "@/hooks/use-axios";
import type { Employee } from "@/lib/api/employees";
import { FetchOrdersFiltered, OrdersToRepr, StatusClass, type FilterParams, type Order, type OrdersResponse } from "@/lib/api/orders";
import { ApiRoutes } from "@/lib/routes";
import { formatApiDate } from "@/lib/utils";
import axios from "axios";
import { addDays, addMonths, endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ORDER_PAGE_LIMIT = 5;

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
				className={`cursor-pointer transition-opacity ${isFirstPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'}`} />
			<p>{page} из {total}</p>
			<ChevronRight
				onClick={() => onPageChange(page + 1)}
				className={`cursor-pointer transition-opacity ${isLastPage ? 'opacity-50 pointer-events-none' : 'hover:opacity-70'}`} />
		</div>
	);
};

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
					<TableCell className={`truncate ${StatusClass(order.status)}`}>{order.address}</TableCell>
				</TableRow>)}
			<EmptyRows count={ORDER_PAGE_LIMIT - orders.length} startIndex={orders.length - 1} colSpan={3} />
		</TableBody>
		<TableFooter>
			<TableRow>
				<TableCell colSpan={3} className='pl-5'>Всего заказов: {total}</TableCell>
				<TableCell>
					{totalPages > 1 && <Pagination page={page} total={totalPages} onPageChange={onPageChange} />}
				</TableCell>
			</TableRow>
		</TableFooter>
	</Table>
)

function useOrders() {
	const { result, error, loading, fetchData } = useAxios<OrdersResponse>();
	const [page, setPage] = useState(1);
	const [filter, setFilter] = useState<FilterParams>({
		dateRange: {
			from: new Date(),
			to: addDays(new Date(), 1),
		}
	});

	const fetchOrders = useCallback(() => {
		fetchData(FetchOrdersFiltered(ORDER_PAGE_LIMIT, page, filter));
	}, [page, filter, fetchData]);

	const handleApplyFilter = useCallback((newFilter: FilterParams) => {
		setFilter(newFilter);
		setPage(1);
		fetchData(FetchOrdersFiltered(ORDER_PAGE_LIMIT, page, newFilter));
	}, [fetchData]);

	return {
		orders: result?.orders || [],
		total: result?.total || 0,
		error,
		loading,
		page,
		setPage,
		fetchOrders,
		handleApplyFilter,
		pageTotal: Math.ceil((result?.total || 0) / ORDER_PAGE_LIMIT),
	};
}

function OrderHistogram({ employee, isAdmin }: {
	employee: Employee | undefined,
	isAdmin: boolean
}) {
	const [monthlyStats, setMonthlyStats] = useState<{ month: string; count: number }[]>([]);
	useEffect(() => {
		const fetchHistogram = async () => {
			const nextMonth = addMonths(new Date(), 1);
			const yearAgo = subMonths(nextMonth, 11);

			let params: { start_min: string; start_max: string, employee_id?: string } = {
				start_min: formatApiDate(startOfMonth(yearAgo)),
				start_max: formatApiDate(endOfMonth(nextMonth)),
			};
			if (!isAdmin) {
				params.employee_id = employee?.id;
			}

			const r = await axios.get(ApiRoutes.getOrdersURL(), {
				params: params,
				withCredentials: true,
			});

			const orders: Order[] = r.data.orders ?? [];

			// Group by "MMM yyyy"
			const countsByMonth = new Map<string, number>();
			for (const order of orders) {
				const datePart = order.datetime.split(" ")[1]; // "24.03.2026"
				const [day, month, year] = datePart.split(".");
				const label = format(new Date(+year, +month - 1, +day), "MMM yyyy", { locale: ru });
				countsByMonth.set(label, (countsByMonth.get(label) ?? 0) + 1);
			}

			// Build ordered array for the chart
			const results = Array.from({ length: 12 }, (_, i) => {
				const month = subMonths(nextMonth, 11 - i);
				const label = format(month, "MMM yyyy", { locale: ru });
				return { month: label, count: countsByMonth.get(label) ?? 0 };
			});

			setMonthlyStats(results);
		};
		fetchHistogram();
	}, [employee, isAdmin]);

	return (
		<ResponsiveContainer height={300} >
			<BarChart data={monthlyStats} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
				<CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
				<XAxis dataKey="month" tick={{ fontSize: 10 }} />
				<YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
				<Tooltip />
				<Bar dataKey="count" name="Заказы" radius={[4, 4, 0, 0]} className="fill-primary" />
			</BarChart>
		</ResponsiveContainer>
	)
}

function OrderCalendar({ employee, isAdmin, selected, onSelect }: {
	employee: Employee | undefined,
	isAdmin: boolean,
	selected: Date | undefined,
	onSelect: any,
}) {
	const [ordersInMonth, setOrdersInMonth] = useState<Order[]>([]);
	const [currentMonth, setCurrentMonth] = useState(new Date());
	
	// Fetch orders for calendar highlighting whenever visible month changes
	useEffect(() => {
		const fetchMonthOrders = async () => {
			let params: { start_min: string; start_max: string, employee_id?: string } = {
				start_min: formatApiDate(startOfMonth(currentMonth)),
				start_max: formatApiDate(endOfMonth(currentMonth)),
			};
			if (!isAdmin) {
				params.employee_id = employee?.id;
			}

			const resp = await axios.get(ApiRoutes.getOrdersURL(), {
				params: params,
				withCredentials: true,
			});
			setOrdersInMonth(resp.data.orders ?? []);
		};
		fetchMonthOrders();
	}, [currentMonth, employee, isAdmin]);

	const orderCountByDate = useMemo(() => {
		const map = new Map<string, number>();
		for (const o of ordersInMonth) {
			const dateStr = o.datetime.split(" ")[1];
			map.set(dateStr, (map.get(dateStr) ?? 0) + 1);
		}
		return map;
	}, [ordersInMonth]);

	const hasOrder1 = (day: Date) => orderCountByDate.get(formatApiDate(day)) === 1;
	const hasOrder2 = (day: Date) => orderCountByDate.get(formatApiDate(day)) === 2;
	const hasOrder3 = (day: Date) => (orderCountByDate.get(formatApiDate(day)) ?? 0) >= 3;
	return (<Calendar
		mode="single"
		selected={selected}
		onSelect={onSelect}
		locale={ru}
		className="rounded-lg border w-fit"
		month={currentMonth}
		onMonthChange={setCurrentMonth}
		modifiers={{ hasOrder1, hasOrder2, hasOrder3 }}
		modifiersClassNames={{
			hasOrder1: "bg-primary/40 text-background",
			hasOrder2: "bg-primary/60 text-background",
			hasOrder3: "bg-primary/80 text-background",
		}}
	/>)
}

export { OrderCalendar, OrderHistogram, OrdersTable, useOrders };
