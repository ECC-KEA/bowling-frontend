import {useEffect, useState} from "react";
import type {BowlingBooking} from "../types/datatypes.ts";
import DataService from "../utils/DataService.ts";
import {BowlingBookingDTO, Status} from "../types/transfertypes.ts";
import toast from "react-hot-toast";
import {formatDateForJavaLocalDateTime} from "../utils/dateUtils.ts";

function useBowlingBookings() {
	const [bookings, setBookings] = useState<BowlingBooking[]>([]);
	const [fromDate, setFromDate] = useState<Date>(new Date());
	const [loading, setLoading] = useState<boolean>(true);
	const dataService = new DataService<BowlingBookingDTO>("/bowling");

	const mapDTOToBooking = (dto: BowlingBookingDTO): BowlingBooking => {
		return {
			id: dto.id,
			customerEmail: dto.customerEmail,
			start: new Date(dto.start),
			end: new Date(dto.end),
			status: dto.status,
			laneId: dto.laneId,
			childFriendly: dto.childFriendly
		}
	}

	const mapBookingToDTO = (booking: Partial<BowlingBooking>): Partial<BowlingBookingDTO> => {
		return {
			customerEmail: booking.customerEmail,
			start: formatDateForJavaLocalDateTime(booking.start),
			end: formatDateForJavaLocalDateTime(booking.end),
			childFriendly: booking.childFriendly ?? false
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
			setBookings(bookings.map(mapDTOToBooking));
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to fetch bookings: " + error.message);
			}
		}
	}

	useEffect(() => {
		fetchBookings().finally(() => setLoading(false));
	}, [fromDate]);

	const create = async (booking: Partial<BowlingBooking>) => {
		try {
			const defaultBooking = {
				id: -1,
				customerEmail: "",
				start: new Date(),
				end: new Date(),
				status: Status.CANCELLED,
				laneId: -1,
				childFriendly: false
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

	const createMany = async (bookings: Partial<BowlingBooking>[]) => {
		try{
			setLoading(true);
			const createdBookings = await Promise.all(bookings.map(create));
			setBookings((currentBookings) => [...currentBookings, ...createdBookings]);
			setLoading(false);
			toast.success("Bookings created successfully");
			return createdBookings;
		} catch (error: unknown){
			if (error instanceof Error){
				toast.error("Failed to create bookings: " + error.message);
			}
		}
	}

	return {bookings, createMany, loading, fromDate, setFromDate};
}

export default useBowlingBookings;