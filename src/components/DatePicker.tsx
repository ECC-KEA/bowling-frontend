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
		<>
			<FaArrowLeft
				className="text-2xl cursor-pointer"
				onClick={() => setFromDate(sevenDaysAgo)}
			/>
			<div className="flex items-center gap-2">
				<input
					type="date"
					onChange={(e) => setFromDate(e.target.valueAsDate ?? new Date())}
					className="border border-black rounded py-1 px-4"
				/>
			</div>
			<FaArrowRight
				className="text-2xl cursor-pointer"
				onClick={() => setFromDate(sevenDaysFromNow)}
			/>
		</>
	);
}

export default DatePicker;