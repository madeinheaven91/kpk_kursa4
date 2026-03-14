import React from "react";
import { router } from "./router";
import { RouterProvider } from "react-router-dom";

const App = React.memo(function App() {
	return <RouterProvider router={router} />
})

export default App;
