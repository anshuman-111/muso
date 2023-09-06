import React, { useEffect } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import handleFileUploadToS3 from "../utils/AWSS3Upload";
import { handleFileRenaming } from "../utils/FileRenameForUpload";
import { axiosSecureInstance } from "../Hooks/AxiosInst";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { handleFileDownloadFromS3 } from "../utils/AWSS3Fetch";
const DashRentalDetails = () => {
	const axiosSecure = axiosSecureInstance();
	const location = useLocation();
	const data = location.state.data.rentalData;
	const type = location.state.data.type;

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
	const [filesRenterObj, setFilesRenterObj] = useState({
		front: "",
		back: "",
		left: "",
		right: "",
	});

	const [filesOwnerObj, setFilesOwnerObj] = useState({
		front: "",
		back: "",
		left: "",
		right: "",
	});
	const [filesFetchedRenterObj, setFilesFetchedRenterObj] = useState({
		front: "",
		back: "",
		left: "",
		right: "",
	});

	const [filesFetchedOwnerObj, setFilesFetchedOwnerObj] = useState({
		front: "",
		back: "",
		left: "",
		right: "",
	});
	const [isFetched, setIsFetched] = useState(false);
	const [matchScore, setMatchScore] = useState("");
	const fetchMatchScore = () => {
		try {
			const res = axiosSecure
				.get(`/rentals/matchrun/${data?.rental_id}`)
				.then((data) => setMatchScore(data?.data?.score));
		} catch (err) {
			console.log(err);
		}
	};
	console.log(matchScore);
	useEffect(() => {
		if (type === "taken") {
			handleFileDownloadFromS3(data?.rental_id, "completion").then((data) => {
				setFilesFetchedRenterObj(data);
				setIsFetched(true);
			});
			fetchMatchScore();
		}
		if (type === "posted") {
			handleFileDownloadFromS3(data?.rental_id, "creation").then((data) => {
				setFilesFetchedOwnerObj(data);
				setIsFetched(true);
			});
		}
		if (type === "given") {
			handleFileDownloadFromS3(data?.rental_id, "completion").then((data) => {
				setFilesFetchedRenterObj(data);
				setIsFetched(true);
			});
			handleFileDownloadFromS3(data?.rental_id, "creation").then((data) => {
				setFilesFetchedOwnerObj(data);
				setIsFetched(true);
			});
			fetchMatchScore();
		}
	}, []);

	const handleDeleteRental = () => {
		try {
			const res = axiosSecure
				.post(`/rentals/delete/${data?.rental_id}`)
				.then(() => window.history.back())
				.catch((err) =>
					toast.error(err.response.data.msg, {
						position: toast.POSITION.TOP_CENTER,
					}),
				);
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

						<div className="title-font font-medium text-lg text-gray-100">
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
						</div>
						{!(type === "posted") ? (
							matchScore ? (
								<div className="text-xl mt-3 text-white text-center">
									Images uploaded by the Owner and You are{" "}
									<span className="text-indigo-400 text-2xl">
										{matchScore}%{" "}
									</span>
									similar
								</div>
							) : (
								<p className="text-white text-xl">Loading ....</p>
							)
						) : (
							""
						)}
					</div>
					{!(type === "taken") && (
						<div className="flex flex-col">
							<h1 className="my-5 text-white text-xl">
								Images uploaded by you
							</h1>
							<div className="flex flex-row">
								{Object.values(filesFetchedOwnerObj).map((fileSrc) => (
									<img
										className="h-80 border-2 border-black p-1"
										src={fileSrc}
									/>
								))}
							</div>
						</div>
					)}

					{type === "given" && (
						<>
							<h1 className="my-5 text-white text-xl">
								Images uploaded by Renter
							</h1>
							{Object.values(filesRenterObj).length > 0 ? (
								<div className="flex flex-row">
									{Object.values(filesFetchedRenterObj).map((fileSrc) => (
										<img
											className="h-80 border-2 border-black p-1"
											src={fileSrc}
										/>
									))}
								</div>
							) : (
								<h1 className="my-5 text-white text-xl">
									Renter has not uploaded any files yet!
								</h1>
							)}
						</>
					)}
				</div>
				{type === "taken" && (
					<>
						<h1 className="my-5 text-white text-xl">
							Latest Files Uploaded By You
						</h1>
						{Object.values(filesRenterObj).length > 0 ? (
							<div className="flex flex-row">
								{Object.values(filesFetchedRenterObj).map((fileSrc) => (
									<img
										className="h-80 border-2 border-black p-1"
										src={fileSrc}
									/>
								))}
							</div>
						) : (
							<h1 className="my-5 text-white text-xl">
								You have not uploaded any files
							</h1>
						)}
						<div className="border-b border-gray-900/10 pb-2 pt-5 col-span-6">
							<h2 className="sm:text-lg text-base font-semibold leading-7 text-gray-100">
								Upload pictures of Front, Back, Left and Right sides of the
								instrument
							</h2>
						</div>
						<div className="flex flex-col sm:flex-row gap-x-2">
							{imageUploadSection.map(({ id, title }) => (
								<div className="flex flex-col" key={id}>
									<label
										htmlFor={title}
										className="block text-sm font-medium leading-6 text-gray-100"
									>
										{title}
									</label>
									<div className="mt-2">
										<input
											id={title}
											name={title}
											type="file"
											required
											className="block w-full px-5 rounded-md border-0 py-2 text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
											onChange={(e) =>
												e.target.files.length > 0
													? setFilesRenterObj({
															...filesRenterObj,
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
												filesRenterObj[title]
													? URL.createObjectURL(filesRenterObj[title])
													: ""
											}
										/>
									</div>
								</div>
							))}

							<button
								className="px-4 py-2 h-24 w-32 bg-indigo-600 mt-10 text-white font-semibold"
								onClick={() => {
									Object.values(filesRenterObj).every((file) => file)
										? handleFileUploadToS3(
												Object.values(filesRenterObj),
												data?.rental_id,
												"completion",
										  ).then(fetchMatchScore())
										: window.alert("Please add all files before confirming.");
								}}
							>
								Confirm Upload
							</button>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default DashRentalDetails;
