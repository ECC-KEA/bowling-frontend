import type {Booking, BookingDTO} from "./generic.types.ts";

interface AirHockeyBooking extends Booking{
	table: AirHockeyTable;
}

interface AirHockeyBookingDTO extends BookingDTO {
	tableId: number;
}

interface AirHockeyTable {
	id: number;
	pricePerHour: number;
}

export type {AirHockeyBooking, AirHockeyBookingDTO, AirHockeyTable}