import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tokenId: null,
  userId: null,
  userName: null,
  userEmail: null,
  userRole: null,
};

export const userInfoSlice = createSlice({
  name: "userInfoSlice",
  initialState,
  reducers: {
    setUserName(state, action) {
      const { userName } = action.payload;
      state.userName = userName;
    },
    setUserEmail(state, action) {
      const { userEmail } = action.payload;
      state.userEmail = userEmail;
    },
    setTokenId(state, action) {
      const { tokenId } = action.payload;
      state.tokenId = tokenId;
    },
    setUserId(state, action) {
      const { userId } = action.payload;
      state.userId = userId;
    },
    setUserRole(state, action) {
      const { userRole } = action.payload;
      state.userRole = userRole;
    },
    setUserStoreEmpty(state) {
      state.tokenId = null;
      state.userId = null;
      state.userName = null;
      state.userEmail = null;
      state.userRole = null;
    },
  },
});

export const { setUserName, setUserEmail, setTokenId, setUserId, setUserRole,setUserStoreEmpty } =
  userInfoSlice.actions;

export default userInfoSlice.reducer;
