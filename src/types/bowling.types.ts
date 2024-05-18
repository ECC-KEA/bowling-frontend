import type {Booking, BookingDTO} from "./generic.types.ts";

interface BowlingBooking extends Booking{
	lane: BowlingLane;
	childFriendly: boolean;
}

interface BowlingBookingDTO extends BookingDTO {
	laneId: number;
	childFriendly: boolean;
}

interface BowlingLane {
	id: number;
	childFriendly: boolean;
	pricePerHour: number;
}

export type {BowlingBooking, BowlingBookingDTO, BowlingLane}