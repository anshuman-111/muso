import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
const RentalDetail = () => {
	const user = useContext(AuthContext);
	const location = useLocation();
	const nav = useNavigate();
	const data = location.state.data;
	console.log(data);
	return (
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

						<button
							className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded"
							onClick={() =>
								user.isAuth
									? nav("/rentout/1", { state: { data: data } })
									: nav("/login")
							}
						>
							Get Rental
						</button>
					</div>
					<p className="title-font font-medium text-xl text-gray-100">
						Wollongong
					</p>
					<p className="title-font font-medium text-sm text-gray-100">
						Owned By {data?.owner_username}
					</p>
				</div>
			</div>
		</div>
	);
};

export default RentalDetail;
