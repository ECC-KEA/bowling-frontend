import {Status} from "./transfertypes.ts";

interface Booking{
	id: number;
	customerEmail: string;
	start: Date;
	end: Date;
	status: Status;
}

interface BowlingBooking extends Booking{
	laneId: number;
	childFriendly: boolean;
}

export type {BowlingBooking}