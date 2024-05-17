import {Booking, TimeSlot} from "../types/datatypes.ts";
import {isBetween, isSameDay} from "../utils/dateUtils.ts";

function isTimeSlotAvailable(bookings: Booking[], timeSlot: TimeSlot): boolean {
	return !bookings.some(b => {
		const bookingTimeSlot = {
			start: b.start,
			end: b.end
		}
		return isSameTimeSlot(bookingTimeSlot, timeSlot);
	});
}

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

export {isTimeSlotAvailable, isTimeSlotInList, getAdjacentSelectedTimeslots, filterOutTimeslots};