import { configureStore } from "@reduxjs/toolkit";
import ticketReducer from "../store/feature/ticketSlice";
import { userTicketAPI } from "./api/userTicketAPI";
import { loginAPI } from "./api/loginAPI";
import userInfoReducer from "../store/feature/userInfoSlice";

/*
1st step
This creates a Redux store, and also automatically configure 
the Redux DevTools extension so that you can inspect the store while developing.
*/
export const store = configureStore({
  reducer: {
    /*
    6th step adding the slice reducer to store.
    we tell the store to use this slice reducer function to handle all updates to that state.
    You will use 'ticket' when using useSelector
    */
    ticketReducer: ticketReducer,
    userInfoReducer: userInfoReducer,
    [userTicketAPI.reducerPath]: userTicketAPI.reducer,
    [loginAPI.reducerPath]: loginAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userTicketAPI.middleware,
      loginAPI.middleware
    ),
});
