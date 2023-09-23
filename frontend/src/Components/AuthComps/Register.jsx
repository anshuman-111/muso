import { useState, useEffect, useContext } from 'react'
import React from 'react'
import AuthContext from '../context/AuthContext'
import logo from "../../assets/logo-svg.svg";
import { XMarkIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../Hooks/AxiosInst";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
	const { user, isAuth } = useContext(AuthContext);
	const nav = useNavigate();
	const [msg, setMsg] = useState("");
	const [registerForm, setRegisterForm] = useState({
		email: "",
		username: "",
		password: "",
		confirmPass: "",
	});

	const [checks, setChecks] = useState({
		hasLength: false,
		hasNumber: false,
		hasSpecial: false,
		hasPassMatch: false,
	});

	// REGISTER - PASSWORD VALIDATION
	useEffect(() => {
		const handlePassword = () => {
			setChecks({
				...checks,
				hasLength: registerForm.password.length > 4 ? true : false,
				hasNumber: /[0-9]+/.test(registerForm.password),
				hasSpecial: /[^A-Za-z0-9]+/.test(registerForm.password),
			});
		};
		handlePassword();
	}, [registerForm.password]);

	useEffect(() => {
		setChecks({
			...checks,
			hasPassMatch:
				registerForm.password == registerForm.confirmPass &&
				registerForm.password.length > 0,
		});
	}, [registerForm.confirmPass]);

	const checksLength = Object.values(checks).filter((val) => val).length;
	const handleCreateUser = (event) => {
		event.preventDefault();
		delete registerForm.confirmPass;
		const fetchCreate = async () => {
			try {
				const res = await axiosInstance.post("/users/register", registerForm);

				if (res && res.status == 201) {
					//prettier-ignore
					nav("/login");
				}
			} catch (err) {
				console.log(err);
				toast.error(err?.response?.data?.msg, {
					position: toast.POSITION.TOP_CENTER,
				});
				setChecks({
					hasLength: false,
					hasNumber: false,
					hasPassMatch: false,
					hasSpecial: false,
				});
			} finally {
				setRegisterForm({ ...registerForm, password: "", confirmPass: "" });
			}
		};
		fetchCreate();
	};

	return (
		<>
			<ToastContainer />
			<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-0 lg:px-8">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
						Create new account
					</h2>
				</div>

				<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
					<form className="space-y-6" onSubmit={handleCreateUser}>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium leading-6 text-white"
							>
								Email address
							</label>
							<div className="mt-2">
								<input
									id="email"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										setRegisterForm({ ...registerForm, email: e.target.value });
									}}
								/>
							</div>
						</div>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium leading-6 text-white"
							>
								Username
							</label>
							<div className="mt-2">
								<input
									id="username"
									name="username"
									type="text"
									autoComplete="username"
									required
									className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										setRegisterForm({
											...registerForm,
											username: e.target.value,
										});
									}}
								/>
							</div>
						</div>
						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-white"
								>
									Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									value={registerForm.password || ""}
									autoComplete="current-password"
									required
									className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6"
									onChange={(e) => {
										setRegisterForm({
											...registerForm,
											password: e.target.value,
										});
									}}
								/>
							</div>
						</div>
						<div>
							<ul className="w-full mx-auto">
								<li>
									<div>
										<span className="text-white flex flex-row justify-start">
											{checks.hasLength ? (
												<CheckIcon color="green" className="w-5 h-5" />
											) : (
												<XMarkIcon color="red" className="w-5 h-5" />
											)}
											<p className="ml-5">Longer than 5 characters</p>
										</span>
									</div>
								</li>
								<li>
									<div>
										<span className="text-white flex flex-row justify-start">
											{checks.hasNumber ? (
												<CheckIcon color="green" className="w-5 h-5" />
											) : (
												<XMarkIcon color="red" className="w-5 h-5" />
											)}
											<p className="ml-5">Numbers</p>
										</span>
									</div>
								</li>
								<li>
									<div>
										<span className="text-white flex flex-row justify-start">
											{checks.hasSpecial ? (
												<CheckIcon color="green" className="w-5 h-5" />
											) : (
												<XMarkIcon color="red" className="w-5 h-5" />
											)}
											<p className="ml-5">Special characters</p>
										</span>
									</div>
								</li>
								<li>
									<div>
										<span className="text-white flex flex-row justify-start">
											{checks.hasPassMatch ? (
												<CheckIcon color="green" className="w-5 h-5" />
											) : (
												<XMarkIcon color="red" className="w-5 h-5" />
											)}
											<p className="ml-5">Passwords match</p>
										</span>
									</div>
								</li>
							</ul>
						</div>
						<div>
							<div className="flex items-center justify-between">
								<label
									htmlFor="password"
									className="block text-sm font-medium leading-6 text-white"
								>
									Confirm Password
								</label>
							</div>
							<div className="mt-2">
								<input
									id="confpassword"
									name="confpassword"
									type="password"
									autoComplete="new-password"
									value={registerForm.confirmPass || ""}
									required
									className="block w-full px-5 rounded-md text-lg border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl sm:leading-6"
									onChange={(e) => {
										setRegisterForm({
											...registerForm,
											confirmPass: e.target.value,
										});
									}}
								/>
							</div>
						</div>
						<div className="text-center text-red-500 text-lg h-4 w-full">
							{msg}
						</div>
						<div>
							{checksLength === 4 ? (
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
									onClick={() => {}}
								>
									Register
								</button>
							) : (
								<button
									disabled
									type="submit"
									className="flex w-full justify-center rounded-md disabled:bg-slate-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-400 cursor-not-allowed shadow-sm"
								>
									Register
								</button>
							)}
						</div>
					</form>

					<p className="mt-10 text-center text-sm text-gray-500">
						Already a member?{" "}
						<Link
							to={"/login"}
							className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
						>
							Sign In here
						</Link>
					</p>
				</div>
			</div>
		</>
	);
};

export default Register

