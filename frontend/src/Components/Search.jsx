import React, { useState } from "react";

const Search = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [searchFilters, setSearchFilters] = useState({
		suburb: "",
		maxPrice: "",
		minPrice: "",
		availableFrom: "",
	});

	console.log(searchFilters);
	return (
		<div className=" flex flex-col justify-center items-center gap-4 flex-wrap pt-8 mx-auto">
			<input
				name="search"
				type="text"
				placeholder="What are you looking for?"
				className="w-2/4 mr-1 p-4 sm:h-10 md:h-10 lg:h-12 text-md lg:text-lg sm:text-sm rounded-md"
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<div className="flex flex-row gap-6">
				<div className="flex flex-col justify-center items-center">
					<label htmlFor="availableFrom" className="text-white">
						Available From
					</label>
					<input
						type="date"
						name="availableFrom"
						placeholder="Available From"
						className="p-3 rounded-lg"
						onChange={(e) =>
							setSearchFilters({
								...searchFilters,
								availableFrom: e.target.value,
							})
						}
					/>
				</div>
				<div className="flex flex-col justify-center items-center">
					<label htmlFor="minPrice" className="text-white">
						Min Price
					</label>
					<input
						type="number"
						name="minPrice"
						placeholder="0"
						className="p-3 w-20 rounded-lg"
						onChange={(e) =>
							setSearchFilters({ ...searchFilters, minPrice: e.target.value })
						}
					/>
				</div>
				<div className="flex flex-col justify-center items-center">
					<label htmlFor="maxPrice" className="text-white">
						Max Price
					</label>
					<input
						type="number"
						name="maxPrice"
						placeholder="100"
						className="p-3 w-20 rounded-lg"
						onChange={(e) =>
							setSearchFilters({ ...searchFilters, maxPrice: e.target.value })
						}
					/>
				</div>
				<div className="flex flex-col justify-center items-center">
					<label htmlFor="suburb" className="text-white">
						Suburb
					</label>
					<input
						type="text"
						name="suburb"
						placeholder="Suburb"
						className="p-3 rounded-lg"
						onChange={(e) =>
							setSearchFilters({ ...searchFilters, suburb: e.target.value })
						}
					/>
				</div>
			</div>
			<button className="bg-bg-secondary text-heading-dark w-1/3 sm:h-10 md:h-10 lg:h-12 rounded-md sm:text-sm md:text-md lg:text-lg">
				Search
			</button>
		</div>
	);
};

export default Search;
