import { Calendar } from "@/components/ui/calendar";
import { ru } from "date-fns/locale";
import React from "react";

function Dashboard() {
	const [date, setDate] = React.useState<Date | undefined>(new Date())

	return (
		<>
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				locale={ru}
				className="rounded-lg border"
			/>
		</>
	)
}

export const Component = React.memo(Dashboard)
