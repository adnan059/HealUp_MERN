import { fetchData, postData } from "@/lib/crud-utils";
import type {
  IAppointmentDetails,
  ICreateAppointmentData,
  SlotType,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNextWorkingDays = (doctorId: string) => {
  return useQuery<string[]>({
    queryKey: ["workingDays", doctorId],
    queryFn: () =>
      fetchData<string[]>(`/appointments/working-days/${doctorId}`),
  });
};

export const useGetAvailableSlots = (doctorId: string, date: string) => {
  return useQuery<SlotType[]>({
    queryKey: ["slots", doctorId, date],
    enabled: !!date,
    queryFn: () =>
      fetchData<SlotType[]>(`/appointments/available-slots`, {
        doctorId,
        date,
      }),
  });
};

export const useCreateNewAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateAppointmentData) =>
      postData<IAppointmentDetails, ICreateAppointmentData>(
        `/appointments/book`,
        data,
      ),
    onSuccess: (data: IAppointmentDetails) => {
      queryClient.invalidateQueries({
        queryKey: ["slots", data.doctorId, data.date],
      });
    },
  });
};
