import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userTicketAPI = createApi({
  reducerPath: "userTicketAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/user",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().userInfoReducer.tokenId;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Tickets"],
  /*
  Mutations are used to create, update, or delete data, whereas queries are used to fetch data.
  */
  endpoints: (builder) => ({
    /**
     * To get all tickets
     */
    getAllUserTickets: builder.query({
      // function defines the end-point for the query
      query: ({ userId }) => `/${userId}/get-tickets`,

      // Tags are used in RTK Query to handle cache invalidation and automatic refetching.
      providesTags: (result, error, arg) => {
        /*
      Parameters:
        result: The data returned from the query. It defaults to an empty array [] if the result is undefined or null.
        error: Any error that occurred during the query.
        arg: The argument passed to the query, which in this case would be userId.
      */
        const tags = ["Tickets"];
        return tags;
      },
      keepUnusedDataFor: 3600,
    }),
    getAssignedTickets: builder.query({
      query: ({ userId }) => `/${userId}/get-tickets`,
      providesTags: () => ["AssignedTickets"],
    }),
    getUserProfile: builder.query({
      query: ({ userId }) => `/${userId}`,
      keepUnusedDataFor: 3600,
    }),
    getAllTicketOverview: builder.query({
      query: ({ userId }) => `/${userId}/all-ticket-overview`,
      keepUnusedDataFor: 1,
      invalidatesTags: ["Tickets"],
    }),
    /**
     * To get details of specific ticket
     */
    getSpecificUserTicket: builder.query({
      query: ({ userId, ticketId }) => `/${userId}/get-ticket/${ticketId}`,
      providesTags: (result, error, arg) => {
        const tags = [{ type: "SpecificUserTicket", ticketId: arg.ticketId }];
        return tags;
      },
    }),
    /**
     * To get user names and ids
     */
    getUsersEmailAndIdList: builder.query({
      query: ({ userId }) => `/${userId}/get-users`,
    }),
    /**
     * To get admin email, names and ids
     */
    getAdminEmailAndIdList: builder.query({
      query: ({ userId }) => `/${userId}/get-admin`,
      keepUnusedDataFor: 1,
      providesTags: ["AdminDetails"],
      invalidatesTags: ["Tickets"],
    }),
    /**
     * To get admin email, names and ids
     */
    getSuperAdminDetails: builder.query({
      query: ({ userId }) => `/${userId}/get-super-admin`,
      keepUnusedDataFor: 3600,
    }),
    /**
     * To create new ticket
     */
    createUserTicket: builder.mutation({
      query: ({ userId, newTicket }) => ({
        url: `/${userId}/create-ticket`,
        method: "POST",
        body: newTicket,
      }),
      // now the cached data for the tag 'Tickets' is deleted,
      // now when 'getAllUserTickets' is called, it is forced to fetch latest data
      invalidatesTags: ["Tickets"],
    }),
    /**
     * To update details of open ticket
     */
    updateUserTicket: builder.mutation({
      query: ({ userId, ticketId, updatedTicket }) => ({
        url: `/${userId}/update-ticket/${ticketId}`,
        method: "PUT",
        body: updatedTicket,
      }),
      // The reason i am not invalidating "[Tickets]",
      // because I am manually refetching the tickets after ticket updation
      invalidatesTags: (result, error, arg) => [
        { type: "SpecificUserTicket", ticketId: arg.ticketId },
        { type: "AssignedTickets" },
        { type: "AdminDetails" },        
      ],
    }),
    /**
     * To update details of open ticket
     */
    updateUserTicketStatus: builder.mutation({
      query: ({ userId, ticketId, updatedStatus }) => ({
        url: `/${userId}/update-ticket-status/${ticketId}`,
        method: "PATCH",
        body: updatedStatus,
      }),
      // The reason i am not invalidating "[Tickets]",
      // because I am manually refetching the tickets after ticket updation
      invalidatesTags: (result, error, arg) => [
        { type: "SpecificUserTicket", ticketId: arg.ticketId },
        { type: "AssignedTickets" },
        { type: "AdminDetails" },        
      ],
    }),
    /**
     * To update details of open ticket
     */
    updateUserTicketAssignee: builder.mutation({
      query: ({ userId, ticketId, assigneeId }) => ({
        url: `/${userId}/update-ticket-assignee/${ticketId}`,
        method: "PATCH",
        body: assigneeId,
      }),
      // The reason i am not invalidating "[Tickets]",
      // because I am manually refetching the tickets after ticket updation
      invalidatesTags: (result, error, arg) => [
        { type: "SpecificUserTicket", ticketId: arg.ticketId },
        { type: "AssignedTickets" },
        { type: "AdminDetails" },        
      ],
    }),
    /**
     * To delete ticket
     */
    deleteUserTicket: builder.mutation({
      query: ({ userId, ticketId }) => ({
        url: `${userId}/delete-ticket/${ticketId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tickets", "AdminDetails", "AssignedTickets"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetAssignedTicketsQuery,
  useGetAllUserTicketsQuery,
  useGetAllTicketOverviewQuery,
  useGetAdminEmailAndIdListQuery,
  useGetUsersEmailAndIdListQuery,
  useGetSuperAdminDetailsQuery,
  useCreateUserTicketMutation,
  useGetSpecificUserTicketQuery,
  useUpdateUserTicketMutation,
  useUpdateUserTicketStatusMutation,
  useUpdateUserTicketAssigneeMutation,
  useDeleteUserTicketMutation,
} = userTicketAPI;
