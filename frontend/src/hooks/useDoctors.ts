import { fetchData, postData } from "@/lib/crud-utils";
import type {
  FeaturedDoctorsType,
  IAllDoctors,
  ICreateDoctorData,
  IDoctorDetailsWithSchedule,
  IFetchAllDoctors,
} from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateDoctorMutation = () => {
  return useMutation({
    mutationFn: (data: ICreateDoctorData) =>
      postData<void, ICreateDoctorData>("/doctors/create", data),
  });
};

export const useGetFeaturedDoctors = () => {
  return useQuery<FeaturedDoctorsType>({
    queryKey: ["featuredDoctors"],
    queryFn: () => fetchData<FeaturedDoctorsType>("/doctors/find/random"),
  });
};

export const useGetAllDoctors = ({
  specialty,
  sort,
  page,
}: IFetchAllDoctors) => {
  return useQuery<IAllDoctors>({
    queryKey: ["doctors", specialty, sort, page],
    queryFn: () =>
      fetchData<IAllDoctors>(`/doctors/find/all`, {
        specialty,
        sort,
        page,
      }),
    placeholderData: (prev) => prev,
  });
};

export const useGetADoctorById = (id: string) => {
  return useQuery<IDoctorDetailsWithSchedule>({
    queryKey: ["doctor", id],
    queryFn: () => fetchData<IDoctorDetailsWithSchedule>(`/doctors/find/${id}`),
    enabled: !!id,
  });
};
