import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const loginAPI = createApi({
  reducerPath: "loginAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080/auth" }),
  tagTypes: ["Login-Signup"],
  /*
  Mutations are used to create, update, or delete data, whereas queries are used to fetch data.
  */
  endpoints: (builder) => ({
    /**
     * To login in app
     */
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "Post",
        body: credentials,
      }),
      providesTags: (result, error, arg) => ["Login"],
    }),
    /**
     * To signup for app
     */
    register: builder.mutation({
      query: (userInfo) => ({
        url: "/register",
        method: "Post",
        body: userInfo,
      }),
      providesTags: (result, error, arg) => ["Signup"],
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = loginAPI;
