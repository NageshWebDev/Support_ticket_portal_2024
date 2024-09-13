import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfoFromLocalStorage } from "../util/localStorage";
import {
  setTokenId,
  setUserEmail,
  setUserName,
  setUserId,
  setUserRole,
} from "../store/feature/userInfoSlice";

export default function useAuth() {
  const dispatch = useDispatch();
  const tokenId = useSelector((state) => state.userInfoReducer.tokenId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info if tokenId is not already in the Redux store
    if (!tokenId) {
      const userData = getUserInfoFromLocalStorage();
      if (userData) {
        const { tokenId, userEmail, userName, userId, userRole } = userData;
        dispatch(setUserEmail({ userEmail }));
        dispatch(setUserName({ userName }));
        dispatch(setTokenId({ tokenId }));
        dispatch(setUserId({ userId }));
        dispatch(setUserRole({ userRole }));
      }
    }
    setLoading(false); // Stop loading after data is fetched or if tokenId is already present
  }, [tokenId, dispatch]);

  return { tokenId, loading };
}
