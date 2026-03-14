import { ApiRoutes } from "../routes";

interface Client {
	id: string;
	name: string;
	phone: string;
	description: string;
}

interface ClientsResponse {
	clients: Client[];
	total: number;
}

const FetchClients = (limit: number = 15, page: number = 1, name: string | null = null) => ({
	url: ApiRoutes.getClientsURL(), method: "GET", params: {
		limit: limit,
		offset: (page - 1) * limit,
		name: name
	}
})


const AddClient = (client: Client) => ({
	url: ApiRoutes.getClientsURL(), method: "POST", data: {
		"name": client.name,
		"phone": client.phone,
	}
})

const DeleteClient = (id: string) => ({ url: ApiRoutes.getClientURL(id), method: "DELETE" })

export { AddClient, DeleteClient, FetchClients, type Client, type ClientsResponse };

