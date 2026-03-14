import axios from "axios";
import { useState } from "react";

interface UseAxiosResult<T> {
	result: T | undefined,
	error: string,
	loading: boolean,
	fetchData: ({ url, method, data, params }: { url: string, method: string, data?: any, params?: any }) => void
}

export function useAxios<T>(): UseAxiosResult<T> {
	const [result, setResult] = useState<T>();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const axiosInstance = axios.create({
		withCredentials: true,
	});

	const fetchData = async ({ url, method, data, params }: { url: string, method: string, data?: any, params?: any }) =>  {
		setLoading(true);

		axiosInstance({ url, method, data, params })
			.then(res => setResult(res.data))
			.catch(err => setError(err))
			.finally(() => setLoading(false));
	}

	return {
		result,
		error,
		loading,
		fetchData
	}
}
