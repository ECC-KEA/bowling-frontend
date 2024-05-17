
function BookingDatePicker({onDateChange}: { onDateChange: (date: Date | null) => void }) {
	return (
		<div className="flex items-center gap-2">
			<input
				type="date"
				onChange={(e) => onDateChange(e.target.valueAsDate)}
				className="border rounded py-1 px-4"
			/>
		</div>
	);
}

export default BookingDatePicker;