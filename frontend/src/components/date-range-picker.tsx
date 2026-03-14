import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import * as React from "react"
import { type DateRange } from "react-day-picker"

export function DateRangePicker({
	className,
	date,
	setDate,
}: React.HTMLAttributes<HTMLDivElement> & {
	date?: DateRange | undefined
    setDate: (range: DateRange | undefined) => void
}) {
	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full justify-start text-left font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "dd.MM.yy")} -{" "}
									{format(date.to, "dd.MM.yy")}
								</>
							) : (
								format(date.from, "dd.MM.yy")
							)
						) : (
							<span>Выберите дату</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						locale={ru}
						defaultMonth={date?.from}
						selected={date}
						onSelect={setDate}
						numberOfMonths={2}
						showOutsideDays={false}
					/>
				</PopoverContent>
			</Popover>
		</div>
	)
}
