import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/store";
import { login, Login, type Account } from "@/lib/api/accounts";
import type { Employee } from "@/lib/api/employees";
import { AppRoutes } from "@/lib/routes";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignIn() {
	const [loginInput, setLogin] = useState("");
	const [passwordInput, setPassword] = useState("");
	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const onSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();
		Login(loginInput, passwordInput)
			.then((resp) => {
				const body = resp.data.account as { account: Account, employee: Employee };
				dispatch(login(body));
				navigate(AppRoutes.getDashboardURL("/app"));
			}).catch((err) => {
				console.log(err);
			})
	};

	return (
		<>
			<div className='max-w-sm flex flex-col mx-auto py-10'>
				<h1 className='text-2xl text-center'>Вход</h1>
				<form onSubmit={onSubmit}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor='login-input'>Логин</FieldLabel>
							<Input
								id='login-input'
								type='text'
								value={loginInput}
								onChange={(e) => setLogin(e.target.value)}
								placeholder='Логин'
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor='password-input'>Пароль</FieldLabel>
							<Input
								id='password-input'
								type='password'
								value={passwordInput}
								onChange={(e) => setPassword(e.target.value)}
								placeholder='Пароль'
								required
							/>
						</Field>
						<Button size='lg' type='submit' className='mx-auto text-xl'>Войти</Button>
					</FieldGroup>
				</form>
			</div>
		</>
	)
}

export const Component = React.memo(SignIn);
