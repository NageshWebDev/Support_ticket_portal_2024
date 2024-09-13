export default function getStatusClass(status) {
  switch (status) {
    case "Inprocess":
      return "!text-yellow-600 !font-bold";

    case "Resolved":
      return "!text-green-600 !font-bold";

    case "Open":
      return "!text-orange-600 !font-bold";

    default:
      return "!text-gray-500 animate-pulse";
  }
}
