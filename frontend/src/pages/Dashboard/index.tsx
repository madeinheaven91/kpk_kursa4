import type { LayoutContext } from "@/components/layouts/app/Layout";
import { permRoleToNumber } from "@/lib/utils";
import { addDays,  format } from "date-fns";
import { ru } from "date-fns/locale";
import { memo, useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OrderCalendar, OrderHistogram, OrdersTable, useOrders } from "./components";
import { Button } from "@/components/ui/button";


function Dashboard() {
	const auth = useOutletContext<LayoutContext>();
	const account = auth.account!;
	const employee = auth.employee;

	const [date, setDate] = useState<Date | undefined>(new Date());
	const { orders, total, page, setPage, fetchOrders, pageTotal, handleApplyFilter } = useOrders();

	const handleDateSelect = (day: Date | undefined) => {
		setDate(day);
		if (day) {
			handleApplyFilter({ dateRange: { from: day, to: addDays(day, 1), }, employee_id: isAdmin ? undefined : employee?.id });
		} else {
			handleApplyFilter({ dateRange: { from: undefined, to: undefined } });
		}
	};

	useEffect(() => {
		fetchOrders();
	}, [page]);


	const [isAdmin, setIsAdmin] = useState(false);

	return (
		<section className='h-screen p-4'>
			<div className='flex gap-5 items-center'>
			<h1 className='text-4xl py-5'>Главная</h1>
			{ permRoleToNumber(account.role) === 0 ?
					 <></> : employee ?
				<Button onClick={() => setIsAdmin(!isAdmin)}>{
						isAdmin ?
                        "Как менеджер" :
						"Как сотрудник"
					}</Button> : <Button className='bg-secondary text-foreground'>Как менеджер</Button>
			}
			</div>
			<div className='grid grid-rows-2 gap-10'>
				<div className='flex flex-row gap-10'>
					<div>
						<h2 className="text-lg mb-3 font-semibold">Календарь заказов</h2>
						<OrderCalendar 
							employee={employee} 
							isAdmin={isAdmin} 
							selected={date} 
							onSelect={handleDateSelect} />
					</div>
					<div>
						{date && 
							<>
								<h2 className="text-lg mb-3 font-semibold">
									Заказы на {format(date, "d MMMM yyyy", { locale: ru })}
								</h2>
								<OrdersTable
									orders={orders}
									page={page}
									totalPages={pageTotal}
									total={total}
									onPageChange={setPage}
								/>
							</>
						}
					</div>
				</div>
				<div className="flex flex-col gap-2">
					<h2 className="text-lg mb-3 font-semibold">Заказы за последние 12 месяцев</h2>
					<OrderHistogram employee={employee} isAdmin={isAdmin} />
				</div>
			</div>
		</section >
	)
}

export const Component = memo(Dashboard)
