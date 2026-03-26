import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import type { AccountRole } from "./api/accounts";

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

function formatPhoneNumber(phoneNumber: string) {
	const cleaned = phoneNumber.replace(/\D/g, "");
	const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
	if (match) {
		let result = "";
		if (match[1] == "7") {
			result += "+7";
		} else {
			result += match[1];
		}

		result += ` (${match[2]}) ${match[3]}-${match[4]}`;
		return result;
	}
	return phoneNumber;
}

function formatApiDate(date: Date) {
	return format(date, "dd.MM.yyyy");
}

function permRoleToNumber(role: AccountRole): number {
	switch (role) {
		case "employee":
			return 0;
		case "manager":
			return 1;
		case "admin":
			return 2;
	}
}

export { cn, formatApiDate, formatPhoneNumber, permRoleToNumber };
