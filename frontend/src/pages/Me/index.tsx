import type { LayoutContext } from "@/components/layouts/app/Layout";
import { displayRole } from "@/lib/api/accounts";
import { CircleUserRoundIcon } from "lucide-react";
import React from "react";
import { useOutletContext } from "react-router-dom";

function Me() {
	const auth = useOutletContext<LayoutContext>();

	return (
		<section className='h-screen p-4'>
			<h1 className='text-4xl my-5'>Личный кабинет</h1>
			<div className='flex flex-row gap-5'>
				<CircleUserRoundIcon size='64' />
				<div>
					<p className='text-xl'><b>{auth.account!.login}</b></p>
					<p className='text-xl'>{displayRole(auth.account!.role)}</p>
				</div>
			</div>
			<h1 className='text-3xl my-10'>Статистика по заказам</h1>
			<p>Всего заказов:</p>
			<p>Всего часов отработано:</p>
			<p className='bg-primary text-background'>TODO: Поменять пароль</p>
		</section>
	)
}

export const Component = React.memo(Me);
