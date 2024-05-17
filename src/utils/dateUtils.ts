
function formatDate(date: Date): string {
  return date.toLocaleString('en-UK', {
	year: '2-digit',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
  });
}

export { formatDate };