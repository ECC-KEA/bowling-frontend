import {TimeSlot} from "../types/generic.types.ts";
import {isBetween, isSameDay} from "../utils/dateUtils.ts";
import {BowlingBooking, BowlingLane} from "../types/bowling.types.ts";

function isTimeSlotInList(selectedTimeslots: TimeSlot[], timeSlot: TimeSlot): boolean {
	return selectedTimeslots.some(ts => isSameTimeSlot(ts, timeSlot));
}

function getTimeslotLength(timeSlot: TimeSlot): number {
	return timeSlot.end.getHours() - timeSlot.start.getHours();
}

function isSameTimeSlot(timeSlot1: TimeSlot, timeSlot2: TimeSlot): boolean {
	return ((isSameDay(timeSlot1.start, timeSlot2.start) && timeSlot1.start.getHours() === timeSlot2.start.getHours())
		|| (isSameDay(timeSlot1.end, timeSlot2.end) && timeSlot1.end.getHours() === timeSlot2.end.getHours()))
		|| (isSameDay(timeSlot1.start, timeSlot2.start) && getTimeslotLength(timeSlot1) > 1 && isBetween(timeSlot2.start, timeSlot1.start, timeSlot1.end));
}

function getAdjacentSelectedTimeslots(selectedTimeslots: TimeSlot[], timeslot: TimeSlot): TimeSlot[] {
	return selectedTimeslots.filter((ts) => {
		return isSameDay(ts.start, timeslot.start)
			&& (ts.end.getHours() === timeslot.start.getHours()
			|| ts.start.getHours() === timeslot.end.getHours());
	});
}

function filterOutTimeslots(timeSlotsToFilter: TimeSlot[], timeSlotsToRemove: TimeSlot[]): TimeSlot[] {
	return timeSlotsToFilter.filter((ts) => !isTimeSlotInList(timeSlotsToRemove, ts));
}

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

export {isTimeSlotInList, getAdjacentSelectedTimeslots, filterOutTimeslots, isSameTimeSlot, isLaneBooked, isChildFriendlyAvailable, isNotChildFriendlyAvailable};