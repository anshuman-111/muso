import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = () => {
	const { pathname } = useLocation();
	const [nav, setNav] = useState(true);

	// Function to show only Dashboard NavBar
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

export default Layout;
