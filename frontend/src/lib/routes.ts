export abstract class AppRoutes {
	public static getRootURL = () => "/";
	public static getSignInURL = () => "/login";
    public static getDashboardURL = (prefix: string = "", withPrefix: boolean = true) => `${AppRoutes._prefix(prefix, withPrefix)}/dashboard`;
    public static getMeURL = (prefix: string = "", withPrefix: boolean = true) => `${AppRoutes._prefix(prefix, withPrefix)}/me`;
    public static getClientsURL = (prefix: string = "", withPrefix: boolean = true) => `${AppRoutes._prefix(prefix, withPrefix)}/clients`;
    public static getOrdersURL = (prefix: string = "", withPrefix: boolean = true) => `${AppRoutes._prefix(prefix, withPrefix)}/orders`;
    public static getEmployeesURL = (prefix: string = "", withPrefix: boolean = true) => `${AppRoutes._prefix(prefix, withPrefix)}/employees`;
    public static getAccountsURL = (prefix: string = "", withPrefix: boolean = true) => `${AppRoutes._prefix(prefix, withPrefix)}/accounts`;

	private static readonly _prefix = (prefix: string, withPrefix: boolean) => 
			!withPrefix ? "" : `${prefix}`;
}

export abstract class ApiRoutes {
	private static root = "http://localhost:3000/api/v1"

    public static getRootURL = () => this.root
	public static getLoginURL = () => `${this.root}/login`;
	public static getLogoutURL = () => `${this.root}/logout`;
	public static getRefreshURL = () => `${this.root}/refresh`;
	public static getClientsURL = () => `${this.root}/clients`;
	public static getClientURL = (id: string) => `${this.root}/clients/${id}`;
	public static getEmployeesURL = () => `${this.root}/employees`;
	public static getEmployeeURL = (id: string) => `${this.root}/employees/${id}`;
	public static getOrdersURL = () => `${this.root}/orders`;
	public static getOrderURL = (id: number) => `${this.root}/orders${id}`;
	public static getAccountsURL = () => `${this.root}/accounts`;
	public static getAccountURL = (id: string) => `${this.root}/accounts/${id}`;

	public static getMeURL = () => `${this.root}/me`;
}
