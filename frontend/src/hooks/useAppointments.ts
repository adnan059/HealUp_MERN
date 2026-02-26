import { fetchData, postData } from "@/lib/crud-utils";
import type { IAppointmentDetails, ICreateAppointmentData } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNextWorkingDays = (doctorId: string) => {
  return useQuery({
    queryKey: ["workingDays", doctorId],
    queryFn: async () => fetchData(`/appointments/working-days/${doctorId}`),
  });
};

export const useGetAvailableSlots = (doctorId: string, date: string) => {
  return useQuery({
    queryKey: ["slots", doctorId, date],
    enabled: !!date,
    queryFn: async () =>
      fetchData(`/appointments/available-slots`, { doctorId, date }),
  });
};

export const useCreateNewAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ICreateAppointmentData) =>
      postData<IAppointmentDetails>(`/appointments/book`, data),
    onSuccess: (data: IAppointmentDetails) => {
      queryClient.invalidateQueries({
        queryKey: ["slots", data.doctorId, data.date],
      });
    },
  });
};
