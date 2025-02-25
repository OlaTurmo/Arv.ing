
// THIS FILE IS AUTOGENERATED WHEN PAGES ARE UPDATED
import { lazy } from "react";
import { RouteObject } from "react-router";


import { UserGuard } from "app";


const App = lazy(() => import("./pages/App.tsx"));
const Cookies = lazy(() => import("./pages/Cookies.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Documents = lazy(() => import("./pages/Documents.tsx"));
const EstateSetup = lazy(() => import("./pages/EstateSetup.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Files = lazy(() => import("./pages/Files.tsx"));
const Invitations = lazy(() => import("./pages/Invitations.tsx"));
const Kontakt = lazy(() => import("./pages/Kontakt.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Logout = lazy(() => import("./pages/Logout.tsx"));
const Personvern = lazy(() => import("./pages/Personvern.tsx"));
const Priser = lazy(() => import("./pages/Priser.tsx"));
const SlikFungererDet = lazy(() => import("./pages/SlikFungererDet.tsx"));
const Transactions = lazy(() => import("./pages/Transactions.tsx"));
const Vilkar = lazy(() => import("./pages/Vilkar.tsx"));

export const userRoutes: RouteObject[] = [

	{ path: "/", element: <App />},
	{ path: "/cookies", element: <Cookies />},
	{ path: "/dashboard", element: <UserGuard><Dashboard /></UserGuard>},
	{ path: "/documents", element: <UserGuard><Documents /></UserGuard>},
	{ path: "/estate-setup", element: <UserGuard><EstateSetup /></UserGuard>},
	{ path: "/estatesetup", element: <UserGuard><EstateSetup /></UserGuard>},
	{ path: "/faq", element: <FAQ />},
	{ path: "/files", element: <UserGuard><Files /></UserGuard>},
	{ path: "/invitations", element: <UserGuard><Invitations /></UserGuard>},
	{ path: "/kontakt", element: <UserGuard><Kontakt /></UserGuard>},
	{ path: "/login", element: <Login />},
	{ path: "/logout", element: <UserGuard><Logout /></UserGuard>},
	{ path: "/personvern", element: <Personvern />},
	{ path: "/priser", element: <Priser />},
	{ path: "/slik-fungerer-det", element: <SlikFungererDet />},
	{ path: "/slikfungererdet", element: <SlikFungererDet />},
	{ path: "/transactions", element: <UserGuard><Transactions /></UserGuard>},
	{ path: "/vilkar", element: <Vilkar />},

];
