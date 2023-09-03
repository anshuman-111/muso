import React from "react";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { axiosInstance } from "../Hooks/AxiosInst";
import { useNavigate, useLocation } from "react-router-dom";
const GetRental = () => {
	const location = useLocation();
	const data = location.state.data;
	const { user } = useContext(AuthContext);
	const nav = useNavigate();

	// Rental Form to Server
	const [rentalTakeForm, setRentalTakeForm] = useState({
		is_rental_active: true,
		rental_start: "",
		rental_end: "",
		renter: user.user_id,
	});
	console.log(rentalTakeForm);
	// State for managing date types, and minimum constraints
	const [dateTypes, setDateTypes] = useState({
		startType: "datetime-local",
		unit: "Hours",
		maxLimit: 23,
		today: new Date().toISOString().slice(0, -8),
	});

	// Getting form input for calculating retrun date
	const [dateCalc, setDateCalc] = useState({
		start: "",
		numberOfUnits: 0,
		unitType: "",
	});

	// State for setting return date
	const [returnDate, setReturnDate] = useState("");

	// Function for setting return date
	useEffect(() => {
		if (
			dateCalc.start !== "" &&
			dateCalc.numberOfUnits !== 0 &&
			dateCalc.unitType !== ""
		) {
			const calcReturn = () => {
				var start = new Date(dateCalc.start);
				var res = new Date();
				var dateForDisplay = "";
				if (dateCalc.unitType === "hour") {
					res = new Date(
						start.getTime() + dateCalc.numberOfUnits * 60 * 60 * 1000,
					);
					dateForDisplay =
						res.toLocaleDateString("en-GB") + " " + res.toLocaleTimeString();
				} else if (dateCalc.unitType === "day") {
					res = new Date(
						start.getTime() + dateCalc.numberOfUnits * 24 * 60 * 60 * 1000,
					);
					dateForDisplay = res.toLocaleDateString("en-GB");
				} else {
					res = new Date(
						start.getTime() + dateCalc.numberOfUnits * 7 * 24 * 60 * 60 * 1000,
					);
					dateForDisplay = res.toLocaleDateString("en-GB");
				}

				setReturnDate(dateForDisplay);
				setRentalTakeForm({ ...rentalTakeForm, rental_end: res.toISOString() });
				console.log("Return --->", res);
			};
			calcReturn();
		}
	}, [dateCalc]);

	// Changing form based on Rental Rate
	useEffect(() => {
		const handleRentalFrequency = (rentalFreq) => {
			setDateCalc({ ...dateCalc, unitType: rentalFreq });
			if (rentalFreq === "hour") {
				setDateTypes({
					startType: "datetime-local",
					unit: "Hours",
					maxLimit: 23,
					today: new Date().toISOString().slice(0, -8),
				});
			} else if (rentalFreq === "day") {
				setDateTypes({
					startType: "date",
					unit: "Days",
					maxLimit: 7,
					today: new Date().toISOString().slice(0, -14),
				});
			} else {
				setDateTypes({
					startType: "date",
					unit: "Weeks",
					maxLimit: 4,
					today: new Date().toISOString().slice(0, -14),
				});
			}
		};
		handleRentalFrequency(data?.rental_frequency);
	}, []);

	const handleRentalTakeFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await axiosInstance.post(
				`/rentals/takerental/${data?.rental_id}`,
				rentalTakeForm,
			);
			if (res.status === 200) {
				nav(`/dashboard/${user.username}`);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<form
			className="bg-white px-10 py-5 rounded-3xl w-3/4 mx-auto"
			onSubmit={handleRentalTakeFormSubmit}
		>
			<div className="space-y-10">
				<div className="border-b border-gray-900/10 pb-2 pt-5">
					<h2 className="sm:text-2xl text-base font-semibold leading-7 text-gray-900">
						Accept Rental - Please read carefully before accepting
					</h2>
				</div>

				<div className="border-b border-gray-900/10 pb-2">
					<div className="mt-10 flex flex-col w-3/4 mx-auto gap-y-8">
						<div className="block font-medium text-xl leading-6 text-gray-900">
							{data?.rental_title}
						</div>
						<div className="block text-sm font-medium leading-6 text-gray-900">
							{data?.rental_desc}
						</div>
						<div className="block text-sm font-medium leading-6 text-gray-900 mt-2">
							Rental Basis: PER {data?.rental_frequency.toUpperCase()}
						</div>
						<div className="block text-sm font-medium leading-6 text-gray-900">
							AUD {data?.rental_rate} PER {data?.rental_frequency.toUpperCase()}
						</div>

						<div className="block text-sm font-medium leading-6 text-gray-900">
							Pick-up / Drop-off Location : {data?.rental_location}
						</div>

						<div className="block text-sm font-medium leading-6 text-gray-900">
							Instrument Type : {data?.rental_instrument_type}
						</div>
						<div className="block text-sm font-medium leading-6 text-gray-900">
							Owned By : {data?.owner_username}
						</div>

						<div className="">
							<label
								htmlFor="rentalfreq"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								How many {dateTypes.unit}?
							</label>
							<div className="mt-2">
								<input
									id="rentalfreq"
									name="rentalfreq"
									type="number"
									min={0}
									max={dateTypes.maxLimit}
									className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
									onChange={(e) =>
										setDateCalc({ ...dateCalc, numberOfUnits: e.target.value })
									}
								/>
							</div>
						</div>

						<div className="">
							<label
								htmlFor="startdate"
								className="block text-sm font-medium leading-6 text-gray-900"
							>
								Start Date
							</label>
							<div className="mt-2">
								<input
									type={dateTypes.startType}
									name="startdate"
									id="startdate"
									min={dateTypes.today}
									placeholder="dd-mm-yyyy"
									className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
									onChange={(e) => {
										setDateCalc({ ...dateCalc, start: e.target.value });
										setRentalTakeForm({
											...rentalTakeForm,
											rental_start: new Date(e.target.value).toISOString(),
										});
									}}
								/>
							</div>
						</div>

						<div className="">Return Date: {returnDate}</div>

						<div className=" font-bold text-xl">
							Total Price : AUD {dateCalc.numberOfUnits * data?.rental_rate}
						</div>
					</div>
				</div>
			</div>

			<div className="mt-6 flex items-center justify-end gap-x-6">
				<button
					type="button"
					className="text-sm font-semibold leading-6 text-gray-900"
					onClick={() => window.history.back()}
				>
					Cancel
				</button>
				{data?.owner_username === user.username ? (
					<p>Cannot Get your own rental</p>
				) : (
					<button
						type="submit"
						className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Get Rental
					</button>
				)}
			</div>
		</form>
	);
};

export default GetRental;
