export function setUserInfoOnLocalStorage(userInfo) {
  const stringifyUserInfo = JSON.stringify(userInfo);
  const existingUserInfo = localStorage.getItem("User_Info_On_Local_Storage");

  if (existingUserInfo) {
    console.log("User data is already available in local storage.");
  } else {
    localStorage.setItem("User_Info_On_Local_Storage", stringifyUserInfo);
    console.log("User data stored in local storage.");
  }
}

export function getUserInfoFromLocalStorage() {
  const storedUserInfo = localStorage.getItem("User_Info_On_Local_Storage");

  if (storedUserInfo) {
    console.log("User data successfully fetched from local storage.");
    try {
      return JSON.parse(storedUserInfo);
    } catch (error) {
      console.error("Error parsing user data from local storage:", error);
      return null;
    }
  } else {
    console.log("No user data available in local storage.");
    return null;
  }
}

export function removeUserInfoFromLocalStorage() {
  if (localStorage.getItem("User_Info_On_Local_Storage")) {
    localStorage.removeItem("User_Info_On_Local_Storage");
    console.log("User data removed from local storage.");
  } else {
    console.log("No user data found in local storage to remove.");
  }
}
