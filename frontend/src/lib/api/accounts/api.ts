import { ApiRoutes } from "@/lib/routes";
import axios, { type AxiosResponse } from "axios";
import type { Account, AccountForm } from "./entity";
import type { Employee } from "../employees";


async function Login(login: string, password: string): Promise<AxiosResponse<any, any>> {
	return axios.post(ApiRoutes.getLoginURL(), {
		"login": login,
		"password": password,
	}, {
		withCredentials: true
	})
}

async function Logout(): Promise<AxiosResponse<any, any>> {
	return axios.get(ApiRoutes.getLogoutURL(), {
		withCredentials: true
	})
}

async function Refresh(): Promise<boolean> {
	return axios.get(ApiRoutes.getRefreshURL(), {
		withCredentials: true
	}).then((resp) => {
		if (resp.status != 204) {
			return false;
		}
		return true;
	}).catch((err) => {
		console.log(err);
		return false;
	});
}

interface MeBody {
	account: Account;
	employee: Employee;
}

async function Me(): Promise<MeBody | null> {
	return axios.get(ApiRoutes.getMeURL(), {
		withCredentials: true,
	}).then((resp) => {
		if (resp.status === 200) {
			let { data } = resp;
			return data as MeBody;
		} else {
			return null;
		}
	}).catch((err) => {
		console.log(err);
		return null;
	});
}

const FetchAccounts = (limit: number = 15, page: number = 1, login: string | null = null) => ({
	url: ApiRoutes.getAccountsURL(), method: "GET", params: {
		limit: limit,
		offset: (page - 1) * limit,
		login: login
	}
})

const AddAccount = (form: AccountForm) => ({
	url: ApiRoutes.getAccountsURL(), method: "POST", data: form,
})

export { AddAccount, FetchAccounts, Login, Logout, Me, Refresh };
