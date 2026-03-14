import '@/app/index.css'
import { router } from '@/app/router'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

const root = document.getElementById('root')!

createRoot(root).render(
	<RouterProvider router={router} />
)
