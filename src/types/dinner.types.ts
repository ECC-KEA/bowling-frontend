import type {Booking, BookingDTO} from "./generic.types.ts";

interface DinnerBooking extends Booking{
	numberOfGuests: number;
}
interface DinnerBookingDTO extends BookingDTO {
    numberOfGuests: number;
}
interface Restaurant {
    id: number;
    capacity: number;
}

export type {DinnerBooking, DinnerBookingDTO, Restaurant}