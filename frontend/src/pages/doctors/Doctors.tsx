import DoctorsList from "@/components/sections/doctorsSections/DoctorsList";
import DoctorSpecializations from "@/components/sections/doctorsSections/DoctorSpecializations";
import SelectDoctorSpecialization from "@/components/sections/doctorsSections/SelectDoctorSpecialization";
import SortingDoctors from "@/components/sections/doctorsSections/SortingDoctors";
import Pagination from "@/components/shared/Pagination";

import { useGetAllDoctors } from "@/hooks/useDoctors";

import type { DoctorSpecialty, IDoctor, SortOption } from "@/types";

import { useSearchParams } from "react-router-dom";

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    sort: "",
    specialization: "all",
    page: "1",
  });

  const selectedSpecialization =
    (searchParams.get("specialization") as "all" | DoctorSpecialty) || "all";

  const sort = (searchParams.get("sort") as "" | SortOption) || "";

  const page = searchParams.get("page") || "1";

  const { data, isPending } = useGetAllDoctors({
    specialization: selectedSpecialization,
    sort,
    page,
  }) as {
    isPending: boolean;
    data: {
      data: IDoctor[];
      total: number;
      page: number;
      totalPages: number;
    };
  };

  console.log(data);

  return (
    <section className="doctors">
      <div className="sectionContainer">
        <div className="allDoctors">
          <div className="topPart">
            <DoctorSpecializations
              selectedSpecialization={selectedSpecialization}
              setSearchParams={setSearchParams}
            />

            <SelectDoctorSpecialization
              selectedSpecialization={selectedSpecialization}
              setSearchParams={setSearchParams}
            />

            <SortingDoctors sort={sort} setSearchParams={setSearchParams} />
          </div>

          <div className="allDoctorsList">
            <DoctorsList doctors={data?.data || []} isPending={isPending} />

            <Pagination
              currentPage={data?.page || 1}
              totalPages={data?.totalPages || 1}
              setSearchParams={setSearchParams}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;
