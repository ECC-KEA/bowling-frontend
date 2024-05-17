import BookingCalendar from "../components/BookingCalendar.tsx";
import BookingForm from "../components/BookingForm.tsx";
import type {BowlingBooking, TimeSlot} from "../types/datatypes.ts";
import {useState} from "react";
import PageLayout from "../components/PageLayout.tsx";
import BookingDatePicker from "../components/BookingDatePicker.tsx";
import useBowlingBookings from "../hooks/useBowlingBookings.ts";
import ShowIf from "../components/ShowIf.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import {filterOutTimeslots, getAdjacentSelectedTimeslots} from "../helpers/bookinghelpers.ts";
import BookingConfirmationModal from "../components/BookingConfirmationModal.tsx";

function BowlingBooking() {
	const [selectedTimeslots, setSelectedTimeslots] = useState<TimeSlot[]>([]);
	const [childFriendly, setChildFriendly] = useState<boolean>(false);
	const [email, setEmail] = useState<string>("");
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [newBookings, setNewBookings] = useState<BowlingBooking[]>([]);
	const {bookings, createMany, loading, fromDate, setFromDate} = useBowlingBookings();
	const onSubmit = async () => {
		const newB = await createMany(selectedTimeslots
			.map((timeslot) => ({
				customerEmail: email,
				start: timeslot.start,
				end: timeslot.end,
				childFriendly: childFriendly
			})));
		setSelectedTimeslots([]);
		setEmail("");
		setChildFriendly(false);

		setShowConfirmation(true);
		setNewBookings(newB ?? []);
	}

	const onDismiss = () => {
		setShowConfirmation(false);
		setNewBookings([]);
	}

	const onTimeslotSelect = (timeslot: TimeSlot) => {
		const adjacentSelectedTimeslots = getAdjacentSelectedTimeslots(selectedTimeslots, timeslot);

		if (adjacentSelectedTimeslots.length === 0) {
			setSelectedTimeslots([...selectedTimeslots, timeslot]);
		} else {
			adjacentSelectedTimeslots.push(timeslot);
			adjacentSelectedTimeslots.sort((a, b) => a.start.getTime() - b.start.getTime());

			const newSelectedTimeslots = filterOutTimeslots(selectedTimeslots, adjacentSelectedTimeslots);

			const newTimeslot = {
				start: adjacentSelectedTimeslots[0].start,
				end: adjacentSelectedTimeslots[adjacentSelectedTimeslots.length - 1].end
			}

			setSelectedTimeslots([...newSelectedTimeslots, newTimeslot]);
		}
	}
	const onTimeslotDeselect = (timeslot: TimeSlot) => {
		setSelectedTimeslots(selectedTimeslots.filter((ts) => ts.start.getTime() !== timeslot.start.getTime()));
	}

	return (
		<PageLayout>
			<div className="flex gap-8 items-end relative">
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
								onChange={() => setChildFriendly(true)}
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
								onChange={() => setChildFriendly(false)}
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
						datePicker={<BookingDatePicker
							onDateChange={(date: Date | null) => setFromDate(date ?? new Date())}/>}
						fromDate={fromDate}
						bookings={bookings}
						setFromDate={setFromDate}
					/>
				</ShowIf>
				<ShowIf condition={loading}>
					<div className="flex items-center justify-center absolute w-full h-full">
						<LoadingSpinner/>
					</div>
				</ShowIf>
				<ShowIf condition={showConfirmation}>
					<BookingConfirmationModal onDismiss={onDismiss} newBookings={newBookings}/>
				</ShowIf>
			</div>
		</PageLayout>
	);
}

export default BowlingBooking;