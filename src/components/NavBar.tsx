import {GiBowlingStrike} from "react-icons/gi";
import {Link, useNavigate} from "react-router-dom";
import {ReactNode, useState} from "react";
import {useUser, useClerk} from '@clerk/clerk-react';

function NavButton({to, children, onClick, selected}: { to: string, children: ReactNode, onClick?: () => void, selected?: boolean }) {
	return (
		<Link to={to} onClick={onClick}>
			<button
				className={
					selected
						? "text-gray-light font-semibold bg-gray p-4 w-56 cursor-default"
						: "text-gray font-semibold bg-gray-light p-4 w-56 hover:bg-gray-medium transition-colors"
				}
			>
				{children}
			</button>
		</Link>
	);
}

function NavBar() {
	const [selected, setSelected] = useState<string>(window.location.pathname);
	const { signOut } = useClerk();
	const { user } = useUser();
	const navigate = useNavigate();

	const handleLogout = () => {
		signOut();
		setSelected("/");
		navigate("/");
	};

	const getOrganization = () => {
		if (user) {
			return user.organizationMemberships.find(
				(org) => org.organization.name === 'operations' || org.organization.name === 'management'
			)?.organization.name;
		}
		return null;
	};

	const organization = getOrganization();

	return (
		<nav className="bg-gray w-full pl-32 pr-10 flex gap-2 items-center justify-between">
			<Link to={"/"} onClick={() => setSelected("/")}>
				<GiBowlingStrike className="text-8xl text-gray-light m-4" />
			</Link>
			<div className="flex justify-evenly items-center gap-10">
				{!user ? (
					<>
						<NavButton
							to={"/bowling"}
							onClick={() => setSelected("/bowling")}
							selected={selected === "/bowling"}
						>
							Bowling
						</NavButton>
						<NavButton
							to={"/airhockey"}
							onClick={() => setSelected("/airhockey")}
							selected={selected === "/airhockey"}
						>
							Airhockey
						</NavButton>
						<NavButton
							to={"/dinner"}
							onClick={() => setSelected("/dinner")}
							selected={selected === "/dinner"}
						>
							Dinner
						</NavButton>
						<NavButton
							to={"/login"}
							onClick={() => setSelected("/login")}
							selected={selected === "/login"}
						>
							Login
						</NavButton>
					</>
				) : (
					<>
						{organization === 'operations' && (
							<NavButton
								to={"/inventory"}
								onClick={() => setSelected("/inventory")}
								selected={selected === "/inventory"}
							>
								Inventory
							</NavButton>
						)}
						{organization === 'management' && (
							<>
								<NavButton
									to={"/inventory"}
									onClick={() => setSelected("/inventory")}
									selected={selected === "/inventory"}
								>
									Inventory
								</NavButton>
								<NavButton
									to={"/schedule"}
									onClick={() => setSelected("/schedule")}
									selected={selected === "/schedule"}
								>
									Schedule
								</NavButton>
							</>
						)}
						<NavButton
							to={"/"}
							onClick={handleLogout}
						>
							Logout
						</NavButton>
					</>
				)}
			</div>
		</nav>
	);
}

export default NavBar;
