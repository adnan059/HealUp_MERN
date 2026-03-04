import { useGetAllDoctorsForAdmin } from "@/hooks/useAdmin";
import type { IDoctorDetailsWithSchedule } from "@/types";

const AdminDashboardTable = () => {
  const { data } = useGetAllDoctorsForAdmin() as {
    data: {
      data: IDoctorDetailsWithSchedule[];
      meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    };
  };
  console.log(data);

  return <div>adminDashboardTable</div>;
};

export default AdminDashboardTable;
