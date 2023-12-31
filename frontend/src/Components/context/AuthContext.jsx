import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../Hooks/AxiosInst";
import jwt_decode from 'jwt-decode';
import { useCookies } from 'react-cookie';
const AuthContext = createContext()


export default AuthContext;


export const AuthProvider = ({ children }) => {
	const [cookie, setCookie, removeCookie] = useCookies(["jwt"]);
	const [authToken, setToken] = useState(cookie.jwt ? cookie.jwt : null);
	const [msg, setMsg] = useState("");
	const [user, setUser] = useState(
		cookie.jwt ? jwt_decode(cookie.jwt.access) : null,
	);
	const [isAuth, setIsAuth] = useState(false);
	const authLogin = async (form) => {
		try {
			const res = await axiosInstance
				.post("/users/token", form, {
					headers: {
						"Content-Type": "application/json",
					},
				})
				.catch((err) => {});
			if (res.status === 200) {
				let data = await res.data;
				setToken(data);
				setUser(jwt_decode(data.access));
				setCookie("jwt", data, { path: "/", expires: user?.exp });
				setMsg("Successfully Logged In! ");
			}
		} catch (err) {
			console.log(err);
			setMsg("Email or Password is incorrect");
		}
	};

	useEffect(() => {
		if (user !== null) {
			setIsAuth(true);
		}
	}, [user]);

	const signOut = () => {
		removeCookie("jwt", { path: "/" });
		localStorage.clear();
		setIsAuth(false);
		setUser(null);
	};

	let contextData = {
		user: user,
		isAuth: isAuth,
		login: authLogin,
		logout: signOut,
		msg: msg
	};

	return (
		<AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
	);
};