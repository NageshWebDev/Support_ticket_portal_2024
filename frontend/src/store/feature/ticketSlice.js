import { createSlice } from "@reduxjs/toolkit";
// the data we will receive from server
const initialState = {
  ticketDataOriginal: [],
  ticketData: [],
  filterId: "ALL",
  searchBy: "",
};

// Utility function to apply search filter
const applySearchFilter = (ticketData, filterId, searchBy) => {
  let tempData = [];

  if (filterId === "ALL") tempData = ticketData;
  else if (["ASSIGNED"].includes(filterId))
    tempData = ticketData.filter((data) => data?.assigneeDetails);
  else if (["UNASSIGNED"].includes(filterId))
    tempData = ticketData.filter((data) => !data?.assigneeDetails);
  else tempData = ticketData.filter((data) => data.filterId === filterId);

  if (searchBy) {
    tempData = tempData.filter((item) => {
      const values = Object.values(item).map((ele) => {
        if (ele) return ele.toString().toLowerCase();
        else return "";
      });
      return values.join(" ").includes(searchBy.toLowerCase());
    });
  }

  return tempData;
};

/*
3rd step is to create a slice

Redux Toolkit includes a createSlice function that will
auto-generatethe action types and action creators for you,
based on the names of the reducer functions you provide.

Reducer:
  1) Define how that state is updated
  2) Define which specific actions result in state updates
*/
export const ticketSlice = createSlice({
  name: "ticketSlice",
  initialState,
  reducers: {
    /*
  When you create a slice using createSlice, 
  Redux Toolkit automatically generates action creators
  for each of the reducer functions you define
  */
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes

    setTicketData(state, action) {
      const modifiedPayload = action.payload
        .map((ticketDetail) => ({
          ...ticketDetail,
          ticketId: ticketDetail._id,
        }))
        .sort((ticketA, ticketB) => {
          const ticketAcreatedAt = new Date(ticketA.createdAt);
          const ticketBcreatedAt = new Date(ticketB.createdAt);
          return ticketBcreatedAt - ticketAcreatedAt;
        });

      state.ticketDataOriginal = modifiedPayload;
      state.ticketData = modifiedPayload;
    },

    filterTicketData(state, action) {
      const { filterId } = action.payload;
      state.filterId = filterId;
      state.ticketData = applySearchFilter(
        state.ticketDataOriginal,
        state.filterId,
        state.searchBy
      );
    },
    searchTicketData(state, action) {
      const { payload } = action;
      state.searchBy = payload || "";
      state.ticketData = applySearchFilter(
        state.ticketDataOriginal,
        state.filterId,
        state.searchBy
      );
    },
    setTicketStoreEmpty(state) {
      state.ticketDataOriginal = [];
      state.ticketData = [];
      state.filterId = "ALL";
      state.searchBy = "";
    },
  },
});

/*
4th step to export the actions creator
*/
export const { filterTicketData, searchTicketData, setTicketData, setTicketStoreEmpty } =
  ticketSlice.actions;

export default ticketSlice.reducer;
