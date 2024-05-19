import {Dispatch, ReactNode, SetStateAction} from "react";
import {TimeSlot} from "../types/generic.types.ts";
import {formatDate} from "../utils/dateUtils.ts";
import ShowIf from "./ShowIf.tsx";

interface SelectedTimeSlotProps {
	timeslot: TimeSlot;
	onClick: () => void;
}

function SelectedTimeSlot({timeslot, onClick} : SelectedTimeSlotProps) {
	return (
		<div
			className="border bg-green text-gray p-1 rounded cursor-pointer"
			onClick={onClick}
		>
			<div className="text-xs">{formatDate(timeslot.start)}</div>
			<div className="text-center font-semibold">
				{timeslot.start.getHours()}:00 - {timeslot.end.getHours()}:00
			</div>
		</div>
	);
}

interface BookingFormProps {
	children: ReactNode;
	selectedTimeslots: TimeSlot[];
	setSelectedTimeslots: Dispatch<SetStateAction<TimeSlot[]>>
	onSubmit: () => void;
}

function BookingForm({children, selectedTimeslots, setSelectedTimeslots, onSubmit} : BookingFormProps) {
	return (
		<div className="bg-gray text-gray-light p-3 max-w-md flex flex-col gap-4 min-h-[70vh]">
			<h1 className="w-full text-center font-semibold text-3xl">Booking</h1>
			<ShowIf condition={selectedTimeslots.length > 0}>
				<span className="font-semibold text-xl">
					Selected timeslots
				</span>
				<div className="overflow-y-auto h-20 p-2 bg-gray-light flex flex-col gap-2">
					{selectedTimeslots.map((timeslot) => (
						<div key={timeslot.start.getTime()}>
							<SelectedTimeSlot
								timeslot={timeslot}
								onClick={() => setSelectedTimeslots(selectedTimeslots.filter((ts) => ts.start.getTime() !== timeslot.start.getTime()))}
							/>
						</div>
					))}
				</div>
			</ShowIf>
			<form className="flex flex-col gap-4 justify-between" onSubmit={(e) => {e.preventDefault(); onSubmit();}}>
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