import { useEffect, useContext, useState } from 'react'
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

import Footer from "./Footer";
import AuthContext from "./context/AuthContext";
const Layout = () => {
	const { pathname } = useLocation();
	let user = useContext(AuthContext);
	const [nav, setNav] = useState(true);
	useEffect(() => {
		if (pathname.startsWith("/dashboard")) {
			setNav(false);
		} else {
			setNav(true);
		}
	}, [pathname]);

	return (
		<>
			{nav ? (
				<>
					<NavBar />
					<Outlet />
				</>
			) : (
				<Outlet />
			)}
		</>
	);
};

export default Layout