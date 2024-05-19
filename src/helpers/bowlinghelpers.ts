import {TimeSlot} from "../types/generic.types.ts";
import {BowlingBooking, BowlingLane} from "../types/bowling.types.ts";
import {isSameTimeSlot} from "./timeslothelpers.ts";

function isLaneBooked(bookings: BowlingBooking[], laneId: number, timeSlot: TimeSlot): boolean {
	return bookings.some((booking) => {
		const bookingTimeSlot = {
			start: booking.start,
			end: booking.end
		}
		return booking.lane.id === laneId && isSameTimeSlot(bookingTimeSlot, timeSlot)
	});
}

function isChildFriendlyAvailable(lanes: BowlingLane[], bookings: BowlingBooking[], timeSlot: TimeSlot): boolean {
	return lanes.some((lane) => {
		return !isLaneBooked(bookings, lane.id, timeSlot) && lane.childFriendly;
	});
}

function isNotChildFriendlyAvailable(lanes: BowlingLane[], bookings: BowlingBooking[], timeSlot: TimeSlot): boolean {
	return lanes.some((lane) => {
		return !isLaneBooked(bookings, lane.id, timeSlot) && !lane.childFriendly;
	});
}

export {isLaneBooked, isChildFriendlyAvailable, isNotChildFriendlyAvailable};