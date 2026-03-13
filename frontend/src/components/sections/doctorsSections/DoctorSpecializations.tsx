import { specialties } from "@/lib";
import { cn } from "@/lib/utils";
import type { DoctorSpecialty } from "@/types";

import type { SetURLSearchParams } from "react-router-dom";

type DoctorSpecialties = "all" | DoctorSpecialty;

interface IDoctorSpecializationProps {
  selectedSpecialty: DoctorSpecialties;
  setSearchParams: SetURLSearchParams;
}

const DoctorSpecializations = ({
  selectedSpecialty,
  setSearchParams,
}: IDoctorSpecializationProps) => {
  const handleSelectSpecialty = (value: DoctorSpecialties) => {
    setSearchParams((prev) => {
      const currentSpecialty = prev.get("specialty");

      if (currentSpecialty === value) {
        return prev;
      }

      const params = new URLSearchParams(prev);

      params.set("specialty", value);
      params.set("page", "1");

      return params;
    });

    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <div className="doctorSpecialiazations">
      <ul className="doctorSpecialiazationsList">
        {specialties.map((specialty) => (
          <li
            onClick={() => handleSelectSpecialty(specialty)}
            className={cn(
              "doctorSpecialiazationItem",
              specialty === selectedSpecialty &&
                "bg-indigo-400 px-2 text-white",
            )}
            key={specialty}
          >
            {specialty}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorSpecializations;
