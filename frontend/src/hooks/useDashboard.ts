import { fetchData } from "@/lib/crud-utils";
import type { IDoctorAppointment, IPatientAppointment } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAppointmentsAsPatient = () => {
  return useQuery<IPatientAppointment[]>({
    queryKey: ["my-appointments"],
    queryFn: () =>
      fetchData<IPatientAppointment[]>("/appointments/my-appointments"),
  });
};

export const useGetAppointmentsAsDoctor = () => {
  return useQuery<IDoctorAppointment[]>({
    queryKey: ["my-patients"],
    queryFn: () => fetchData<IDoctorAppointment[]>("/appointments/my-patients"),
  });
};
