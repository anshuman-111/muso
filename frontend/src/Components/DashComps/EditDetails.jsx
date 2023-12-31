import React, { useContext, useEffect, useState } from "react";
import { axiosSecureInstance } from "../Hooks/AxiosInst";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EditDetails = () => {
	const axiosSecure = axiosSecureInstance();
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 300);
	}, []);
	const [isFetched, setFetched] = useState(false);
	const { user, logout } = useContext(AuthContext);
	const [form, setForm] = useState({
		username: user.user,
		first_name: "",
		last_name: "",
		suburb: "",
		email: "",
	});
	let username = user.username;
	let navigate = useNavigate();
	const [dashData, setDashData] = useState({
		email: "",
		first_name: "",
		last_name: "",
		suburb: "",
	});

	// Post to server to save changes
	const handleSave = () => {
		setForm({ ...form, username: username });
		const fetchCreate = async () => {
			try {
				const res = await axiosSecure.post("/users/setDashboard", form);
				if (res.status == 200) {
					setFetched(false);
				}
			} catch (err) {
				console.log(err.response.data);
			}
		};
		fetchCreate();
	};

	// Get from server to get dashboard
	const getDash = async () => {
		try {
			const res = await axiosSecure.get(`/users/getDashboard/${username}`);
			if (res.status == 200) {
				setDashData({ ...res.data });
				setFetched(true);
			}
		} catch (err) {
			console.log(err);
		}
	};

	// Handling cancel  button click
	const handleCancel = () => {
		const cancelAction = window.confirm(
			"Changes will not be saved. Do you wish to proceed?",
		);
		if (cancelAction) {
			window.location.reload();
		}
	};
	// Getting Dashboard on Page Load
	useEffect(() => {
		getDash();
		if (isFetched) {
			setForm({
				first_name: dashData.first_name,
				last_name: dashData.last_name,
				username: user?.username,
				suburb: dashData.suburb,
				email: dashData.email,
			});
		}
	}, [isFetched]);

	// Delete User Account
	const handleDeleteAccount = async () => {
		const deleteAction = window.confirm(
			"Are you sure you want delete your account? This action is irreversible.",
		);
		if (deleteAction) {
			const res = await axiosSecure
				.post(`/users/delete/${username}`)
				.then(() => {
					logout();
					navigate("/");
				})
				.catch((err) =>
					toast.error(err.response.data.msg, {
						position: toast.POSITION.TOP_CENTER,
					}),
				);
		}
	};
	return (
		<>
			<ToastContainer />
			{loading ? (
				<div className="text-center text-lg text-white">LOADING....</div>
			) : (
				<form className="bg-white px-20 sm:px-20 py-5">
					<div className="space-y-12">
						<div className="border-b border-gray-900/10 pb-12">
							<h2 className="text-xl font-semibold leading-7 text-gray-900">
								Profile
							</h2>

							<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-4">
									<label
										htmlFor="username"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Username
									</label>
									<div className="mt-2">
										<div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
											<span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
												workcation.com/
											</span>
											<input
												type="text"
												name="username"
												id="username"
												defaultValue={form.username}
												autoComplete="username"
												className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
												placeholder="janesmith"
												onChange={(e) => {
													setForm({ ...form, username: e.target.value });
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="border-b border-gray-900/10 pb-12">
							<h2 className="text-base font-semibold leading-7 text-gray-900">
								Personal Information
							</h2>

							<div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-3">
									<label
										htmlFor="first-name"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										First name
									</label>
									<div className="mt-2">
										<input
											type="text"
											name="first-name"
											id="first-name"
											defaultValue={form.first_name}
											autoComplete="given-name"
											className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) => {
												setForm({ ...form, first_name: e.target.value });
											}}
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="last-name"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Last name
									</label>
									<div className="mt-2">
										<input
											type="text"
											name="last-name"
											id="last-name"
											defaultValue={form.last_name}
											autoComplete="family-name"
											className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) => {
												setForm({ ...form, last_name: e.target.value });
											}}
										/>
									</div>
								</div>

								<div className="sm:col-span-4">
									<label
										htmlFor="email"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Email address
									</label>
									<div className="mt-2">
										<input
											id="email"
											name="email"
											type="email"
											value={form.email}
											disabled
											autoComplete="email"
											className="cursor-not-allowed block w-full px-4 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>

								<div className="sm:col-span-3">
									<label
										htmlFor="sub-name"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Suburb
									</label>
									<div className="mt-2">
										<input
											id="sub-name"
											name="sub-name"
											defaultValue={form.suburb}
											autoComplete="address-level2"
											placeholder="Enter suburb name"
											className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
											onChange={(e) =>
												setForm({ ...form, suburb: e.target.value })
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-end gap-x-6">
						<button
							type="button"
							className="text-sm font-semibold leading-6 text-gray-900"
							onClick={() => handleCancel()}
						>
							Cancel
						</button>
						<button
							type="button"
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							onClick={() => handleSave(form)}
						>
							Save
						</button>
						<button
							type="button"
							className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							onClick={() => handleDeleteAccount()}
						>
							Delete Account
						</button>
					</div>
				</form>
			)}
		</>
	);
};

export default EditDetails;
