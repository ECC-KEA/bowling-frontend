import {useEffect, useState} from "react";
import type {BowlingBooking} from "../types/datatypes.ts";
import DataService from "../utils/DataService.ts";
import {BowlingBookingDTO} from "../types/transfertypes.ts";
import toast from "react-hot-toast";

function useBowlingBookings() {
	const [bookings, setBookings] = useState<BowlingBooking[]>([]);
	const [fromDate, setFromDate] = useState<Date>(new Date());
	const [loading, setLoading] = useState<boolean>(true);
	const dataService = new DataService<BowlingBooking, BowlingBookingDTO>("/bowling");

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


	return {bookings, loading, fromDate, setFromDate};
}

export default useBowlingBookings;