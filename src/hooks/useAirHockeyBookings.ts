import {useEffect, useState} from "react";
import DataService from "../utils/DataService.ts";
import {Status} from "../types/generic.types.ts";
import toast from "react-hot-toast";
import {formatDateForJavaLocalDateTime} from "../utils/dateUtils.ts";
import {AirHockeyBooking, AirHockeyBookingDTO, AirHockeyTable} from "../types/airhockey.types.ts";

function useAirHockeyBookings() {
	const [bookings, setBookings] = useState<AirHockeyBooking[]>([]);
	const [tables, setTables] = useState<AirHockeyTable[]>([]);
	const [fromDate, setFromDate] = useState<Date>(new Date());
	const [loading, setLoading] = useState<boolean>(true);
	const dataService = new DataService<AirHockeyBookingDTO>("/airhockey");
	const airHockeyTableDataService = new DataService<AirHockeyTable>("/tables");

	const defaultTable = {
		id: -1,
		pricePerHour: 0
	}

	const mapDTOToBooking = (dto: AirHockeyBookingDTO): AirHockeyBooking => {
		return {
			id: dto.id,
			customerEmail: dto.customerEmail,
			start: new Date(dto.start),
			end: new Date(dto.end),
			status: dto.status,
			table: tables.find(l => l.id === dto.tableId) ?? defaultTable
		}
	}

	const mapBookingToDTO = (booking: Partial<AirHockeyBooking>): Partial<AirHockeyBookingDTO> => {
		return {
			customerEmail: booking.customerEmail,
			start: formatDateForJavaLocalDateTime(booking.start),
			end: formatDateForJavaLocalDateTime(booking.end)
		}
	}

	const fetchLanes = async () => {
		try {
			const lanes = await airHockeyTableDataService.getAll();
			setTables(lanes);
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
		void fetchLanes();
	}, []);

	useEffect(() => {
		fetchBookings().then(() => setLoading(false));
	}, [tables, fromDate]);

	const create = async (booking: Partial<AirHockeyBooking>) => {
		try {
			const defaultBooking = {
				id: -1,
				customerEmail: "",
				start: new Date(),
				end: new Date(),
				status: Status.CANCELLED,
				tableId: -1,
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

	const createMany = async (bookings: Partial<AirHockeyBooking>[]) => {
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

	return {bookings, tables, createMany, loading, fromDate, setFromDate};
}

export default useAirHockeyBookings;