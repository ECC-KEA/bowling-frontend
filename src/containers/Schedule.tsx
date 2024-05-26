import useSchedule from "../hooks/useSchedule.ts";
import type {Employee} from "../types/employee.types.ts";
import type {Shift} from "../types/schedule.types.ts";
import PageLayout from "../components/PageLayout.tsx";
import ShowIf from "../components/ShowIf.tsx";
import {
    formatDate,
    formatDateDayAndMonth,
    formatDateWithoutYear,
    formatHour,
    getDateArray
} from "../utils/dateUtils.ts";
import {Dispatch, SetStateAction, useEffect, useState} from "react";
import {FaPlus} from "react-icons/fa";
import DatePicker from "../components/DatePicker.tsx";
import Modal from "../components/Modal.tsx";
import toast from "react-hot-toast";
import {combineDateWithTimeString, getEmpTypeString} from "../helpers/schedulehelpers.ts";

interface CreateModalProps {
    employee: Employee | null;
    date: Date | null;
    setShowCreateModal: Dispatch<SetStateAction<boolean>>
    createShift: (shift: Partial<Shift>) => Promise<void>;
}

function CreateShiftModal({employee, date, setShowCreateModal, createShift}: CreateModalProps) {
    const [start, setStart] = useState<string>("08:00");
    const [end, setEnd] = useState<string>("16:00");

    if (!employee || !date) return null;

    const onSubmit = () => {
        const startDateTime = combineDateWithTimeString(date, start);
        const endDateTime = combineDateWithTimeString(date, end);

        const newShift : Partial<Shift> = {
            employeeId: employee.id,
            start: startDateTime,
            end: endDateTime
        }

        createShift(newShift).then(() => toast.success("Shift added successfully"));
        setShowCreateModal(false);
    }

    return (
        <Modal>
            <div>
                <h2 className="text-2xl font-bold">Add Shift</h2>
                <div>
                    <div className="flex gap-2 mt-4">
                        <div className="text-lg font-semibold w-full">Employee</div>
                        <div className="text-lg w-full text-right">{employee.firstName} {employee.lastName}</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="text-lg font-semibold w-full">Date</div>
                        <div className="text-lg w-full text-right">{formatDate(date)}</div>
                    </div>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="flex gap-2 items-center w-full">
                            <span className="text-lg font-semibold w-full">Start</span>
                            <input
                                type="time"
                                className="border border-black rounded-md p-2 w-full"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                required
                            />
                        </label>
                        <label className="flex gap-2 items-center w-full">
                            <span className="text-lg font-semibold w-full">End</span>
                            <input
                                type="time"
                                className="border border-black rounded-md p-2 w-full"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="bg-blue-500 text-gray-light font-semibold p-2 rounded-md transition-colors hover:bg-blue-600"
                        >
                            Add Shift
                        </button>
                        <button
                            type="button"
                            className="w-full border border-gray rounded-md p-1 font-semibold transition-colors hover:bg-gray-medium"
                            onClick={() => setShowCreateModal(false)}
                        >
                            Close
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}

interface EditModalProps {
    employee: Employee | null;
    date: Date | null;
    shift: Shift | null;
    setShowEditModal: Dispatch<SetStateAction<boolean>>
    updateShift: (shift: Shift) => Promise<void>;
    deleteShift: (shiftID: number) => Promise<void>;
}

function EditShiftModal({employee, date, shift, setShowEditModal, deleteShift, updateShift}:EditModalProps) {
    const [start, setStart] = useState<string>(formatHour(shift?.start ?? new Date()));
    const [end, setEnd] = useState<string>(formatHour(shift?.end ?? new Date()));

    if (!employee || !date || !shift) return null;

    const onSubmit = () => {
        const startDateTime = combineDateWithTimeString(date, start);
        const endDateTime = combineDateWithTimeString(date, end);

        shift.start = startDateTime;
        shift.end = endDateTime;

        updateShift(shift).then(() => toast.success("Shift updated successfully"));
        setShowEditModal(false);
    }

    return (
        <Modal>
            <div>
                <h2 className="text-2xl font-bold">Edit Shift</h2>
                <div>
                    <div className="flex gap-2 mt-4">
                        <div className="text-lg font-semibold w-full">Employee</div>
                        <div className="text-lg w-full text-right">{employee.firstName} {employee.lastName}</div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <div className="text-lg font-semibold w-full">Date</div>
                        <div className="text-lg w-full text-right">{formatDate(date)}</div>
                    </div>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>
                    <div className="flex flex-col gap-2 mt-4">
                        <label className="flex gap-2 items-center w-full">
                            <span className="text-lg font-semibold w-full">Start</span>
                            <input
                                type="time"
                                className="border border-black rounded-md p-2 w-full"
                                value={start}
                                onChange={(e) => setStart(e.target.value)}
                                required
                            />
                        </label>
                        <label className="flex gap-2 items-center w-full">
                            <span className="text-lg font-semibold w-full">End</span>
                            <input
                                type="time"
                                className="border border-black rounded-md p-2 w-full"
                                value={end}
                                onChange={(e) => setEnd(e.target.value)}
                                required
                            />
                        </label>
                        <button
                            type="submit"
                            className="bg-blue-500 text-gray-light font-semibold p-2 rounded-md transition-colors hover:bg-blue-600"
                        >
                            Update Shift
                        </button>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                className="w-full bg-red transition-colors hover:bg-red-dark text-gray-light font-semibold p-2 rounded-md"
                                onClick={() => {deleteShift(shift.id).then(() => toast.success("Shift deleted successfully")); setShowEditModal(false);}}
                            >
                                Delete Shift
                            </button>
                            <button
                                type="button"
                                className="w-full border border-gray rounded-md p-1 font-semibold transition-colors hover:bg-gray-medium"
                                onClick={() => setShowEditModal(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}


interface ShiftCellProps {
    shift: Shift | undefined;
    onClick: () => void;
}

function ShiftCell({shift, onClick}: ShiftCellProps) {
    return (
        <div className="w-full border border-black flex justify-center items-center p-1">
            {!!shift &&
                <div
                    className="flex p-2 w-full h-full justify-center items-center bg-rose rounded font-semibold text-lg transition-colors hover:bg-rose-dark cursor-pointer m-1 relative"
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
                    className="flex h-full w-full justify-center items-center text-gray transition-colors hover:text-blue-600 cursor-pointer"
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
    dates: Date[];
    setSelectedDate: Dispatch<SetStateAction<Date | null>>
    setSelectedEmployee: Dispatch<SetStateAction<Employee | null>>
    setSelectedShift: Dispatch<SetStateAction<Shift|null>>
}

function EmployeeRow(props: EmployeeRowProps) {
    return (
        <div className="flex w-full">
            <h2 className="bg-gray-medium text-center w-48 p-5 font-semibold border border-black flex flex-col relative">
                {props.employee.firstName} {props.employee.lastName}
                <span className="font-thin text-sm absolute top-0 left-1">{getEmpTypeString(props.employee.empType)}</span>
            </h2>
            <div className="flex w-full justify-evenly">
                {props.dates.map(date => {
                        const shift = props.shifts.find(shift => shift.start.getDate() === date.getDate());
                        return <ShiftCell
                            key={date.getTime()}
                            shift={shift}
                            onClick={() => {
                                props.setSelectedEmployee(props.employee);
                                props.setSelectedDate(date);
                                if (shift) {
                                    props.setShowEditModal(true);
                                    props.setSelectedShift(shift);
                                } else {
                                    props.setShowCreateModal(true);
                                }
                            }}
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
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedShift, setSelectedShift] = useState<Shift|null>(null);

    const endDate = new Date(new Date(fromDate).setDate(fromDate.getDate() + 6));
    const dates = getDateArray(fromDate, endDate);

    useEffect(() => {
        if(!showEditModal && !showCreateModal){
            setSelectedEmployee(null);
            setSelectedShift(null);
            setSelectedDate(null);
        }
    }, [showEditModal, showCreateModal])

    return (
        <PageLayout>
            <div className="flex items-end mb-2 justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-semibold">Schedule</h1>
                    <DatePicker setFromDate={setFromDate} fromDate={fromDate}/>
                </div>
                <div className="text-lg">
                    {formatDate(fromDate)} - {formatDate(endDate)}
                </div>
            </div>
            <div className="flex w-full">
                <h2 className="bg-gray-medium text-center w-48 p-4 border border-black text-2xl font-bold">
                    Employee
                </h2>
                <div className="flex w-full justify-evenly">
                    {dates.map(date => (
                        <h2
                            key={date.getTime()}
                            className="bg-gray-medium text-center w-full p-4 font-bold border border-black text-2xl"
                        >
                            {formatDateWithoutYear(date)}
                        </h2>
                    ))}
                </div>
            </div>
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
                            dates={dates}
                            setSelectedDate={setSelectedDate}
                            setSelectedEmployee={setSelectedEmployee}
                            setSelectedShift={setSelectedShift}
                        />
                    ))}
                </ShowIf>
            </div>
            <ShowIf condition={showCreateModal}>
                <CreateShiftModal
                    employee={selectedEmployee}
                    date={selectedDate}
                    setShowCreateModal={setShowCreateModal}
                    createShift={createShift}
                />
            </ShowIf>
            <ShowIf condition={showEditModal}>
                <EditShiftModal
                    employee={selectedEmployee}
                    date={selectedDate}
                    shift={selectedShift}
                    setShowEditModal={setShowEditModal}
                    updateShift={updateShift}
                    deleteShift={deleteShift}
                />
            </ShowIf>
        </PageLayout>
    );
}

export default Schedule;