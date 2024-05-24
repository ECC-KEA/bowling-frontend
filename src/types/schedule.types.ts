
interface Shift{
	id: number;
	start: Date;
	end: Date;
	employeeId: number;
}

interface ShiftDTO{
	id: number;
	start: string;
	end: string;
	employeeId: number;
}

export type {Shift, ShiftDTO};