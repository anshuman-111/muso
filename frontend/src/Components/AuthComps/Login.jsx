import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../Hooks/AxiosInst";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
	const navigate = useNavigate();
	const [loginForm, setLoginForm] = useState({
		email: import.meta.env.VITE_BYPASS_EMAIL,
		password: import.meta.env.VITE_BYPASS_PASSWORD,
	});

	const [displayMsg, setDisplayMsg] = useState("");
	const [isDisabled, setDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const { user, login, msg } = useContext(AuthContext);

	const showMsg = useCallback(() => {
		return toast.done(msg, {
			position: toast.POSITION.TOP_CENTER,
		});
	}, [msg]);
	useEffect(() => {
		if (user !== null) {
			setLoading(true);
			toast.success(msg, {
				position: toast.POSITION.TOP_CENTER,
			});
			setTimeout(() => {
				navigate("/"), setLoading(false);
			}, 1000);
		}
	}, [user]);

	// LOGIN - ARE FIELDS EMPTY? VALIDATION
	useEffect(() => {
		if (loginForm.email.length < 1 || loginForm.password.length < 1) {
			setDisabled(true);
		} else {
			setDisabled(false);
		}
	}, [loginForm]);

	// Handle Login
	const handleLogin = async (loginForm) => {
		try {
			await login(loginForm);
			showMsg();
			setTimeout(500);
		} catch (error) {
			console.log(error);
			setMsg("Username or password is incorrect");
		}
	};

	return (
		<>
			<ToastContainer />
			{loading ? (
				<p className="text-center m-auto text-2xl font-semibold text-white">
					{" "}
					REDIRECTING ....
				</p>
			) : (
				<div className="flex min-h-full flex-1 flex-col justify-center px-6 py-3 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						<h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-bg-secondary">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form className="space-y-6" action="#">
							<div>
								<label
									htmlFor="email"
									className="block text-sm font-medium leading-6 text-heading-light"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										defaultValue="test@test.com"
										required
										className="block w-full rounded-md border-0 py-1.5 px-3 text-heading-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-800 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={(e) => {
											setLoginForm({ ...loginForm, email: e.target.value });
										}}
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="password"
										className="block text-sm font-medium leading-6 text-heading-light"
									>
										Password
									</label>
								</div>
								<div className="mt-2">
									<input
										id="password"
										name="password"
										type="password"
										autoComplete="current-password"
										defaultValue="1wer@"
										required
										className="block w-full rounded-md border-0 py-1.5 px-3 text-heading-dark shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={(e) => {
											setLoginForm({ ...loginForm, password: e.target.value });
										}}
									/>
								</div>
							</div>
							<div>
								{!isDisabled ? (
									<button
										type="button"
										className="flex w-full mt-5 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
										onClick={() => handleLogin(loginForm)}
									>
										Sign in
									</button>
								) : (
									<button
										type="button"
										disabled
										className="flex w-full justify-center rounded-md disabled:bg-slate-200 px-3 py-1.5 text-sm font-semibold leading-6 text-gray-400 cursor-not-allowed shadow-sm"
									>
										Sign in
									</button>
								)}
								<p className="text-center text-red-500 text-md pt-4 h-4 w-full">
									{displayMsg}
								</p>
							</div>
						</form>

						<p className="mt-10 text-center text-sm text-gray-500">
							Not a member?{" "}
							<Link
								to={"/register"}
								className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
							>
								Sign Up Today
							</Link>
						</p>
					</div>
				</div>
			)}
		</>
	);
};

export default Login;
