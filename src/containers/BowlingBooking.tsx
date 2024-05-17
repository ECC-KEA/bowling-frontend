import BookingCalendar from "../components/BookingCalendar.tsx";
import BookingForm from "../components/BookingForm.tsx";
import {TimeSlot} from "../types/datatypes.ts";
import {useState} from "react";
import PageLayout from "../components/PageLayout.tsx";
import BookingDatePicker from "../components/BookingDatePicker.tsx";
import useBowlingBookings from "../hooks/useBowlingBookings.ts";
import ShowIf from "../components/ShowIf.tsx";

function BowlingBooking() {
	const [selectedTimeslots, setSelectedTimeslots] = useState<TimeSlot[]>([]);
	const [childFriendly, setChildFriendly] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const {bookings, loading, fromDate, setFromDate} = useBowlingBookings();

	const onSubmit = () => {
		console.log("Booking submitted");
		console.log(selectedTimeslots);
		console.log(childFriendly);
		console.log(email);
	}

	const onTimeslotSelect = (timeslot: TimeSlot) => {
		setSelectedTimeslots([...selectedTimeslots, timeslot]);
	}
	const onTimeslotDeselect = (timeslot: TimeSlot) => {
		setSelectedTimeslots(selectedTimeslots.filter((ts) => ts.start.getTime() !== timeslot.start.getTime()));
	}

	return (
		<PageLayout>
			<div className="flex gap-8 items-end">
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
					<span className="font-semibold">
						Need child friendly lane?
					</span>
					<div className="flex gap-8">
						<label className="flex items-center gap-2">
							<input
								required={true}
								unselectable={"off"}
								type="radio"
								name="child-friendly"
								className="border ml- p-2 w-4 h-4 accent-blue-950"
								onInput={() => setChildFriendly(true)}
							/>
							Yes
						</label>
						<label className="flex items-center gap-2">
							<input
								required={true}
								unselectable={"off"}
								type="radio"
								name="child-friendly"
								className="border ml- p-2 w-4 h-4 accent-blue-950"
								onInput={() => setChildFriendly(false)}
							/>
							No
						</label>
					</div>
				</BookingForm>
				<ShowIf condition={!loading}>
					<BookingCalendar
						title={"Bowling"}
						selectedTimeslots={selectedTimeslots}
						onTimeslotSelect={onTimeslotSelect}
						onTimeslotDeselect={onTimeslotDeselect}
						datePicker={<BookingDatePicker onDateChange={(date: Date|null) => setFromDate(date ?? new Date())}/>}
						fromDate={fromDate}
						bookings={bookings}
						setFromDate={setFromDate}
					/>
				</ShowIf>
			</div>
		</PageLayout>
	);
}

export default BowlingBooking;