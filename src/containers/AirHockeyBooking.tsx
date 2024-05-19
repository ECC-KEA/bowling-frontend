import BookingCalendar from "../components/BookingCalendar.tsx";
import BookingForm from "../components/BookingForm.tsx";
import type {TimeSlot} from "../types/generic.types.ts";
import {useState} from "react";
import PageLayout from "../components/PageLayout.tsx";
import BookingDatePicker from "../components/BookingDatePicker.tsx";
import ShowIf from "../components/ShowIf.tsx";
import LoadingSpinner from "../components/LoadingSpinner.tsx";
import BookingConfirmationModal from "../components/BookingConfirmationModal.tsx";
import type {AirHockeyBooking} from "../types/airhockey.types.ts";
import useAirHockeyBookings from "../hooks/useAirHockeyBookings.ts";
import {filterOutTimeslots, getAdjacentSelectedTimeslots} from "../helpers/timeslothelpers.ts";
import {isTableBooked} from "../helpers/airhockeyhelpers.ts";

function AirHockeyBooking() {
	const [selectedTimeslots, setSelectedTimeslots] = useState<TimeSlot[]>([]);
	const [email, setEmail] = useState<string>("");
	const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
	const [newBookings, setNewBookings] = useState<AirHockeyBooking[]>([]);
	const {bookings, tables, createMany, loading, fromDate, setFromDate} = useAirHockeyBookings();

	const onSubmit = async () => {
		const newB = await createMany(selectedTimeslots
			.map((timeslot) => ({
				customerEmail: email,
				start: timeslot.start,
				end: timeslot.end,
			})));
		setSelectedTimeslots([]);
		setEmail("");

		if(newB !== undefined){
			setShowConfirmation(true);
			setNewBookings(newB ?? []);
		}
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

	function isTimeSlotAvailable(timeSlot: TimeSlot): boolean{
		return tables.some((table) => !isTableBooked(bookings, table.id, timeSlot));
	}

	const getBookingPrice = (booking: AirHockeyBooking): number => {
		const duration = booking.end.getHours() - booking.start.getHours();
		const price = booking.table.pricePerHour ?? 0;
		return price * duration;
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
				</BookingForm>
				<ShowIf condition={!loading}>
					<BookingCalendar
						title={"Air Hockey"}
						selectedTimeslots={selectedTimeslots}
						onTimeslotSelect={onTimeslotSelect}
						onTimeslotDeselect={onTimeslotDeselect}
						datePicker={<BookingDatePicker onDateChange={(date: Date | null) => setFromDate(date ?? new Date())}/>}
						fromDate={fromDate}
						setFromDate={setFromDate}
						isTimeSlotAvailable={isTimeSlotAvailable}
					/>
				</ShowIf>
				<ShowIf condition={loading}>
					<div className="flex items-center justify-center absolute w-full h-full">
						<LoadingSpinner/>
					</div>
				</ShowIf>
				<ShowIf condition={showConfirmation}>
					<BookingConfirmationModal
						onDismiss={onDismiss}
						newBookings={newBookings}
						getPrice={getBookingPrice}
					/>
				</ShowIf>
			</div>
		</PageLayout>
	);
}

export default AirHockeyBooking;