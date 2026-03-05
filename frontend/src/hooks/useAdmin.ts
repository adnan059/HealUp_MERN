import { deleteData, fetchData, updateData } from "@/lib/crud-utils";
import type {
  IAdminDoctorsResponse,
  IGetAllDoctorsForAdminParams,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// getting all doctors for admin dashboard
export const useGetAllDoctorsForAdmin = (
  params: IGetAllDoctorsForAdminParams,
) => {
  return useQuery<IAdminDoctorsResponse>({
    queryKey: ["admin-doctors", params],
    queryFn: async () => fetchData("/admin/doctors", params),
    placeholderData: (prev) => prev,
  });
};

// updating doctor status
export const useUpdateDoctorApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      isApproved,
    }: {
      id: string;
      isApproved: boolean;
    }) => updateData(`/admin/approve/doctor/${id}`, { isApproved }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });
};

// deleting a doctor
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => deleteData(`/admin/delete/doctor/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] }),
  });
};
