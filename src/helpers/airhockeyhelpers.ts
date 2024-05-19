import type {TimeSlot} from "../types/generic.types.ts";
import type {AirHockeyBooking} from "../types/airhockey.types.ts";
import {isSameTimeSlot} from "./timeslothelpers.ts";

function isTableBooked(bookings: AirHockeyBooking[], tableId: number, timeSlot: TimeSlot): boolean {
	return bookings.some((booking) => {
		return booking.table.id === tableId && isSameTimeSlot(booking, timeSlot);
	});
}

export {isTableBooked};