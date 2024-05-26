import {EmpType} from "../types/employee.types.ts";

function combineDateWithTimeString(date: Date, timeString: string){
    const timeSplit = timeString.split(":").map(t => Number(t));

    const dateTime = new Date(date);

    dateTime.setHours(timeSplit[0]);
    dateTime.setMinutes(timeSplit[1]);

    return dateTime;
}

function getEmpTypeString(type: EmpType){
    switch(type){
        case EmpType.OPERATOR:
            return "Operator";
        case EmpType.MANAGER:
            return "Manager";
        case EmpType.CLEANING:
            return "Cleaning";
        case EmpType.REGULAR:
        default:
            return "";
    }
}

export {combineDateWithTimeString, getEmpTypeString}