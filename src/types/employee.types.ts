
interface Employee {
	id: number;
	firstName: string;
	lastName: string;
	empType: string;
}

enum EmpType {
	REGULAR = "REGULAR",
	MANAGER = "MANAGER",
	OPERATOR = "OPERATOR",
	CLEANING = "CLEANING"
}

export type {Employee};
export {EmpType};