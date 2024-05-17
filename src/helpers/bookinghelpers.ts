import {Booking, TimeSlot} from "../types/datatypes.ts";
import {isSameDay} from "../utils/dateUtils.ts";

function isTimeSlotAvailable(bookings: Booking[], timeSlot: TimeSlot): boolean {
	return !bookings.some(b => {
		return isSameDay(b.start, timeSlot.start) && b.start.getHours() === timeSlot.start.getHours();
	});
}

function isTimeSlotSelected(selectedTimeslots: TimeSlot[], timeSlot: TimeSlot): boolean {
	return selectedTimeslots.some(ts => {
		return isSameDay(ts.start, timeSlot.start) && ts.start.getHours() === timeSlot.start.getHours();
	});
}

export {isTimeSlotAvailable, isTimeSlotSelected};