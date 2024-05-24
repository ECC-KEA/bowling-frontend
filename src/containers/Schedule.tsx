import useSchedule from "../hooks/useSchedule.ts";
import type {Employee} from "../types/employee.types.ts";
import type {Shift} from "../types/schedule.types.ts";
import PageLayout from "../components/PageLayout.tsx";
import ShowIf from "../components/ShowIf.tsx";
import {formatDateDayAndMonth, formatHour, getDateArray} from "../utils/dateUtils.ts";
import {Dispatch, SetStateAction, useState} from "react";
import {FaPlus} from "react-icons/fa";

interface ShiftCellProps {
	shift: Shift | undefined;
	onClick: () => void;
}

function ShiftCell({shift, onClick}: ShiftCellProps) {
	return (
		<div className="w-full border border-black">
			{!!shift &&
				<div
					className="flex p-2 justify-center items-center bg-rose rounded-lg font-semibold text-lg hover:bg-rose-dark cursor-pointer m-1 relative"
					onClick={onClick}
					title={"Edit shift"}
				>
					<div className="absolute top-2 left-2 text-xs text-gray">
						{formatDateDayAndMonth(shift.start)}
					</div>
					{formatHour(shift.start)} - {formatHour(shift.end)}
				</div>
			}
			{
				!shift &&
				<div
					className="flex h-full w-full justify-center items-center text-gray hover:text-gray-medium cursor-pointer"
					onClick={onClick}
					title={"Add shift"}
				>
					<FaPlus/>
				</div>
			}
		</div>
	);
}

interface EmployeeRowProps {
	employee: Employee;
	shifts: Shift[];
	fromDate: Date;
	createShift: (shift: Partial<Shift>) => void;
	updateShift: (shift: Shift) => void;
	deleteShift: (shiftID: number) => void;
	setShowCreateModal: Dispatch<SetStateAction<boolean>>;
	setShowEditModal: Dispatch<SetStateAction<boolean>>;
}

function EmployeeRow(props: EmployeeRowProps) {
	const endDate = new Date(new Date(props.fromDate).setDate(props.fromDate.getDate() + 6));

	const dates = getDateArray(props.fromDate, endDate);

	return (
		<div className="flex w-full">
			<h2 className="bg-gray-medium text-center w-48 p-4 font-semibold">
				{props.employee.firstName} {props.employee.lastName}
			</h2>
			<div className="flex w-full justify-evenly">
				{dates.map(date => {
						const shift = props.shifts.find(shift => shift.start.getDate() === date.getDate());
						return <ShiftCell
							key={date.getTime()}
							shift={shift}
							onClick={() => shift ? props.setShowEditModal(true) : props.setShowCreateModal(true)}
						/>
					}
				)}
			</div>
		</div>
	);
}

function Schedule() {
	const {
		employees,
		loading,
		fromDate,
		employeeShiftMap,
		setFromDate,
		createShift,
		updateShift,
		deleteShift
	} = useSchedule();
	const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const sevenDaysFromNow = new Date(new Date(fromDate).setDate(fromDate.getDate() + 7));
	const sevenDaysAgo = new Date(new Date(fromDate).setDate(fromDate.getDate() - 7));

	return (
		<PageLayout>
			<h1>Schedule</h1>
			<div>
				<ShowIf condition={!loading}>
					{employees.map(employee => (
						<EmployeeRow
							key={employee.id}
							employee={employee}
							shifts={employeeShiftMap.get(employee.id) ?? []}
							createShift={createShift}
							updateShift={updateShift}
							deleteShift={deleteShift}
							fromDate={fromDate}
							setShowCreateModal={setShowCreateModal}
							setShowEditModal={setShowEditModal}
						/>
					))}
				</ShowIf>
			</div>
		</PageLayout>
	);
}

export default Schedule;