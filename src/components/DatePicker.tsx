import {Dispatch, SetStateAction} from "react";
import {FaArrowLeft, FaArrowRight} from "react-icons/fa";

interface DatePickerProps {
	setFromDate: Dispatch<SetStateAction<Date>>;
	fromDate: Date;
}

function DatePicker({setFromDate, fromDate}: DatePickerProps) {
	const sevenDaysFromNow = new Date(new Date(fromDate).setDate(fromDate.getDate() + 7));
	const sevenDaysAgo = new Date(new Date(fromDate).setDate(fromDate.getDate() - 7));

	return (
		<div className="flex justify-center items-center border rounded h-10">
			<FaArrowLeft
				className="text-4xl cursor-pointer px-2 transition-colors hover:bg-gray-light h-full"
				onClick={() => setFromDate(sevenDaysAgo)}
				title={"Previous 7 days"}
			/>
			<input
				type="date"
				onChange={(e) => setFromDate(e.target.valueAsDate ?? new Date())}
				className="h-full px-4 cursor-pointer hover:bg-gray-light transition-colors"
				title={"Select start date"}
			/>
			<FaArrowRight
				className="text-4xl cursor-pointer px-2 transition-colors hover:bg-gray-light h-full"
				onClick={() => setFromDate(sevenDaysFromNow)}
				title={"Next 7 days"}
			/>
		</div>
	);
}

export default DatePicker;