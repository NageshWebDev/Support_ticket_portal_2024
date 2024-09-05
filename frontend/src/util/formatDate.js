export default function formatDatAndTime(isoDate) {
  const date = new Date(isoDate);
  const options = { day: "numeric", month: "short", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);
  const formattedTime = date.toLocaleTimeString("en-US"); // e.g., 12:22:49 PM
  return `${formattedDate}, ${formattedTime}`;
}
