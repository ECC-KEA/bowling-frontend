interface BookingDTO {
	id: number;
	customerEmail: string;
	start: string;
	end: string;
	status: Status;
}

interface BowlingBookingDTO extends BookingDTO {
	laneId: number;
	childFriendly: boolean;
}

enum Status {
	BOOKED = "BOOKED",
	CANCELLED = "CANCELLED",
	PAID = "PAID",
	NO_SHOW = "NO_SHOW"
}

export type {BowlingBookingDTO, Status}