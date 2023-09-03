
import Intro from "./HomeComps/Intro";
import Featured from "./HomeComps/Featured";


const Home = () => {
	return (
		<div>
			<Intro />
			<Featured />

			<div className="text-center text-white text-md pb-10">
				Made by Anshuman Gupta
			</div>
		</div>
	);
};

export default Home