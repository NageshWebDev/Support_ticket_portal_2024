export default function setExclamationMark(priority) {
    switch (priority) {
      case "urgent":
        return "!";
  
      case "immediate":
        return "!!";
  
      default:
        return "";
    }
  }