// Function to format dates as "day.month.year", forcing local time
export function formatDate(dateString) {
  const parts = dateString.split('-'); // Split the date string into components
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // Adjust month to be zero-based
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day); // This uses local time zone
  const formattedDay = date.getDate();
  const formattedMonth = date.getMonth() + 1; // getMonth() is zero-based
  const formattedYear = date.getFullYear();

  return `${formattedDay < 10 ? '0' + formattedDay : formattedDay}.${
    formattedMonth < 10 ? '0' + formattedMonth : formattedMonth
  }.${formattedYear}`;
}

// Function to format time as "6:00 PM" or "6:00 AM"
export function formatTime(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${formattedMinutes} ${ampm}`;
}
