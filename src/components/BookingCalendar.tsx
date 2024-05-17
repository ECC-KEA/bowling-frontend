import type {Booking, TimeSlot} from "../types/datatypes.ts";
import {ReactNode, useEffect, useState} from "react";
import {formatDate} from "../utils/dateUtils.ts";
import {isTimeSlotAvailable, isTimeSlotInList} from "../helpers/bookinghelpers.ts";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";


interface TimeSlotBoxProps {
	timeSlot: TimeSlot;
	onSelect: () => void;
	onDeselect: () => void;
	available: boolean;
	selected: boolean;
}

function TimeSlotBox({timeSlot, onSelect, onDeselect, available, selected}: TimeSlotBoxProps) {
	const [isSelected, setIsSelected] = useState(selected);

	useEffect(() => {
		setIsSelected(selected);
	}, [selected]);

	return (
		<div
			className={
				isSelected ? "rounded p-2 text-center font-semibold bg-blue-700 hover:bg-blue-800 cursor-pointer select-none transition-colors" :
					available
						? "rounded p-2 text-center font-semibold bg-green hover:bg-green-800 cursor-pointer select-none transition-colors"
						: "rounded p-2 text-center font-semibold bg-red text-gray select-none transition-colors"
			}
			onClick={() => {
				available ? onSelect() : undefined;
				isSelected ? onDeselect() : undefined;
				setIsSelected(!isSelected)
			}}
		>
			{timeSlot.start.getHours()}:00 - {timeSlot.end.getHours()}:00
		</div>
	);
}

interface TimeSlotGroupProps {
	date: Date;
	bookings: Booking[];
	onTimeslotSelect: (timeslot: TimeSlot) => void;
	onTimeslotDeselect: (timeslot: TimeSlot) => void;
	selectedTimeslots: TimeSlot[];
}

function TimeSlotGroup({date, bookings, onTimeslotSelect, onTimeslotDeselect, selectedTimeslots}: TimeSlotGroupProps) {
	const openingHour = 10;
	const closingHour = 20;

	const timeslots = [];

	for (let i = openingHour; i < closingHour; i++) {
		const start = new Date(date);
		start.setHours(i);
		start.setMinutes(0);
		start.setSeconds(0);
		start.setMilliseconds(0);
		const end = new Date(date);
		end.setHours(i + 1);
		timeslots.push({start, end});
	}

	return (
		<div className="w-full border">
			<div className="bg-gray w-full text-gray-light text-center text-3xl py-2">
				<span>{date.toLocaleDateString("en-UK", {weekday: 'narrow', day: '2-digit', month: '2-digit'})}</span>
			</div>
			<div className="p-4 flex flex-col gap-2 overflow-y-auto">
				{timeslots.map((timeslot) => (
					<TimeSlotBox
						key={timeslot.start.getTime()}
						onSelect={() => onTimeslotSelect(timeslot)}
						onDeselect={() => onTimeslotDeselect(timeslot)}
						timeSlot={timeslot}
						available={isTimeSlotAvailable(bookings, timeslot)}
						selected={isTimeSlotInList(selectedTimeslots, timeslot)}
					/>
				))}
			</div>
		</div>
	)
}

interface BookingCalendarProps {
	title: string;
	selectedTimeslots: TimeSlot[];
	onTimeslotSelect: (timeslot: TimeSlot) => void;
	onTimeslotDeselect: (timeslot: TimeSlot) => void;
	datePicker: ReactNode;
	fromDate: Date;
	setFromDate: (date: Date) => void;
	bookings: Booking[];
}

function BookingCalendar(props: BookingCalendarProps) {
	const endDate = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() + 6));
	const sevenDaysFromNow = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() + 7));
	const sevenDaysAgo = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() - 7));
	// create an array of dates from fromDate to endDate
	const dates = [];

	for (let i = new Date(props.fromDate); i <= endDate; i.setDate(i.getDate() + 1)) {
		dates.push(new Date(i));
	}

	return (<div className="flex flex-col h-[calc(100vh-200px)] w-full gap-2">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<h1 className="text-4xl font-semibold">{props.title}</h1>
					<FaArrowLeft
						className="text-2xl cursor-pointer"
						onClick={() => props.setFromDate(sevenDaysAgo)}
					/>
					{props.datePicker}
					<FaArrowRight
						className="text-2xl cursor-pointer"
						onClick={() => props.setFromDate(sevenDaysFromNow)}
					/>
				</div>
				<div className="text-lg">
					{formatDate(props.fromDate)} - {formatDate(endDate)}
				</div>
			</div>
			<div className="border h-full flex justify-evenly">
				{dates.map((date) => (
					<TimeSlotGroup
						key={date.getTime()}
						date={date}
						bookings={props.bookings}
						onTimeslotSelect={props.onTimeslotSelect}
						onTimeslotDeselect={props.onTimeslotDeselect}
						selectedTimeslots={props.selectedTimeslots}
					/>
				))}
			</div>
		</div>
	);
}

export default BookingCalendar;