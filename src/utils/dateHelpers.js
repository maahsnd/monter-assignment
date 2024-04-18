// Function to format dates as "day.month.year"
export function formatDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1; // getMonth() is zero-based
  const year = date.getFullYear();
  return `${day < 10 ? '0' + day : day}.${
    month < 10 ? '0' + month : month
  }.${year}`;
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
