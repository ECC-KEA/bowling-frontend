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

	const queryParam = {key: "fromDate", value: fromDate.toISOString()};

	const fetchBookings = async () => {
		try {
			const bookings = await dataService.getAll([queryParam]);
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


	return {bookings, loading, setFromDate};
}

export default useBowlingBookings;