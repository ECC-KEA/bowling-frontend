import { Link } from 'react-router-dom';

function Home() {
	return (
		<div className="font-sans text-center p-6">
			<h1 className="text-4xl font-bold mb-4">Welcome to XP Bowling</h1>
			<p className="text-lg mb-10">Your premier destination for bowling, air hockey, and dining.</p>

			<div className="flex flex-col md:flex-row justify-around mt-10 space-y-6 md:space-y-0 md:space-x-6">
				<div className="flex-1 p-6 bg-gray-100 rounded-lg shadow-lg">
					<h2 className="text-2xl font-semibold mb-4">Bowling</h2>
					<p>
						Experience the thrill of bowling on our 24 state-of-the-art lanes, including 4 lanes specifically designed for children. Perfect for parties, events, or a fun night out with friends and family. Our lanes feature the latest scoring technology and comfortable seating areas.
					</p>
					<Link to="/book-bowling" className="inline-block mt-4">
						<button className="bg-gray-dark text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
							Book Now
						</button>
					</Link>
				</div>
				<div className="flex-1 p-6 bg-gray-100 rounded-lg shadow-lg">
					<h2 className="text-2xl font-semibold mb-4">Air Hockey</h2>
					<p>
						Challenge your friends to a game of air hockey on one of our 6 high-quality tables. Whether you're a seasoned pro or a casual player, our air hockey tables offer fast-paced fun and excitement for all ages. Enjoy a friendly competition or organize a tournament.
					</p>
					<Link to="/book-airhockey" className="inline-block mt-4">
						<button className="bg-gray-dark text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
							Book Now
						</button>
					</Link>
				</div>
				<div className="flex-1 p-6 bg-gray-100 rounded-lg shadow-lg">
					<h2 className="text-2xl font-semibold mb-4">Restaurant</h2>
					<p>
						Relax and refuel at our restaurant, which can accommodate up to 100 guests. Our menu features a variety of delicious options, from classic favorites to new and exciting dishes. Whether you're taking a break from bowling or just stopping by for a meal, our restaurant provides a welcoming atmosphere and great food.
					</p>
					<Link to="/book-restaurant" className="inline-block mt-4">
						<button className="bg-gray-dark text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
							Book Now
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Home;
