import React, { useEffect, useState } from "react";
import { axiosInstance } from "./Hooks/AxiosInst";
import heroImg from "../assets/hero-image.jpg";
import RentalCard from "./FeedComps/RentalCard";

const Feed = () => {
	const [feed, setFeed] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const res = await axiosInstance.get("/rentals/feed");
				if (res.status === 200) {
					console.log(res.data);
					setFeed(res.data);
					setLoading(false);
				}
			} catch (err) {
				console.log(err);
			}
		};
		fetchData();
	}, []);

	return (
		<div className="">
			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Products</h2>

				<div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
					{feed.map((rental) => (
						<RentalCard data={rental} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Feed;
