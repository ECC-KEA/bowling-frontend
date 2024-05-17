import {Dispatch, FormEventHandler, ReactNode, SetStateAction} from "react";
import {TimeSlot} from "../types/datatypes.ts";
import {formatDate} from "../utils/dateUtils.ts";

function TimeSlotString({start, end} : TimeSlot) {
	return (
		`${formatDate(start)} -> ${formatDate(end)}`
	);
}

interface BookingFormProps {
	children: ReactNode;
	selectedTimeslots: TimeSlot[];
	setSelectedTimeslots: Dispatch<SetStateAction<TimeSlot[]>>
	onSubmit: FormEventHandler<HTMLFormElement>;
}

function BookingForm({children, selectedTimeslots, setSelectedTimeslots, onSubmit} : BookingFormProps) {
	return (
		<div className="bg-gray text-gray-light p-3 max-w-md flex flex-col gap-4 min-h-[70vh]">
			<h1 className="w-full text-center font-semibold text-3xl">Booking</h1>
			<span className="font-semibold text-xl">
				Selected timeslots
			</span>
			<ul className="overflow-y-auto h-20">
				{selectedTimeslots.map((timeslot) => (
					<li key={timeslot.start.getTime()}>
						- <TimeSlotString start={timeslot.start} end={timeslot.end} />
					</li>
				))}
			</ul>
			<form className="flex flex-col gap-4 justify-between" onSubmit={onSubmit}>
				<div className="h-52 p-4 flex flex-col gap-4">
					{children}
				</div>
				<button className="bg-gray border text-gray-light font-semibold p-2 hover:bg-gray-light hover:text-gray">
					Submit
				</button>
				<button
					className="bg-gray-light text-gray font-semibold p-2 hover:bg-gray-medium"
					onClick={() => setSelectedTimeslots([])}
					type={"reset"}
				>
					Clear
				</button>
			</form>
		</div>
	);
}

export default BookingForm;