import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { axiosSecureInstance } from "../Hooks/AxiosInst";
import { useNavigate } from "react-router-dom";
import handleFileUploadToS3 from "../utils/AWSS3Upload";
import { handleFileRenaming } from "../utils/FileRenameForUpload";
import { ToastContainer, toast } from "react-toastify";
const PostRental = () => {
	const [loading, setLoading] = useState(false);
	const axiosSecure = axiosSecureInstance();
	useEffect(() => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 300);
	}, []);
	const { user } = useContext(AuthContext);
	const nav = useNavigate();
	const [ownerPictures, setOwnerPictures] = useState({
		type: "creation",
		files: [],
	});

	const [displayPicture, setDisplayPicture] = useState({
		type: "display",
		files: [],
	});

	const [filename, setFilename] = useState("");
	// Rental Form to Server
	const [rentalForm, setRentalForm] = useState({
		rental_frequency: "",
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
		today: new Date().toISOString().slice(0, -8),
	});

	// Changing form based on Rental Rate

	const handleRentalFormSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			const res = await axiosSecure
				.post("/rentals/create", rentalForm)
				
			if (res.status === 200) {
				try {
					handleFileUploadToS3(
						displayPicture.files,
						res.data,
						displayPicture.type,
					).then(() => {
						try {
							const urlRes = axiosSecure.post(
								`/rentals/imageupload/${res.data}`,
								{
									img_url: `https://${import.meta.env.VITE_AWS_S3_BUCKET}.s3.${
										import.meta.env.VITE_AWS_S3_REGION
									}.amazonaws.com/${res.data}/display/${filename}`,
								},
							);
							if (urlRes.status === 200) {
								console.log("Display Image Uploaded");
							}
						} catch (err) {
							console.log(err);
							toast.error(err.response.data.msg, {
								position: toast.POSITION.TOP_CENTER,
							});
						}
					});

					handleFileUploadToS3(
						ownerPictures.files,
						res.data,
						ownerPictures.type,
					);
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
											min={dateTypes.today}
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
											min={dateTypes.today}
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
										htmlFor="front"
										className="block text-sm font-medium leading-6 text-gray-900"
									>
										This pcture will be displayed in the feed
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
															...displayPicture,
															files: [
																handleFileRenaming(
																	e.target.files[0],
																	"display",
																	setFilename,
																),
															],
													  })
													: ""
											}
										/>
										<img
											className="h-80 border-2 border-black p-1"
											src={
												displayPicture.files.length > 0
													? URL.createObjectURL(displayPicture.files[0])
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
									<div className="flex flex-col">
										<label
											htmlFor="front"
											className="block text-sm font-medium leading-6 text-gray-900"
										>
											Front
										</label>
										<div className="mt-2">
											<input
												id="front"
												name="front"
												type="file"
												required
												className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												onChange={(e) =>
													e.target.files.length > 0
														? setOwnerPictures({
																...ownerPictures,
																files: [
																	...ownerPictures.files,

																	handleFileRenaming(
																		e.target.files[0],
																		"front",
																	),
																],
														  })
														: ""
												}
											/>
											<img
												className="h-80 border-2 border-black p-1"
												src={
													ownerPictures.files.length > 0
														? URL.createObjectURL(ownerPictures.files[0])
														: ""
												}
											/>
										</div>
									</div>
									<div className="flex flex-col">
										<label
											htmlFor="back"
											className="block text-sm font-medium leading-6 text-gray-900"
										>
											Back
										</label>
										<div className="mt-2">
											<input
												id="back"
												name="back"
												type="file"
												required
												className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												onChange={(e) =>
													e.target.files.length > 0
														? setOwnerPictures({
																...ownerPictures,
																files: [
																	...ownerPictures.files,

																	handleFileRenaming(e.target.files[0], "back"),
																],
														  })
														: ""
												}
											/>
											<img
												className="h-80 border-2 border-black p-1"
												src={
													ownerPictures.files.length > 1
														? URL.createObjectURL(ownerPictures.files[1])
														: ""
												}
											/>
										</div>
									</div>
									<div className="flex flex-col">
										<label
											htmlFor="left"
											className="block text-sm font-medium leading-6 text-gray-900"
										>
											Left
										</label>
										<div className="mt-2">
											<input
												id="left"
												name="left"
												type="file"
												required
												className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												onChange={(e) =>
													e.target.files.length > 0
														? setOwnerPictures({
																...ownerPictures,
																files: [
																	...ownerPictures.files,

																	handleFileRenaming(e.target.files[0], "left"),
																],
														  })
														: ""
												}
											/>
											<img
												className="h-80 border-2 border-black p-1"
												src={
													ownerPictures.files.length > 2
														? URL.createObjectURL(ownerPictures.files[2])
														: ""
												}
											/>
										</div>
									</div>
									<div className="flex flex-col">
										<label
											htmlFor="right"
											className="block text-sm font-medium leading-6 text-gray-900"
										>
											Right
										</label>
										<div className="mt-2">
											<input
												id="right"
												name="right"
												type="file"
												required
												className="block w-full px-5 rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												onChange={(e) =>
													e.target.files.length > 0
														? setOwnerPictures({
																...ownerPictures,
																files: [
																	...ownerPictures.files,

																	handleFileRenaming(
																		e.target.files[0],
																		"right",
																	),
																],
														  })
														: ""
												}
											/>
											<img
												className="h-80 border-2 border-black p-1"
												src={
													ownerPictures.files.length > 3
														? URL.createObjectURL(ownerPictures.files[3])
														: ""
												}
											/>
										</div>
									</div>
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
