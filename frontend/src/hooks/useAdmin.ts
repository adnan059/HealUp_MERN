import { fetchData } from "@/lib/crud-utils";
import type { IGetAllDoctorsForAdminParams } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetAllDoctorsForAdmin = (
  params?: IGetAllDoctorsForAdminParams,
) => {
  return useQuery({
    queryKey: ["admin-doctors", params],
    queryFn: async () => fetchData("/admin/doctors", params),
    placeholderData: (prev) => prev,
  });
};
