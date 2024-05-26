import {useEffect, useState} from "react";
import type {Shift, ShiftDTO} from "../types/schedule.types.ts";
import type {Employee} from "../types/employee.types.ts";
import DataService from "../utils/DataService.ts";
import toast from "react-hot-toast";
import {formatDateForJavaLocalDateTime} from "../utils/dateUtils.ts";
import {EmpType} from "../types/employee.types.ts";

function useSchedule() {
	const [shifts, setShifts] = useState<Shift[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [fromDate, setFromDate] = useState<Date>(new Date());
	const [employeeShiftMap, setEmployeeShiftMap] = useState<Map<number, Shift[]>>(new Map());

	const dataService = new DataService<ShiftDTO>("/schedule");
	const employeeService = new DataService<Employee>("/employees");

	const mapDTOToShift = (dto: ShiftDTO): Shift => {
		return {
			id: dto.id,
			start: new Date(dto.start),
			end: new Date(dto.end),
			employeeId: dto.employeeId
		}
	}

	const mapShiftToDTO = (shift: Partial<Shift>): Partial<ShiftDTO> => {
		return {
			start: formatDateForJavaLocalDateTime(shift.start),
			end: formatDateForJavaLocalDateTime(shift.end),
			employeeId: shift.employeeId
		}
	}

	const fetchEmployees = async () => {
		try {
			const employees = await employeeService.getAll();
			employees.sort((a, b) => {
				if (a.empType === EmpType.MANAGER && b.empType !== EmpType.MANAGER) {
					return -1;
				} else if (b.empType === EmpType.MANAGER && a.empType !== EmpType.MANAGER) {
					return 1;
				} else if (a.empType === EmpType.OPERATOR && b.empType !== EmpType.OPERATOR) {
					return -1;
				} else if (b.empType === EmpType.OPERATOR && a.empType !== EmpType.OPERATOR) {
					return 1;
				} else {
					return a.firstName.localeCompare(b.firstName);
				}
			});
			setEmployees(employees);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to fetch employees: " + error.message);
			}
		}
	}

	const fetchShifts = async () => {
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
		try {
			const shifts = await dataService.getAll(queryParams);
			setShifts(shifts.map(mapDTOToShift));
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to fetch shifts: " + error.message);
			}
		}
	}

	useEffect(() => {
		void fetchEmployees();
	}, []);

	useEffect(() => {
		fetchShifts().then(() => setLoading(false));
	}, [employees, fromDate]);

	useEffect(() => {
		if (shifts && employees) {
			const employeeShiftMap = new Map<number, Shift[]>();
			employees.forEach(employee => {
				const shiftsForEmployee = shifts.filter(shift => shift.employeeId === employee.id);
				employeeShiftMap.set(employee.id, shiftsForEmployee);
			});
			setEmployeeShiftMap(employeeShiftMap);
		}
	}, [shifts, employees]);

	const createShift = async (shift: Partial<Shift>) => {
		try {
			const newShift = await dataService.create(mapShiftToDTO(shift));
			setShifts([...shifts, mapDTOToShift(newShift)]);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to create shift: " + error.message);
			}
		}
	}

	const updateShift = async (shift: Shift) => {
		try {
			const updatedShift = await dataService.patch(mapShiftToDTO(shift), shift.id);
			const updatedShifts = shifts.map(s => s.id === updatedShift.id ? mapDTOToShift(updatedShift) : s);
			setShifts(updatedShifts);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to update shift: " + error.message);
			}
		}
	}

	const deleteShift = async (id: number) => {
		try {
			await dataService.delete(id);
			const updatedShifts = shifts.filter(s => s.id !== id);
			setShifts(updatedShifts);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error("Failed to delete shift: " + error.message);
			}
		}

	}

	return {shifts, employees, loading, fromDate, setFromDate, employeeShiftMap, createShift, updateShift, deleteShift};
}

export default useSchedule;
