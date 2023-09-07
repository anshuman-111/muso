import React from "react";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { axiosInstance, axiosSecureInstance } from "../Hooks/AxiosInst";
import { useNavigate, useLocation } from "react-router-dom";
import { handleDateCompare } from "../utils/dateCompare";
const GetRental = () => {
	// Initializations
	const location = useLocation();
	const data = location.state.data;
	const { user } = useContext(AuthContext);
	const nav = useNavigate();
	const axiosSecure = axiosSecureInstance();

	// Rental Form to Server
	const [rentalTakeForm, setRentalTakeForm] = useState({
		is_rental_active: true,
		rental_start: "",
		rental_end: "",
		renter: user.user_id,
	});

	// State for managing date types, and minimum constraints
	const [dateTypes, setDateTypes] = useState({
		startType: "datetime-local",
		unit: "Hours",
		maxLimit: 23,
		today: new Date().toISOString().slice(0, -8),
	});

	// State for changing date format for display
	const [displayDates, setDisplayDates] = useState({
		start: "",
		end: "",
	});

	// State to determine if rental return date is valid
	const [isReturnDateValid, setReturnDateValid] = useState(false);

	// Getting form input for calculating return date
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
			};
			calcReturn();
		}
	}, [dateCalc]);

	// Changing form based on Rental Rate
	useEffect(() => {
		// Format Dates for better readability
		const handleDateFormat = (date) => {
			const formattedDate = new Date(date);
			return new Intl.DateTimeFormat("en-GB", {
				year: "numeric",
				month: "long",
				day: "numeric",
			})
				.format(formattedDate)
				.toString();
		};
		setDisplayDates({
			start: handleDateFormat(data?.rental_avail_start),
			end: handleDateFormat(data?.rental_avail_end),
		});

		// Changing form attributes based on Rental Frequency
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
					maxLimit: 30,
					today: new Date().toISOString().slice(0, -14),
				});
			} else {
				setDateTypes({
					startType: "date",
					unit: "Weeks",
					maxLimit: 5,
					today: new Date().toISOString().slice(0, -14),
				});
			}
		};
		handleRentalFrequency(data?.rental_frequency);
	}, []);

	// Submitting form to server
	const handleRentalTakeFormSubmit = async (event) => {
		event.preventDefault();
		try {
			const res = await axiosSecure.post(
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

	// Fucntion for checking if return date is valid
	useEffect(() => {
		setReturnDateValid(handleDateCompare(data?.rental_avail_end, returnDate));
	}, [returnDate]);
	return (
		<form
			className="bg-white px-10 py-5 rounded-3xl w-3/4 mx-auto"
			onSubmit={handleRentalTakeFormSubmit}
		>
			<div className="space-y-10">
				<div className="border-b border-gray-900/10 pb-2 pt-5">
					<h2 className="sm:text-2xl text-base font-semibold leading-7 text-gray-900">
						Accept Rental
					</h2>
				</div>

				<div className="border-b border-gray-900/10 pb-2">
					<div className="mt-10 flex flex-col w-3/4 mx-auto gap-y-2">
						<div className="flex flex-col flex-wrap mx-auto text-lg bg-indigo-200 rounded-lg p-2 w-1/2 text-center font-medium leading-6 text-gray-900">
							<p className="font-medium text-xl leading-6 text-gray-900">
								{data?.rental_title}
							</p>
							<p className="text-sm font-medium p-2 text-gray-900 w-full break-words">
								{data?.rental_desc}
							</p>
						</div>

						<div className="block text-lg mx-auto bg-indigo-200 rounded-lg p-2 w-1/2 text-center font-medium leading-6 text-gray-900">
							AUD {data?.rental_rate} PER {data?.rental_frequency.toUpperCase()}
						</div>
						<div className="block mx-auto text-lg bg-indigo-200 rounded-lg p-2 w-full text-center font-medium leading-6 text-gray-900">
							Available from{" "}
							<span className="text-md font-semibold text-red-700">
								{displayDates.start}
							</span>{" "}
							to{" "}
							<span className="text-md font-semibold text-red-700">
								{displayDates.end}
							</span>
						</div>
						<div className="flex flex-row justify-between text-lg mx-auto bg-indigo-200 rounded-lg p-2 w-full text-center font-medium leading-6 text-gray-900">
							<div className="block text-sm font-medium leading-6 text-gray-900">
								Pick-up / Drop-off Location :{" "}
								<span className="text-red-700 font-semibold">
									{data?.rental_location}
								</span>
							</div>

							<div className="block text-sm font-medium leading-6 text-gray-900">
								Instrument Type :{" "}
								<span className="text-red-700 font-semibold">
									{data?.rental_instrument_type}
								</span>
							</div>
							<div className="block text-sm font-medium leading-6 text-gray-900">
								Owned By :{" "}
								<span className="text-red-700 font-semibold">
									{data?.owner_username}
								</span>
							</div>
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
									required
									min={1}
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
									required
									min={data?.rental_avail_start.split("T")[0]}
									max={data?.rental_avail_end.split("T")[0]}
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
						{isReturnDateValid ? (
							<div className="">Return Date: {returnDate}</div>
						) : (
							<div className="text-lg text-red-500 font-semibold">
								Return Date exceeds rental duration
							</div>
						)}

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
					<p className="text-lg text-red-500 font-semibold">
						Cannot Get your own rental
					</p>
				) : isReturnDateValid ? (
					<button
						type="submit"
						className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
					>
						Get Rental
					</button>
				) : (
					""
				)}
			</div>
		</form>
	);
};

export default GetRental;
