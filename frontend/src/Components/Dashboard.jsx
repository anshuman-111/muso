import React, { useState, Fragment, useContext } from "react";
import logo from "../assets/logo-svg.svg";
import EditDetails from "./DashComps/EditDetails";
import PostRental from "./DashComps/PostRental";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import AuthContext from "./context/AuthContext";
import { useNavigate } from "react-router-dom";
import AllRentals from "./DashComps/AllRentals";

const Dashboard = () => {
	const nav = useNavigate();
	function classNames(...classes) {
		return classes.filter(Boolean).join(" ");
	}
	const { user, logout } = useContext(AuthContext);

	const [activeTab, setActive] = useState("User Profile");
	const navigation = [
		{
			name: "User Profile",
		},
		{
			name: "Post Rental",
		},
		{
			name: "All Rentals",
		},
	];

	const handleSignOut = () => {
		logout();
		nav("/login");
	};
	const userNavigation = [{ name: "Sign out" }];
	return (
		<>
			<div className="min-h-full">
				<Disclosure as="nav" className="bg-gray-800">
					{({ open }) => (
						<>
							<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-1">
								<div className="flex h-16 items-center justify-between">
									<div className="flex items-center">
										<div className="flex-shrink-0">
											<img
												className="h-10 w-auto invert"
												src={logo}
												alt="Muso"
											/>
										</div>
										<div className="hidden md:block">
											<div className="ml-10 flex items-baseline space-x-4">
												<button
													className="bg-indigo-600 text-white block rounded-md ml-1 px-4 py-2 text-base font-medium"
													onClick={() => nav("/")}
												>
													Home
												</button>
												{navigation.map((item) => (
													<a
														key={item.name}
														className={classNames(
															activeTab === item.name
																? "bg-gray-900 text-white"
																: "text-gray-300 hover:bg-gray-700 hover:text-white",
															"rounded-md px-3 py-2 text-sm font-medium cursor-pointer",
														)}
														aria-current={item.current ? "page" : undefined}
														onClick={() => setActive(item.name)}
													>
														{item.name}
													</a>
												))}
											</div>
										</div>
									</div>
									<div className="hidden md:block">
										<div className="ml-4 flex items-center md:ml-6">
											<button
												type="button"
												className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
											>
												<span className="sr-only">View notifications</span>
											</button>

											{/* Profile dropdown */}
											<Menu as="div" className="relative ml-3">
												<div>
													<Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
														<span className="sr-only">Open user menu</span>
														<UserCircleIcon
															className="w-12 h-12"
															color="white"
														/>
													</Menu.Button>
												</div>
												<Transition
													as={Fragment}
													enter="transition ease-out duration-100"
													enterFrom="transform opacity-0 scale-95"
													enterTo="transform opacity-100 scale-100"
													leave="transition ease-in duration-75"
													leaveFrom="transform opacity-100 scale-100"
													leaveTo="transform opacity-0 scale-95"
												>
													<Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
														{userNavigation.map((item) => (
															<Menu.Item key={item.name}>
																{({ active }) => (
																	<button
																		onClick={handleSignOut}
																		className={classNames(
																			active ? "bg-gray-100" : "",
																			"block px-2 py-2 text-sm text-gray-700 w-full",
																		)}
																	>
																		{item.name}
																	</button>
																)}
															</Menu.Item>
														))}
													</Menu.Items>
												</Transition>
											</Menu>
										</div>
									</div>
									<div className="-mr-2 flex md:hidden">
										{/* Mobile menu button */}
										<Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="sr-only">Open main menu</span>
											{open ? (
												<XMarkIcon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											) : (
												<Bars3Icon
													className="block h-6 w-6"
													aria-hidden="true"
												/>
											)}
										</Disclosure.Button>
									</div>
								</div>
							</div>

							<Disclosure.Panel className="md:hidden">
								<div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
									<button
										className="bg-indigo-600 text-white block rounded-md ml-1 px-4 py-2 text-base font-medium"
										onClick={() => nav("/")}
									>
										Home
									</button>
									{navigation.map((item) => (
										<Disclosure.Button
											key={item.name}
											as="a"
											onClick={() => setActive(item.name)}
											className={classNames(
												item.current
													? "bg-gray-900 text-white"
													: "text-gray-300 hover:bg-gray-700 hover:text-white",
												"block rounded-md px-3 py-2 text-base font-medium",
											)}
											aria-current={item.current ? "page" : undefined}
										>
											{item.name}
										</Disclosure.Button>
									))}
								</div>
								<div className="border-t border-gray-50 pb-3 pt-4">
									<div className="flex items-center px-5">
										<UserCircleIcon className="w-12 h-12" color="white" />

										<div className="ml-3">
											<div className="text-base font-medium leading-none text-white">
												{user.username}
											</div>
											<div className="text-sm font-medium leading-none text-gray-400">
												{user.email}
											</div>
										</div>
									</div>
									<div className="mt-3 space-y-1 px-2">
										{userNavigation.map((item) => (
											<Disclosure.Button
												onClick={handleSignOut}
												key={item.name}
												as="a"
												href={item.href}
												className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
											>
												{item.name}
											</Disclosure.Button>
										))}
									</div>
								</div>
							</Disclosure.Panel>
						</>
					)}
				</Disclosure>
				{/* Edit Details is set by default */}
				<main>
					<div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
						{activeTab === "User Profile" ? (
							<EditDetails />
						) : activeTab === "Post Rental" ? (
							<PostRental />
						) : activeTab === "All Rentals" ? (
							<AllRentals />
						) : (
							<AllRentals />
						)}
					</div>
				</main>
			</div>
		</>
	);
};

export default Dashboard;
