import { useState, useContext, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo-svg.svg";
import AuthContext from "./context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const NavBar = () => {
	const user = useContext(AuthContext);
	const navigate = useNavigate();
	const [isLoggedIn, setLoggedIn] = useState(false);
	useEffect(() => {
		if (user?.isAuth) {
			setLoggedIn(true);
		} else {
			setLoggedIn(false);
		}
	}, [user]);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const navigation = [
		{ name: "Home", href: "/" },
		{ name: "Search", href: "/search" },
		{ name: "Browse Rentals", href: "/feed" },
	];

	return (
		<>
			<header className="sticky inset-x-0 top-0 z-50">
				<nav
					className={`flex items-center justify-between bg-white p-6 lg:px-8`}
					aria-label="Global"
				>
					<div className="flex lg:flex-1">
						<a href="#" className="-m-1.5 p-1.5">
							<img className="h-10 w-auto" src={logo} alt="Muso" />
						</a>
					</div>
					<div className="flex lg:hidden">
						<button
							type="button"
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
							onClick={() => setMobileMenuOpen(true)}
						>
							<span className="sr-only">Open main menu</span>
							<Bars3Icon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
					<div className="hidden lg:flex lg:gap-x-12">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className={`text-sm font-semibold leading-6 text-bg-primary`}
							>
								{item.name}
							</a>
						))}
					</div>
					<div className="hidden lg:flex lg:flex-1 lg:justify-end">
						{isLoggedIn ? (
							<UserCircleIcon
								className="cursor-pointer w-12 h-12"
								onClick={() => {
									navigate(`/dashboard/${user?.user?.username}`);
								}}
							/>
						) : (
							<>
								<Link
									to={"/register"}
									className={`text-sm font-semibold leading-6 mr-10 text-bg-primary`}
								>
									Sign Up
								</Link>
								<Link
									to={"/login"}
									className={`text-sm font-semibold leading-6 text-bg-primary`}
								>
									Log in <span aria-hidden="true">&rarr;</span>
								</Link>
							</>
						)}
					</div>
				</nav>
				<Dialog
					as="div"
					className="lg:hidden"
					open={mobileMenuOpen}
					onClose={setMobileMenuOpen}
				>
					<div className="fixed inset-0 z-50" />
					<Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
						<div className="flex items-center justify-between">
							<a href="#" className="-m-1.5 p-1.5">
								<span className="sr-only">
									Muso - Instrument rental platform
								</span>
								<img className="h-8 w-auto" src={logo} alt="Muso" />
							</a>
							<button
								type="button"
								className="-m-2.5 rounded-md p-2.5 text-gray-700"
								onClick={() => setMobileMenuOpen(false)}
							>
								<span className="sr-only">Close menu</span>
								<XMarkIcon className="h-6 w-6" aria-hidden="true" />
							</button>
						</div>
						<div className="mt-6 flow-root">
							<div className="-my-6 divide-y divide-gray-500/10">
								<div className="space-y-2 py-6">
									{navigation.map((item) => (
										<a
											key={item.name}
											href={item.href}
											className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
										>
											{item.name}
										</a>
									))}
								</div>
								{isLoggedIn ? (
									<>
										<UserCircleIcon
											className="cursor-pointer w-12 h-12"
											onClick={() => {
												navigate(`/dashboard/${user?.user?.username}`);
											}}
										/>
									</>
								) : (
									<>
										<div className="py-6">
											<a
												href="#"
												className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
											>
												Log in
											</a>
										</div>
										<div className="py-6">
											<a
												href="#"
												className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
											>
												Sign Up
											</a>
										</div>
									</>
								)}
							</div>
						</div>
					</Dialog.Panel>
				</Dialog>
			</header>
			<svg
				id="visual"
				viewBox="0 0 900 40"
				width="100%"
				height="10%"
				xmlns="http://www.w3.org/2000/svg"
				xmlnsXlink="http://www.w3.org/1999/xlink"
				version="1.1"
			>
				<path
					d="M0 40L21.5 37.5C43 35 86 30 128.8 27.2C171.7 24.3 214.3 23.7 257.2 23.8C300 24 343 25 385.8 24.2C428.7 23.3 471.3 20.7 514.2 20.5C557 20.3 600 22.7 642.8 21.8C685.7 21 728.3 17 771.2 16.5C814 16 857 19 878.5 20.5L900 22L900 0L878.5 0C857 0 814 0 771.2 0C728.3 0 685.7 0 642.8 0C600 0 557 0 514.2 0C471.3 0 428.7 0 385.8 0C343 0 300 0 257.2 0C214.3 0 171.7 0 128.8 0C86 0 43 0 21.5 0L0 0Z"
					fill="#ffffff"
				></path>
			</svg>
		</>
	);
};
 
export default NavBar