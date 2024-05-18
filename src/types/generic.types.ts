
interface Booking{
	id: number;
	customerEmail: string;
	start: Date;
	end: Date;
	status: Status;
}

interface TimeSlot{
	start: Date;
	end: Date;
}

interface BookingDTO {
	id: number;
	customerEmail: string;
	start: string;
	end: string;
	status: Status;
}

enum Status {
	BOOKED = "BOOKED",
	CANCELLED = "CANCELLED",
	PAID = "PAID",
	NO_SHOW = "NO_SHOW"
}

export {Status}
export type {TimeSlot, Booking, BookingDTO}