import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
	RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./Components/context/AuthContext";
import Home from "./Components/Home";
import Search from "./Components/Search";
import Feed from "./Components/Feed";
import Layout from "./Components/Layout";
import Dashboard from "./Components/Dashboard";
import Login from "./Components/AuthComps/Login";
import Register from "./Components/AuthComps/Register";
import PrivateRoute from "./Components/utils/PrivateRoute";
import RentalDetail from "./Components/FeedComps/RentalDetail";
import GetRental from "./Components/FeedComps/GetRental";
import DashRentalDetails from "./Components/DashComps/DashRentalDetails";



const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />}>
			<Route index element={<Home />} />
			<Route
				path="dashboard/:username"
				element={
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				}
			/>
			<Route
				path="rentout/:rentalId"
				element={
					<PrivateRoute>
						<GetRental />
					</PrivateRoute>
				}
			/>

			<Route
				path="dashboard/:username/rental/:rentalId"
				element={
					<PrivateRoute>
						<DashRentalDetails />
					</PrivateRoute>
				}
			/>

			<Route path="search" element={<Search />} />
			<Route path="feed" element={<Feed />} />
			<Route path="rental/:rentalId" element={<RentalDetail />} />
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />
		</Route>,
	),
);

function App() {
	AWS.config.update({
		credentials: {
			accessKeyId: import.meta.env.VITE_AWS_S3_ACCKEY,
			secretAccessKey: import.meta.env.VITE_AWS_S3_SECRET,
			region: import.meta.env.VITE_AWS_S3_REGION,
		},
	});

	return (
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	);
}

export default App;
