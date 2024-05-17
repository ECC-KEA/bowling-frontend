function formatDateTime(date: Date): string {
	const nowYear = new Date().getFullYear();
	const yearValue = date.getFullYear() === nowYear ? undefined : '2-digit';
	return date.toLocaleString('en-UK', {
		year: yearValue,
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		weekday: 'narrow'
	});
}

function formatDate(date:Date): string {
	return date.toLocaleString('en-UK', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		weekday: 'narrow'
	});
}

function isSameDay(date1: Date, date2: Date): boolean {
	return date1.getDate() === date2.getDate() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getFullYear() === date2.getFullYear();
}

export {formatDateTime, formatDate, isSameDay};