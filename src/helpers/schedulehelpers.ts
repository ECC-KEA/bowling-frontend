
function combineDateWithTimeString(date: Date, timeString: string){
    const timeSplit = timeString.split(":").map(t => Number(t));

    const dateTime = new Date(date);

    dateTime.setHours(timeSplit[0]);
    dateTime.setMinutes(timeSplit[1]);

    return dateTime;
}

export {combineDateWithTimeString}