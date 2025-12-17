import { apiSlice } from "../../app/api/apiSlice";
import { VEHICLES } from "../../app/utils/endpoints";

export const vehicleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllVehicles: builder.query({
      query: () => ({
        url: VEHICLES.GET_ALL_VEHICLES,
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Vehicle'],
    }),
    getVehicleById: builder.query({
      query: (id: number) => ({
        url: VEHICLES.GET_VEHICLE_BY_ID(id),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),
    createVehicle: builder.mutation({
      query: (data) => ({
        url: VEHICLES.CREATE_VEHICLE,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: ['Vehicle'],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, ...data }) => ({
        url: VEHICLES.UPDATE_VEHICLE(id),
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }],
    }),
    deleteVehicle: builder.mutation({
      query: (id: number) => ({
        url: VEHICLES.DELETE_VEHICLE(id),
        method: "DELETE",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, id) => [{ type: 'Vehicle', id }],
    }),
    updateVehicleStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: VEHICLES.UPDATE_VEHICLE_STATUS(id, status),
        method: "PATCH",
      }),
      transformResponse: (response: any) => response?.data || response,
      invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }],
    }),
    getVehicleByNo: builder.query({
      query: (vehicleNo: string) => ({
        url: VEHICLES.GET_VEHICLE_BY_NO(vehicleNo),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    getUnassignedVehiclesByType: builder.query({
      query: ({ companyId, vehicleType }) => ({
        url: VEHICLES.GET_UNASSIGNED_VEHICLES_BY_TYPE(companyId, vehicleType),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Vehicle'],
    }),
    getAssignedVehiclesByType: builder.query({
      query: ({ companyId, vehicleType }) => ({
        url: VEHICLES.GET_ASSIGNED_VEHICLES_BY_TYPE(companyId, vehicleType),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Vehicle'],
    }),
    getVehiclesByCompany: builder.query({
      query: (companyId: number) => ({
        url: VEHICLES.GET_VEHICLES_BY_COMPANY(companyId),
        method: "GET",
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Vehicle'],
    }),
    getVehiclesByCompanyAndStatus: builder.query({
      query: ({ companyId, status, page = 0, size = 20 }) => ({
        url: VEHICLES.GET_VEHICLES_BY_COMPANY_AND_STATUS(companyId, status),
        method: "GET",
        params: { page, size },
      }),
      transformResponse: (response: any) => response?.data || response,
      providesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useGetAllVehiclesQuery,
  useGetVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleStatusMutation,
  useGetVehicleByNoQuery,
  useGetUnassignedVehiclesByTypeQuery,
  useGetAssignedVehiclesByTypeQuery,
  useGetVehiclesByCompanyQuery,
  useGetVehiclesByCompanyAndStatusQuery,
} = vehicleApiSlice;

