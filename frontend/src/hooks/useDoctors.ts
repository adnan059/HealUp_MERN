import { fetchData, postData } from "@/lib/crud-utils";
import type { ICreateDoctorData, IFetchAllDoctors } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateDoctorMutation = () => {
  return useMutation({
    mutationFn: async (data: ICreateDoctorData) =>
      postData("/doctors/create", data),
  });
};

export const useGetFeaturedDoctors = () => {
  return useQuery({
    queryKey: ["featuredDoctors"],
    queryFn: async () => fetchData("/doctors/find/random"),
  });
};

export const useGetAllDoctors = ({
  specialization,
  sort,
  page,
}: IFetchAllDoctors) => {
  return useQuery({
    queryKey: ["doctors", specialization, sort, page],
    queryFn: async () =>
      fetchData(
        `/doctors/find/all?specialization=${specialization}&sort=${sort}&page=${page}`,
      ),
  });
};

export const useGetADoctorById = (id: string) => {
  return useQuery({
    queryKey: ["doctor", id],
    queryFn: async () => fetchData(`/doctors/find/${id}`),
  });
};
