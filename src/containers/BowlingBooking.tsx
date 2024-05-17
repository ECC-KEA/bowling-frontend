import BookingCalendar from "../components/BookingCalendar.tsx";
import BookingForm from "../components/BookingForm.tsx";
import {TimeSlot} from "../types/datatypes.ts";
import {FormEvent, useState} from "react";
import PageLayout from "../components/PageLayout.tsx";

const timeslots = [
	{
		start: new Date(2021, 11, 10, 10, 0),
		end: new Date(2021, 11, 10, 11, 0)
	},
	{
		start: new Date(2021, 11, 10, 11, 0),
		end: new Date(2021, 11, 10, 12, 0)
	},
	{
		start: new Date(2021, 11, 10, 12, 0),
		end: new Date(2021, 11, 10, 13, 0)
	}
]

function BowlingBooking() {
	const [selectedTimeslots, setSelectedTimeslots] = useState<TimeSlot[]>(timeslots);
	const [childFriendly, setChildFriendly] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Booking submitted");
		console.log(selectedTimeslots);
		console.log(childFriendly);
		console.log(email);
	}

	return (
		<PageLayout>
			<h1>Bowling Booking</h1>
			<BookingForm
				selectedTimeslots={selectedTimeslots}
				setSelectedTimeslots={setSelectedTimeslots}
				onSubmit={onSubmit}
			>
				<input
					type="email"
					required={true}
					value={email}
					placeholder="Email"
					className="border p-2 text-black w-full"
					onChange={(e) => setEmail(e.target.value)}
				/>
				<div className="flex justify-between">
					<span className="font-semibold">
						Need child friendly lane?
					</span>
					<label className="flex items-center gap-2">
						No
						<input
							required={true}
							unselectable={"off"}
							type="radio"
							name="child-friendly"
							className="border ml- p-2 w-4 h-4 accent-blue-950"
							onInput={() => setChildFriendly(false)}
						/>
					</label>
					<label className="flex items-center gap-2">
						Yes
						<input
							required={true}
							unselectable={"off"}
							type="radio"
							name="child-friendly"
							className="border ml- p-2 w-4 h-4 accent-blue-950"
							onInput={() => setChildFriendly(true)}
						/>
					</label>
				</div>
			</BookingForm>
			<BookingCalendar/>
		</PageLayout>
	);
}

export default BowlingBooking;