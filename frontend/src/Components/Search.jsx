import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "./Hooks/AxiosInst";
import { useSearchParams } from "react-router-dom";
import RentalCard from "./FeedComps/RentalCard";

const Search = () => {
	const [searchFilters, setSearchFilters] = useState({
		query: "",
		suburb: "",
		max: 0,
		min: 0,
		from: "",
	});
	const [LSFetchMsg, setLSFetchMsg] = useState("");
	useEffect(() => {
		const resultsStoredInLS = localStorage.getItem("results");
		const searchedOnInLS = Number(
			JSON.parse(localStorage.getItem("searchedOn")),
		);
		if (Number(Date.now() - searchedOnInLS) > 300000) {
			localStorage.clear();
			setResults([]);
		}

		if (resultsStoredInLS) {
			setLSFetchMsg("Showing search results for last search");
			setResults(JSON.parse(resultsStoredInLS));
		}
	}, []);
	const storeResults = (results) => {
		localStorage.setItem("results", JSON.stringify(results));
		localStorage.setItem("searchedOn", JSON.stringify(Date.now()));
	};
	const [searchParams, setSearchParams] = useSearchParams();
	const [results, setResults] = useState([]);
	const handleSearchSubmit = async (event) => {
		setSearchParams(searchFilters);
		event.preventDefault();

		const fetchResults = async () => {
			try {
				const res = await axiosInstance.get(
					`feed/search?search=${searchFilters.query}&from=${searchFilters.from}&min=${searchFilters.min}&max=${searchFilters.max}&suburb=${searchFilters.suburb}`,
				);
				if (res.status === 200) {
					setResults(res?.data?.results);
					storeResults(res?.data?.results);
				}
			} catch (err) {
				console.log(err);
			}
		};

		fetchResults();
	};

	const clearLS = () => {
		localStorage.clear();
		setResults([]);
	};
	return (
		<>
			<form
				className=" flex flex-col justify-center items-center gap-4 flex-wrap pt-8 mx-auto"
				onSubmit={handleSearchSubmit}
			>
				<input
					name="search"
					type="text"
					placeholder="What are you looking for?"
					className="w-2/4 mr-1 p-4 sm:h-10 md:h-10 lg:h-12 text-md lg:text-lg sm:text-sm rounded-md"
					onChange={(e) =>
						setSearchFilters({
							...searchFilters,
							query: e.target.value,
						})
					}
				/>
				<div className="flex flex-row gap-6">
					<div className="flex flex-col justify-center items-center">
						<label htmlFor="from" className="text-white">
							Available From
						</label>
						<input
							type="date"
							name="from"
							placeholder="Available From"
							className="p-3 rounded-lg"
							onChange={(e) =>
								setSearchFilters({
									...searchFilters,
									from: new Date(e.target.value).toISOString().split("T")[0],
								})
							}
						/>
					</div>
					<div className="flex flex-col justify-center items-center">
						<label htmlFor="min" className="text-white">
							Min Price
						</label>
						<input
							type="number"
							name="min"
							min={0}
							placeholder="0"
							className="p-3 w-20 rounded-lg"
							onChange={(e) =>
								setSearchFilters({ ...searchFilters, min: e.target.value })
							}
						/>
					</div>
					<div className="flex flex-col justify-center items-center">
						<label htmlFor="max" className="text-white">
							Max Price
						</label>
						<input
							type="number"
							name="max"
							placeholder="100"
							min={0}
							className="p-3 w-20 rounded-lg"
							onChange={(e) =>
								setSearchFilters({ ...searchFilters, max: e.target.value })
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
				<button
					type="submit"
					className="bg-bg-secondary text-heading-dark w-1/3 sm:h-10 md:h-10 lg:h-12 rounded-md sm:text-sm md:text-md lg:text-lg"
				>
					Search
				</button>
			</form>
			{results.length > 0 && (
				<div className="text-xl text-red-200 font-bold text-center gap-y-3 flex flex-col mt-2">
					{LSFetchMsg}{" "}
					{LSFetchMsg.length > 0 && (
						<button
							className="bg-indigo-600 text-md text-white w-1/10 mx-auto p-2 rounded-xl"
							onClick={() => clearLS()}
						>
							Clear Previous Search Results
						</button>
					)}
				</div>
			)}

			<div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-8">
				<div className="grid mt-10 mx-auto grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 xl:gap-x-8">
					{results.map((rental) => (
						<RentalCard data={rental} />
					))}
				</div>
			</div>
		</>
	);
};

export default Search;
