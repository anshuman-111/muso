import { useContext, useState } from "react";
import { Route, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
	const { isAuth } = useContext(AuthContext);

	return isAuth ? (
		<>{children}</>
	) : (
		setTimeout(() => {
			<Navigate to="/login" />;
		}, 1000)
	);
};

export default PrivateRoute;
