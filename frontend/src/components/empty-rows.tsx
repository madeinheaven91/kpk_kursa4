import { TableCell, TableRow } from "./ui/table";

const EmptyRows = ({ count, startIndex, colSpan = 0 }:
	{
		count: number;
		startIndex: number;
		colSpan: number
	}) => (<>
		{Array.from({ length: count }).map((_, index) => (
			<TableRow
				key={`empty-${index}`}
				className={`${(startIndex + index) % 2 !== 0 ? "bg-muted/30" : ""}`}
			>
				<TableCell colSpan={colSpan} className="opacity-0">—</TableCell>
			</TableRow>
		))}
	</>);

export { EmptyRows };
