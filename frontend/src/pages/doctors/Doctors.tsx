import DoctorsList from "@/components/sections/doctorsSections/DoctorsList";
import DoctorSpecializations from "@/components/sections/doctorsSections/DoctorSpecializations";
import SelectDoctorSpecialization from "@/components/sections/doctorsSections/SelectDoctorSpecialization";
import SortingDoctors from "@/components/sections/doctorsSections/SortingDoctors";
import Pagination from "@/components/shared/Pagination";

import { useGetAllDoctors } from "@/hooks/useDoctors";

import type { DoctorSpecialty, SortOption } from "@/types";

import { useSearchParams } from "react-router-dom";

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams({
    sort: "",
    specialty: "all",
    page: "1",
  });

  const selectedSpecialty =
    (searchParams.get("specialty") as "all" | DoctorSpecialty) || "all";

  const sort = (searchParams.get("sort") as "" | SortOption) || "";

  const page = searchParams.get("page") || "1";

  const { data, isPending } = useGetAllDoctors({
    specialty: selectedSpecialty,
    sort,
    page,
  });

  return (
    <section className="doctors">
      <div className="sectionContainer">
        <div className="allDoctors">
          <div className="topPart">
            <DoctorSpecializations
              selectedSpecialty={selectedSpecialty}
              setSearchParams={setSearchParams}
            />

            <SelectDoctorSpecialization
              selectedSpecialty={selectedSpecialty}
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
