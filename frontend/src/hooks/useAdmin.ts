import { deleteData, fetchData, updateData } from "@/lib/crud-utils";
import type {
  IAdminDoctorsResponse,
  IGetAllDoctorsForAdminParams,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// getting all doctors for admin dashboard
export const useGetAllDoctorsForAdmin = (
  params: IGetAllDoctorsForAdminParams,
) => {
  return useQuery<IAdminDoctorsResponse>({
    queryKey: [
      "admin-doctors",
      params.isApproved,
      params.limit,
      params.page,
      params.search,
      params.sortBy,
      params.sortOrder,
      params.specialty,
    ],
    queryFn: () => fetchData<IAdminDoctorsResponse>("/admin/doctors", params),
    placeholderData: (prev) => prev,
  });
};

// updating doctor status
export const useUpdateDoctorApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      updateData<{ message: string }, { isApproved: boolean }>(
        `/admin/approve/doctor/${id}`,
        {
          isApproved,
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast.success("Doctor Updated Successfully", { richColors: true });
    },
  });
};

// deleting a doctor
export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      deleteData<{ message: string }>(`/admin/delete/doctor/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-doctors"] });
      toast.success("Doctor Deleted Successfully", { richColors: true });
    },
  });
};
