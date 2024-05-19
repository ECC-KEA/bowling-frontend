import {TimeSlot} from "../types/generic.types.ts";
import {isSameTimeSlot} from "./timeslothelpers.ts";
import { DinnerBooking } from "../types/dinner.types.ts";

function isCapacityNotReached(numberOfGuests: number, bookings: DinnerBooking[], restaurantCapacity: number, timeSlot: TimeSlot): boolean {
    let capacity = restaurantCapacity;
    bookings.forEach((booking) => {
        if (isSameTimeSlot(booking, timeSlot)) {
            capacity -= booking.numberOfGuests;
        }
    });

    return (capacity -= numberOfGuests) >= 0;
}

export {isCapacityNotReached};
