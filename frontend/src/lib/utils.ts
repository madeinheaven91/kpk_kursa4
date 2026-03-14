import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phoneNumber: string) {
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
