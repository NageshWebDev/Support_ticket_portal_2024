export default function getPriorityClass(priority) {
    switch (priority) {
      case "low":
        return "!text-red-400";
  
      case "high":
        return "!text-red-500";
  
      case "urgent":
        return "!text-red-700";
  
      case "immediate":
        return "!text-red-900";
  
      default:
        break;
    }
  }