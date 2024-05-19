import {useEffect, useState} from "react";
import DataService from "../utils/DataService.ts";
import {Status} from "../types/generic.types.ts";
import toast from "react-hot-toast";
import {formatDateForJavaLocalDateTime} from "../utils/dateUtils.ts";
import {DinnerBooking, DinnerBookingDTO, Restaurant} from "../types/dinner.types.ts";

function useDinnerBookings() {
	const [bookings, setBookings] = useState<DinnerBooking[]>([]);
	const [restaurant, setRestaurant] = useState<Restaurant>(); 
	const [fromDate, setFromDate] = useState<Date>(new Date());
	const [loading, setLoading] = useState<boolean>(true);
	const dataService = new DataService<DinnerBookingDTO>("/dinner");
	const RestaurantDataService = new DataService<Restaurant>("/restaurant");

	const mapDTOToBooking = (dto: DinnerBookingDTO): DinnerBooking => {
		return {
			id: dto.id,
			customerEmail: dto.customerEmail,
			start: new Date(dto.start),
			end: new Date(dto.end),
			status: dto.status,
            numberOfGuests: dto.numberOfGuests,
		}
	}

	const mapBookingToDTO = (booking: Partial<DinnerBooking>): Partial<DinnerBookingDTO> => {
		return {
			customerEmail: booking.customerEmail,
			start: formatDateForJavaLocalDateTime(booking.start),
			end: formatDateForJavaLocalDateTime(booking.end),
			numberOfGuests: booking.numberOfGuests,
		}
	}

	const fetchRestaurant = async () => {
		try {
			const restaurant = await RestaurantDataService.getAll();
			setRestaurant(restaurant[0]);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to fetch tables: " + error.message);
			}
		}
	}

	const fetchBookings = async () => {
		try {
			const queryParams = [
				{
					key: "day", value: fromDate.getDate()
				},
				{
					key: "month", value: fromDate.getMonth()+1
				},
				{
					key: "year", value: fromDate.getFullYear()
				}
			];
			const bookings = await dataService.getAll(queryParams);
			setBookings(bookings.filter(b => b.status === Status.BOOKED || b.status === Status.PAID).map(mapDTOToBooking));
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to fetch bookings: " + error.message);
			}
		}
	}

	useEffect(() => {
		void fetchRestaurant();
	}, []);

	useEffect(() => {
		fetchBookings().then(() => setLoading(false));
	}, [restaurant, fromDate]);

	const create = async (booking: Partial<DinnerBooking>) => {
		try {
			const defaultBooking = {
				id: -1,
				customerEmail: "",
				start: new Date(),
				end: new Date(),
				status: Status.CANCELLED,
				numberOfGuests: -1,
			}
			booking = {...defaultBooking, ...booking};
			const dto = mapBookingToDTO(booking);
			const createdBooking = await dataService.create(dto);
			return mapDTOToBooking(createdBooking);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to create booking: " + error.message);
			}
			throw error;
		}
	}

	const createMany = async (bookings: Partial<DinnerBooking>[]) => {
		try{
			setLoading(true);
			const createdBookings = await Promise.all(bookings.map(create));
			setBookings((currentBookings) => [...currentBookings, ...createdBookings]);
			toast.success("Bookings created successfully");
			return createdBookings;
		} catch (error: unknown){
			if (error instanceof Error){
				toast.error("Failed to create bookings: " + error.message);
			}
		} finally {
			setLoading(false);
		}
	}

	return {bookings, restaurant, createMany, loading, fromDate, setFromDate};
}

export default useDinnerBookings;