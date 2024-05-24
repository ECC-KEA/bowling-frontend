import type {TimeSlot} from "../types/generic.types.ts";
import {ReactNode, useEffect, useState} from "react";
import {formatDate, getDateArray} from "../utils/dateUtils.ts";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";
import {isTimeSlotInList} from "../helpers/timeslothelpers.ts";
import toast from "react-hot-toast";


interface TimeSlotBoxProps {
	timeSlot: TimeSlot;
	onSelect: () => void;
	onDeselect: () => void;
	available: boolean;
	selected: boolean;
	isDisabled: boolean;
}

function TimeSlotBox({timeSlot, onSelect, onDeselect, available, selected, isDisabled}: TimeSlotBoxProps) {
	const [isSelected, setIsSelected] = useState(selected);
	if(timeSlot.start.getTime() < Date.now()) {
		available = false;
	}

	useEffect(() => {
		setIsSelected(selected);
	}, [selected]);

	return (
		<div
			className={
				isSelected ? "rounded p-2 text-center font-semibold bg-blue-700 hover:bg-blue-800 cursor-pointer select-none transition-colors" :
					available
						? `rounded p-2 text-center font-semibold  ${isDisabled ? `bg-gray-400`: `cursor-pointer bg-green hover:bg-green-800`} select-none transition-colors`
						: `rounded p-2 text-center font-semibold bg-red ${isDisabled ? `bg-gray-400`: `bg-red`} text-gray select-none transition-colors`
			}
			onClick={() => {
				if (isDisabled) {
					onSelect();
				} else {
					available ? onSelect() : undefined;
				}
				isSelected ? onDeselect() : undefined;
				if(!isDisabled) {
					available ? setIsSelected(!isSelected) : undefined;
				}
				
			}}
		>
			{timeSlot.start.getHours()}:00 - {timeSlot.end.getHours()}:00
		</div>
	);
}

interface TimeSlotGroupProps {
	date: Date;
	onTimeslotSelect: (timeslot: TimeSlot) => void;
	onTimeslotDeselect: (timeslot: TimeSlot) => void;
	selectedTimeslots: TimeSlot[];
	isTimeSlotAvailable: (timeSlot: TimeSlot) => boolean;
	isDisabled: boolean
	errorMessage: string;
}

function TimeSlotGroup({date, onTimeslotSelect, onTimeslotDeselect, selectedTimeslots, isTimeSlotAvailable, isDisabled, errorMessage}: TimeSlotGroupProps) {
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
						onSelect={() => {
							if (!isDisabled) {
								onTimeslotSelect(timeslot)
							} else {
								toast.error(errorMessage, {icon: "🔒", style:{backgroundColor: "lightyellow"}});
							}
						}}
						onDeselect={() => {
							if (!isDisabled) {
								onTimeslotDeselect(timeslot)
							} else {
								toast.error(errorMessage, {icon: "🔒", style:{backgroundColor: "lightyellow"}});
							}
						}}
						timeSlot={timeslot}
						available={isTimeSlotAvailable(timeslot)}
						selected={isTimeSlotInList(selectedTimeslots, timeslot)}
						isDisabled={isDisabled}
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
	isTimeSlotAvailable: (timeSlot: TimeSlot) => boolean;
	isDisabled?: boolean;
	errorMessage?: string;
}

function BookingCalendar(props: BookingCalendarProps) {
	const isDisabled = props.isDisabled ?? false;
	const errorMessage = props.errorMessage ?? "Something went wrong";
	const sevenDaysFromNow = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() + 7));
	const sevenDaysAgo = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() - 7));
	const endDate = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() + 6));

	const dates = getDateArray(props.fromDate, endDate);


	return (<div className={`flex flex-col h-[calc(100vh-200px)] w-full gap-2 ${isDisabled ? `opacity-50`: `` }`}>
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<h1 className="text-4xl font-semibold">{props.title}</h1>
					<FaArrowLeft
						className={`text-2xl ${isDisabled ? `` : `cursor-pointer`}`}
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
						onTimeslotSelect={props.onTimeslotSelect}
						onTimeslotDeselect={props.onTimeslotDeselect}
						selectedTimeslots={props.selectedTimeslots}
						isTimeSlotAvailable={props.isTimeSlotAvailable}
						isDisabled={isDisabled}
						errorMessage={errorMessage}
					/>
				))}
			</div>
		</div>
	);
}

export default BookingCalendar;