import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { axiosSecureInstance } from "../Hooks/AxiosInst";
import { useNavigate } from "react-router-dom";
import handleFileUploadToS3 from "../utils/AWSS3Upload";
import { handleFileRenaming } from "../utils/FileRenameForUpload";
import { ToastContainer, toast } from "react-toastify";
import { handleDateCompare } from "../utils/dateCompare";
const PostRental = () => {
	const [loading, setLoading] = useState(false);
	const axiosSecure = axiosSecureInstance();
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 300);
	}, []);
	const imageUploadSection = [
		{
			id: 1,
			title: "front",
		},
		{
			id: 2,
			title: "back",
		},
		{
			id: 3,
			title: "left",
		},
		{
			id: 4,
			title: "right",
		},
	];
	const { user } = useContext(AuthContext);
	const nav = useNavigate();
	const [ownerPictures, setOwnerPictures] = useState({
		front: "",
		back: "",
		left: "",
		right: "",
	});

	const [displayPicture, setDisplayPicture] = useState({
		display: "",
	});

	const [filename, setFilename] = useState("");
	// Rental Form to Server
	const [rentalForm, setRentalForm] = useState({
		rental_frequency: "hour",
		rental_avail_start: "",
		rental_avail_end: "",
		rental_rate: 0,
		rental_location: "",
		rental_instrument_type: "",
		rental_desc: "",
		rental_title: "",
		rental_image_url: "",
		owner: user.user_id,
	});

	// State for managing date types, and minimum constraints
	const [dateTypes, setDateTypes] = useState({
		unit: "Hours",
		maxLimit: 23,
		today: () => {
			const today = new Date();
			return today.toISOString().split("T")[0];
		},
	});

	// Changing form based on Rental Rate

	const handleRentalFormSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		if (
			!handleDateCompare(
				rentalForm.rental_avail_start,
				rentalForm.rental_avail_end,
			)
		) {
			toast.error("Start Date Cannot be after End Date", {
				position: toast.POSITION.TOP_CENTER,
			});
			return;
		}

		try {
			const res = await axiosSecure.post("/rentals/create", rentalForm);

			if (res.status === 200) {
				toast.success("Rental Created Successfully!", {
					position: toast.POSITION.TOP_CENTER,
				});
				try {
					if (
						Object.values(ownerPictures).every((file) => file) &&
						Object.values(displayPicture).every((file) => file)
					) {
						handleFileUploadToS3(
							Object.values(displayPicture),
							res.data,
							"display",
						).then(() => {
							try {
								const urlRes = axiosSecure
									.post(`/rentals/imageupload/${res.data}`, {
										img_url: `https://${
											import.meta.env.VITE_AWS_S3_BUCKET
										}.s3.${import.meta.env.VITE_AWS_S3_REGION}.amazonaws.com/${
											res.data
										}/display/${filename}`,
									})
									.then(() =>
										toast.dark("Image upload in progress", {
											position: toast.POSITION.TOP_CENTER,
										}),
									)
									.catch((err) =>
										toast.error(err.response.data.msg, {
											position: toast.POSITION.TOP_CENTER,
										}),
									);
							} catch (err) {
								console.log(err);
								toast.error(err.response.data.msg, {
									position: toast.POSITION.TOP_CENTER,
								});
							}
						});

						handleFileUploadToS3(
							Object.values(ownerPictures),
							res.data,
							"creation",
						).then(() =>
							toast.success("All Images uploaded Successfully!", {
								position: toast.POSITION.TOP_CENTER,
							}),
						);
					} else {
						toast.error("Please upload all pictures to proceed", {
							position: toast.POSITION.TOP_CENTER,
						});
					}
				} catch (err) {
					console.log(err);
				}

				setLoading(false);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<ToastContainer />
			{loading ? (
				<div className="text-center text-lg text-white">LOADING....</div>
			) : (
				<form
					className="bg-white px-20 py-5 rounded-3xl"
					onSubmit={handleRentalFormSubmit}
				>
					<div className="space-y-12">
						<div className="border-b border-gray-900/10 pb-2 pt-5">
							<h2 className="sm:text-2xl text-base font-semibold leading-7 text-gray-900">
								Add Rental Information
							</h2>
						</div>

						<div className="border-b border-gray-900/10 pb-2">
							<div className="mt-10 flex flex-col w-3/4 mx-auto gap-y-8">
								<div className="">
									<label
										htmlFor="title"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Title for your Rental Post
									</label>
									<div className="mt-2">
										<input
											type="text"
											name="title"
											id="title"
											className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												setRentalForm({
													...rentalForm,
													rental_title: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className="">
									<label
										htmlFor="country"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Rental Rate
									</label>
									<div className="mt-2">
										<select
											id="country"
											name="country"
											autoComplete="country-name"
											className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
											onChange={(e) =>
												setRentalForm({
													...rentalForm,
													rental_frequency: e.target.value,
												})
											}
										>
											<option defaultChecked value={"hour"}>
												Per Hour
											</option>
											<option value={"day"}>Per Day</option>
											<option value={"week"}>Per Week</option>
										</select>
									</div>
								</div>

								<div className="">
									<label
										htmlFor="startdate"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Rental Availability From
									</label>
									<div className="mt-2">
										<input
											type="date"
											name="startdate"
											id="startdate"
											min={dateTypes.today()}
											placeholder="dd-mm-yyyy"
											className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) => {
												setRentalForm({
													...rentalForm,
													rental_avail_start: new Date(
														e.target.value,
													).toISOString(),
												});
											}}
										/>
									</div>
								</div>
								<div className="">
									<label
										htmlFor="enddate"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Rental Availability To
									</label>
									<div className="mt-2">
										<input
											type="date"
											name="enddate"
											id="enddate"
											min={
												rentalForm.rental_avail_start
													? rentalForm.rental_avail_start.split("T")[0]
													: dateTypes.today()
											}
											placeholder="dd-mm-yyyy"
											className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) => {
												setRentalForm({
													...rentalForm,
													rental_avail_end: new Date(
														e.target.value,
													).toISOString(),
												});
											}}
										/>
									</div>
								</div>

								<div className="">
									<label
										htmlFor="price"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Price in AUD
									</label>
									<div className="mt-2">
										<input
											type="number"
											name="price"
											id="price"
											min={0}
											max={999999}
											className="block w-full px-6 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												setRentalForm({
													...rentalForm,
													rental_rate: e.target.value,
												})
											}
										/>
									</div>
								</div>

								<div className="">
									<label
										htmlFor="location"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Pick-up / Drop-off Location
									</label>
									<div className="mt-2">
										<input
											type="text"
											name="location"
											id="location"
											autoComplete="address-level1"
											className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												setRentalForm({
													...rentalForm,
													rental_location: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className="">
									<label
										htmlFor="instrumenttype"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Instrument Type (Drums, Guitar .etc)
									</label>
									<div className="mt-2">
										<input
											type="text"
											name="instrumenttype"
											id="instrumenttype"
											autoComplete="address-level1"
											className="block w-full px-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												setRentalForm({
													...rentalForm,
													rental_instrument_type: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className="">
									<label
										htmlFor="rentaldesc"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										Rental Description
									</label>
									<div className="mt-2">
										<textarea
											maxLength={140}
											id="rentaldesc"
											name="rentaldesc"
											type="rentaldesc"
											required
											className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												setRentalForm({
													...rentalForm,
													rental_desc: e.target.value,
												})
											}
										/>
									</div>
								</div>
								<div className="border-b border-gray-900/10 pb-2 pt-5 col-span-6">
									<h2 className="sm:text-lg text-base font-semibold leading-7 text-gray-900">
										Upload Display picture for the rental
									</h2>
								</div>
								<div className="flex flex-col">
									<label
										htmlFor="display"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										This picture will be displayed in the feed
									</label>
									<div className="mt-2">
										<input
											id="display"
											name="display"
											type="file"
											className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												e.target.files.length > 0
													? setDisplayPicture({
															display: handleFileRenaming(
																e.target.files[0],
																"display",
																setFilename,
															),
													  })
													: ""
											}
										/>
										<img
											className="h-80 border-2 border-black p-1"
											src={
												displayPicture.display
													? URL.createObjectURL(displayPicture.display)
													: ""
											}
										/>
									</div>
								</div>
								<div className="border-b border-gray-900/10 pb-2 pt-5 col-span-6">
									<h2 className="sm:text-lg text-base font-semibold leading-7 text-gray-900">
										Upload pictures of Front, Back, Left and Right sides of the
										instrument
									</h2>
								</div>
								<div className="flex flex-col sm:flex-row gap-x-2">
									{imageUploadSection.map(({ id, title }) => (
										<div className="flex flex-col" key={id}>
											<label
												htmlFor={title}
												className="block text-sm font-medium leading-6 text-gray-900 capitalize"
											>
												{title}
											</label>
											<div className="mt-2">
												<input
													id={title}
													name={title}
													type="file"
													required
													className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
													onChange={(e) =>
														e.target.files.length > 0
															? setOwnerPictures({
																	...ownerPictures,

																	[title]: handleFileRenaming(
																		e.target.files[0],
																		title,
																	),
															  })
															: ""
													}
												/>
												<img
													className="h-80 border-2 border-black p-1"
													src={
														ownerPictures[title]
															? URL.createObjectURL(ownerPictures[title])
															: ""
													}
												/>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="mt-6 flex items-center justify-end gap-x-6">
						<button
							type="button"
							className="text-sm font-semibold leading-6 text-gray-900"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Save Draft
						</button>
						<button
							type="submit"
							className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
						>
							Post Rental
						</button>
					</div>
				</form>
			)}
		</>
	);
};

export default PostRental;
