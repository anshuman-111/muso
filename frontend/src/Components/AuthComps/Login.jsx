import { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import {axiosInstance} from '../Hooks/AxiosInst'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Login = () => {
	const navigate = useNavigate();
	const [loginForm, setLoginForm] = useState({
		email: "",
		password: "",
	});

	const [displayMsg, setDisplayMsg] = useState("");
	const [isDisabled, setDisabled] = useState(true);

	const { user, login, msg, setMsg } = useContext(AuthContext);
	console.log(user);
	useEffect(() => {
		if (user !== null) {
			navigate("/");
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
	const handleLogin = async () => {
		try {
			await login(loginForm);
			setTimeout(500);
		} catch (error) {
			console.log(error);
			setMsg("Username or password is incorrect");
		}
		console.log(msg);
	};
	return (
		<>
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
								<div className="text-sm">
									<a
										href="#"
										className="font-semibold text-btn-primary hover:text-indigo-500"
									>
										Forgot password?
									</a>
								</div>
							</div>
							<div className="mt-2">
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
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
									onClick={() => handleLogin()}
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
		</>
	);
};

export default Login




  