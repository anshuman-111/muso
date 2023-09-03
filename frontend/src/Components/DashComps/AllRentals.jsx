import React, { useEffect, useState, useContext } from "react";
import DashRentalCard from "./DashRentalCard";
import { axiosSecureInstance } from "../Hooks/AxiosInst";
import AuthContext from "../context/AuthContext";

const AllRentals = () => {
	const axiosSecure = axiosSecureInstance();
	const { user } = useContext(AuthContext);
	const [postedData, setPostedData] = useState([]);
	const [givenData, setGivenData] = useState([]);
	const [takenData, setTakenData] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);
	useEffect(() => {
		const getPosted = async () => {
			try {
				setLoading(true);
				const res = await axiosSecure.get(`/rentals/getposted/${user.user_id}`);
				if (res.status === 200) {
					setPostedData(res.data);
					setLoading(false);
				}
			} catch (err) {
				console.log(err);
			}
		};
		const getGiven = async () => {
			try {
				setLoading(true);
				const res = await axiosSecure.get(`/rentals/getgiven/${user.user_id}`);
				if (res.status === 200) {
					setGivenData(res.data);
					setLoading(false);
				}
			} catch (err) {
				console.log(err);
			}
		};
		const getTaken = async () => {
			try {
				setLoading(true);
				const res = await axiosSecure.get(`/rentals/gettaken/${user.user_id}`);
				if (res.status === 200) {
					setTakenData(res.data);
					setLoading(false);
				}
			} catch (err) {
				console.log(err);
			}
		};
		getGiven();
		getPosted();
		getTaken();
	}, []);

	return (
		<>
			{loading ? (
				<div className="text-center text-lg text-white">LOADING....</div>
			) : (
				<div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
					<h1 className="text-xl text-white p-5 mb-5">Rentals Given</h1>
					<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
						{givenData.map((rental) => (
							<DashRentalCard data={rental} type={"given"} />
						))}
					</div>
					<h1 className="text-xl text-white p-5 mb-5">Rentals Taken</h1>
					<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
						{takenData.map((rental) => (
							<DashRentalCard data={rental} type={"taken"} />
						))}
					</div>
					<h1 className="text-xl text-white p-5 mb-5">All Posted Rentals</h1>
					<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
						{postedData.map((rental) => (
							<DashRentalCard data={rental} type={"posted"} />
						))}
					</div>
				</div>
			)}
		</>
	);
};

export default AllRentals;
