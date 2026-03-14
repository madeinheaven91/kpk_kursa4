import { format, parse } from "date-fns";
import type { Client } from "./clients";
import { ApiRoutes } from "../routes";
import type { DateRange } from "react-day-picker";
import type { EmployeeRole } from "./employees";

type Status = 'upcoming' | 'ongoing' | 'done';

const Status = {
	Upcoming: 'upcoming' as Status,
	Ongoing: 'ongoing' as Status,
	Done: 'done' as Status,
} as const;

interface Order {
	id: number,
	client: Client,
	employees: EmployeeRole[],
	datetime: string,
	duration: number,
	address: string
}

interface OrderRepr {
	id: number,
	date: string,
	time: string,
	duration: string,
	address: string,
	status: Status
}

interface OrdersResponse {
	orders: Order[],
	total: number
}

function OrdersToRepr(orders: Order[]): OrderRepr[] {
	let currentStatus = Status.Upcoming;
	const now = new Date();

	return orders.map(order => {
		const [time, dateStr] = order.datetime.split(' ');
		const orderDatetime = parse(order.datetime, 'HH:mm dd.MM.yyyy', new Date());

		// Determine status based on current state and date comparison
		let status: Status;

		if (currentStatus === Status.Done) {
			// Once passed, all subsequent orders are passed
			status = Status.Done;
		} else {
			let maxBound = new Date(orderDatetime.getTime() + 1000 * 60 * 60 * order.duration); 

			// Compare dates
			if (now > maxBound) {
				status = Status.Done;
				currentStatus = Status.Done; // Future orders will be passed
			} else if (orderDatetime < now && orderDatetime <= maxBound) {
				status = Status.Ongoing;
				currentStatus = Status.Ongoing; // Today found, next could be upcoming/passed
			} else {
				status = Status.Upcoming;
				// Keep currentStatus as Upcoming
			}
		}

		return {
			id: order.id,
			date: dateStr,
			time,
			duration: `${order.duration} ч.`,
			address: order.address,
			status
		};
	});
}

function StatusClass(status: Status) {
    switch (status) {
        case Status.Upcoming:
            return "";
        case Status.Ongoing:
            return "text-background font-bold";
        case Status.Done:
            return "opacity-50";
    }
}

const FetchClientOrders = (limit: number = 5, page: number = 1, clientID: string | null = null) => (
	{
		url: ApiRoutes.getOrdersURL(), method: "GET", params: {
			limit: limit,
			offset: (page - 1) * limit,
			client_id: clientID
		}
	}
)

const FetchEmployeeOrders = (limit: number = 5, page: number = 1, empID: string | null = null) => (
	{
		url: ApiRoutes.getOrdersURL(), method: "GET", params: {
			limit: limit,
			offset: (page - 1) * limit,
			employee_ID: empID
		}
	}
)

interface FilterParams {
	clientID?: string;
	dateRange?: DateRange | null;
	employeeID?: string;
}

const FetchOrdersFiltered = (limit: number = 1, page: number = 1, filter: FilterParams) =>(
		{
			url: ApiRoutes.getOrdersURL(),
			method: "GET",
			params: {
				limit: limit,
				offset: (page - 1) * limit,
				client_id: filter.clientID || undefined,
				start_min: filter.dateRange?.from ? format(filter.dateRange.from, "dd.MM.yyyy") : undefined,
				start_max: filter.dateRange?.to ? format(filter.dateRange.to, "dd.MM.yyyy") : undefined,
				employee_id: filter.employeeID || undefined,
			}
		}
)

export { OrdersToRepr, StatusClass, type Order, type OrderRepr, type OrdersResponse, FetchClientOrders, FetchEmployeeOrders, FetchOrdersFiltered, type FilterParams };
