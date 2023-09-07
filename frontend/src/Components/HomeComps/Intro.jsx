import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
const Intro = () => {
	const user = useContext(AuthContext);

	return (
		<div className="transition-opacity delay-200 ease-in">
			<div className="relative isolate pt-0 lg:px-8 z-40">
				<div className="mx-auto max-w-2xl py-10 sm:py-10 lg:py-10">
					<div className="text-center">
						<h1 className="text-4xl font-bold tracking-tighter text-heading-light sm:text-6xl">
							One-stop Rental Platform for Musical Instruments
						</h1>

						<div className="mt-10 flex items-center justify-center gap-x-6">
							<Link
								to={user.isAuth ? `dashboard/${user?.user?.username}` : "login"}
								className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm duration-500 ease-in-out  hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
							>
								Get started
							</Link>
							<a
								href="/feed"
								className="text-sm font-semibold leading-6 text-heading-light hover:bg-bg-secondary hover:text-black duration-500 ease-in-out p-2 rounded-md"
							>
								See Rentals in your area{" "}
								<span aria-hidden="true" className="text-inherit">
									→
								</span>
							</a>
						</div>
					</div>
				</div>
			</div>

			<svg
				className="w-full"
				width="100%"
				height="100%"
				viewBox="0 0 900 278.9"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M0 12.9032L30 14.5806C60 16.3871 120 19.7419 180 31.6129C240 43.4839 300 63.6129 360 81.5484C420 99.3549 480 114.839 540 107.097C600 99.3548 660 68.3871 720 46.7097C780 24.9032 840 12.5161 870 6.19353L900 0V320H870C840 320 780 320 720 320C660 320 600 320 540 320C480 320 420 320 360 320C300 320 240 320 180 320C120 320 60 320 30 320H0V12.9032Z"
					fill="#777DA7"
				/>
				<path
					d="M0 112.09L30 128.078C60 144.171 120 176.148 180 183.986C240 191.823 300 175.521 360 165.385C420 155.248 480 151.486 540 141.35C600 131.213 660 114.912 720 115.957C780 117.002 840 135.394 870 144.694L900 153.89V320.045H870C840 320.045 780 320.045 720 320.045C660 320.045 600 320.045 540 320.045C480 320.045 420 320.045 360 320.045C300 320.045 240 320.045 180 320.045C120 320.045 60 320.045 30 320.045H0V112.09Z"
					fill="#7CA0BB"
				/>
				<path
					d="M0 210.32L30 210.529C60 210.634 120 211.052 180 204.259C240 197.467 300 183.464 360 184.195C420 184.927 480 200.183 540 206.976C600 213.768 660 212.096 720 214.5C780 216.903 840 223.591 870 226.831L900 230.175V320.045H870C840 320.045 780 320.045 720 320.045C660 320.045 600 320.045 540 320.045C480 320.045 420 320.045 360 320.045C300 320.045 240 320.045 180 320.045C120 320.045 60 320.045 30 320.045H0V210.32Z"
					fill="#C8E0F4"
				/>
				<path
					d="M0 224.95L30 221.815C60 218.68 120 212.41 180 207.707C240 203.005 300 199.87 360 203.737C420 207.499 480 218.366 540 221.606C600 224.95 660 220.77 720 224.114C780 227.354 840 238.221 870 243.551L900 248.985V320.045H870C840 320.045 780 320.045 720 320.045C660 320.045 600 320.045 540 320.045C480 320.045 420 320.045 360 320.045C300 320.045 240 320.045 180 320.045C120 320.045 60 320.045 30 320.045H0V224.95Z"
					fill="#C5DBD6"
				/>
				<path
					d="M0 230.175L30 235.713C60 241.356 120 252.433 180 260.48C240 268.526 300 273.333 360 270.198C420 267.063 480 255.987 540 249.194C600 242.402 660 239.893 720 238.848C780 237.803 840 238.221 870 238.326L900 238.535V320.045H870C840 320.045 780 320.045 720 320.045C660 320.045 600 320.045 540 320.045C480 320.045 420 320.045 360 320.045C300 320.045 240 320.045 180 320.045C120 320.045 60 320.045 30 320.045H0V230.175Z"
					fill="#040F16"
				/>
			</svg>
		</div>
	);
};

export default Intro;
