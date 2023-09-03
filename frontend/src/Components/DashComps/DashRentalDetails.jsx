import React from "react";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import handleFileUploadToS3 from "../utils/AWSS3Upload";
import { handleFileRenaming } from "../utils/FileRenameForUpload";
import { axiosSecureInstance } from "../Hooks/AxiosInst";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DashRentalDetails = () => {
	const axiosSecure = axiosSecureInstance();
	const location = useLocation();
	const data = location.state.data.rentalData;
	const type = location.state.data.type;
	const { user } = useContext(AuthContext);

	const [renterPictures, setRenterPictures] = useState({
		type: "completion",
		files: [],
	});

	const handleDeleteRental = () => {
		try {
			const res = axiosSecure
				.post(`/rentals/delete/${data?.rental_id}`)
				.catch((err) =>
					toast.error(err.response.data.msg, {
						position: toast.POSITION.TOP_CENTER,
					}),
				);
			if (res.status == 200) {
				window.history.back();
			}
		} catch (err) {
			console.log("ERROR");
		}
	};

	return (
		<>
			<ToastContainer />
			<div className="container px-5 py-24 mx-auto">
				<button
					className="px-5 py-1 absolute bg-indigo-200 text-indigo-900"
					onClick={() => window.history.back()}
				>
					Back
				</button>
				<div className="lg:w-4/5 mx-auto flex flex-wrap">
					<img
						alt="ecommerce"
						className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
						src={data?.rental_image_url}
					/>
					<div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
						<h1 className="text-white text-3xl title-font font-medium mb-1">
							{data?.rental_title}
						</h1>
						<p className="leading-relaxed text-white text-lg py-3">
							{data?.rental_instrument_type}
						</p>
						<p className="leading-relaxed w-full break-words text-black bg-white p-5 rounded-lg">
							{data?.rental_desc}
						</p>
						<div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5"></div>
						<div className="flex">
							<span className="title-font font-medium text-3xl text-gray-100">
								${data?.rental_rate} per {data?.rental_frequency}
							</span>
							{type === "posted" && (
								<button
									className="flex ml-auto text-white bg-red-700 border-0 py-2 px-6 focus:outline-none hover:bg-red-900 rounded"
									onClick={handleDeleteRental}
								>
									Delete Rental
								</button>
							)}
							{type === "given" && (
								<p className="flex ml-auto text-red-300 text-lg">
									Rental is currently active!
								</p>
							)}
						</div>
						<p className="title-font font-medium text-xl pt-2.5 text-gray-100">
							Wollongong
						</p>
						<p className="title-font font-normal text-lg py-5 text-gray-100">
							Owned By {data?.owner_username}
						</p>

						<p className="title-font font-medium text-lg text-gray-100">
							{" "}
							{data?.renter_username ? (
								<p className="title-font font-medium text-lg text-gray-100">
									Rented By: {data?.renter_username}
								</p>
							) : (
								<p className="title-font font-medium text-lg text-red-400">
									Not rented yet!
								</p>
							)}
						</p>
					</div>
				</div>
				{type === "taken" && (
					<>
						<div className="border-b border-gray-900/10 pb-2 pt-5 col-span-6">
							<h2 className="sm:text-lg text-base font-semibold leading-7 text-gray-100">
								Upload pictures of Front, Back, Left and Right sides of the
								instrument
							</h2>
						</div>
						<div className="flex flex-col sm:flex-row gap-x-2">
							<div className="flex flex-col">
								<label
									htmlFor="front"
									className="block text-sm font-medium leading-6 text-gray-100"
								>
									Front
								</label>
								<div className="mt-2">
									<input
										id="front"
										name="front"
										type="file"
										required
										className="block w-full px-5 rounded-md border-0 py-2 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={(e) =>
											e.target.files.length > 0
												? setRenterPictures({
														...renterPictures,
														files: [
															...renterPictures.files,

															handleFileRenaming(e.target.files[0], "front"),
														],
												  })
												: ""
										}
									/>
									<img
										className="h-80 border-2 border-black p-1"
										src={
											renterPictures.files.length > 0
												? URL.createObjectURL(renterPictures.files[0])
												: ""
										}
									/>
								</div>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="back"
									className="block text-sm font-medium leading-6 text-gray-100"
								>
									Back
								</label>
								<div className="mt-2">
									<input
										id="back"
										name="back"
										type="file"
										required
										className="block w-full px-5 rounded-md border-0 py-2 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={(e) =>
											e.target.files.length > 0
												? setRenterPictures({
														...renterPictures,
														files: [
															...renterPictures.files,

															handleFileRenaming(e.target.files[0], "back"),
														],
												  })
												: ""
										}
									/>
									<img
										className="h-80 border-2 border-black p-1"
										src={
											renterPictures.files.length > 1
												? URL.createObjectURL(renterPictures.files[1])
												: ""
										}
									/>
								</div>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="left"
									className="block text-sm font-medium leading-6 text-gray-100"
								>
									Left
								</label>
								<div className="mt-2">
									<input
										id="left"
										name="left"
										type="file"
										required
										className="block w-full px-5 rounded-md border-0 py-2 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={(e) =>
											e.target.files.length > 0
												? setRenterPictures({
														...renterPictures,
														files: [
															...renterPictures.files,

															handleFileRenaming(e.target.files[0], "left"),
														],
												  })
												: ""
										}
									/>
									<img
										className="h-80 border-2 border-black p-1"
										src={
											renterPictures.files.length > 2
												? URL.createObjectURL(renterPictures.files[2])
												: ""
										}
									/>
								</div>
							</div>
							<div className="flex flex-col">
								<label
									htmlFor="right"
									className="block text-sm font-medium leading-6 text-gray-100"
								>
									Right
								</label>
								<div className="mt-2">
									<input
										id="right"
										name="right"
										type="file"
										required
										className="block w-full px-5 rounded-md border-0 py-2 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										onChange={(e) =>
											e.target.files.length > 0
												? setRenterPictures({
														...renterPictures,
														files: [
															...renterPictures.files,

															handleFileRenaming(e.target.files[0], "right"),
														],
												  })
												: ""
										}
									/>
									<img
										className="h-80 border-2 border-black p-1"
										src={
											renterPictures.files.length > 3
												? URL.createObjectURL(renterPictures.files[3])
												: ""
										}
									/>
								</div>
								<button
									className="px-4 py-2 h-24 w-32 bg-indigo-600 mt-10 text-white font-semibold"
									onClick={() => {
										renterPictures.files.length === 4
											? handleFileUploadToS3(
													renterPictures.files,
													data?.rental_id,
													renterPictures.type,
											  )
											: window.alert(renterPictures.files.length);
									}}
								>
									Confirm Upload
								</button>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default DashRentalDetails;
