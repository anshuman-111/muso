import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RentalCard = ({ data }) => {
	const nav = useNavigate();
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
	return (
		<div
			className="w-full -mt-12 mx-auto"
			onClick={() =>
				nav(`/rental/${data?.rental_id}`, { state: { data: data } })
			}
		>
			<div className="flex items-center justify-center">
				<div className="max-w-sm w-full py-6 px-3">
					<div className="bg-white shadow-xl rounded-lg overflow-hidden w-full h-full">
						<div>
							<img
								src={data?.rental_image_url}
								className="bg-cover h-[30rem]"
							/>
						</div>
						<div className="p-4 mt-6">
							<p className="uppercase tracking-wide text-sm font-bold text-gray-700">
								{data.rental_title}
							</p>
							<span className="text-3xl text-gray-900">
								${data.rental_rate} per {data.rental_frequency}
							</span>
						</div>
						<div className="flex p-4 border-t border-gray-300 text-gray-700">
							<div className="flex-1 inline-flex items-center">
								<p>
									<span className="text-gray-900 font-bold">
										{data.rental_location}
									</span>
								</p>
							</div>
						</div>
						<div className="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
							<div className="text-xs uppercase font-bold text-gray-600 tracking-wide">
								Owner
							</div>
							<div className="flex items-center pt-2">
								<div>
									<p className="font-bold text-gray-900">
										{data?.owner_username}
									</p>
								</div>
							</div>
							<div className="flex items-center pt-2">
								<div>
									<span className="font-bold text-gray-900">
										Available From: {handleDateFormat(data?.rental_avail_start)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RentalCard;
