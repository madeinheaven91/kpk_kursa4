import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchComboboxProps<T> {
	/** Fetch suggestions given the current query string */
	onSearch: (query: string) => Promise<T[]>;
	/** How to render each option in the dropdown */
	renderOption: (item: T) => React.ReactNode;
	/** Label shown in the input after selection */
	getLabel: (item: T) => string;
	/** Called when user picks an item */
	onSelect: (item: T) => void;
	placeholder?: string;
	className?: string;
	debounceMs?: number;
	query: string;
}

export function SearchCombobox<T>({
	onSearch,
	renderOption,
	getLabel,
	onSelect,
	placeholder = "Поиск...",
	className = "",
	debounceMs = 300,
	query: q = "",
}: SearchComboboxProps<T>) {
	const [query, setQuery] = useState(q);
	const [results, setResults] = useState<T[]>([]);
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [selected, setSelected] = useState<T | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	const handleInputChange = (value: string) => {
		setQuery(value);
		setSelected(null);

		// Задержка в поиске
		if (debounceRef.current) clearTimeout(debounceRef.current);

		if (!value.trim()) {
			setResults([]);
			setOpen(false);
			return;
		}

		debounceRef.current = setTimeout(async () => {
			setLoading(true);
			try {
				const items = await onSearch(value);
				setResults(items);
				setOpen(true);
			} finally {
				setLoading(false);
			}
		}, debounceMs);
	};

	const handleSelect = (item: T) => {
		setSelected(item);
		setQuery(getLabel(item));
		setOpen(false);
		onSelect(item);
	};

	return (
		<div ref={containerRef} className={`relative ${className}`}>
			<div className="flex gap-2">
				<div className="relative flex-1">
					<Input
						value={query}
						onChange={e => handleInputChange(e.target.value)}
						onFocus={() => results.length > 0 && !selected && setOpen(true)}
						placeholder={placeholder}
						className="py-6 pr-8"
					/>
					{loading && (
						<Loader2 className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin opacity-50" />
					)}
				</div>
			</div>

			{open && results.length > 0 && (
				<ul className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md max-h-60 overflow-y-auto">
					{results.map((item, i) => (
						<li
							key={i}
							onMouseDown={e => e.preventDefault()} // prevent blur before click
							onClick={() => handleSelect(item)}
							className="px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
						>
							{renderOption(item)}
						</li>
					))}
				</ul>
			)}

			{open && !loading && results.length === 0 && query.trim() && (
				<div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md px-3 py-2 text-sm opacity-60">
					Ничего не найдено
				</div>
			)}
		</div>
	);
}
