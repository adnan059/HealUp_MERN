import { specialties } from "@/lib";
import { cn } from "@/lib/utils";
import type { DoctorSpecialty } from "@/types";

import type { SetURLSearchParams } from "react-router-dom";

type DoctorSpecialization = "all" | DoctorSpecialty;

interface IDoctorSpecializationProps {
  selectedSpecialization: DoctorSpecialization;
  setSearchParams: SetURLSearchParams;
}

const DoctorSpecializations = ({
  selectedSpecialization,
  setSearchParams,
}: IDoctorSpecializationProps) => {
  console.log(selectedSpecialization);
  const handleSelectSpecialization = (value: DoctorSpecialization) => {
    setSearchParams((prev) => {
      const currentSpecialization = prev.get("specialization");

      if (currentSpecialization === value) {
        return prev;
      }

      const params = new URLSearchParams(prev);

      params.set("specialization", value);
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
            onClick={() => handleSelectSpecialization(specialty)}
            className={cn(
              "doctorSpecialiazationItem",
              specialty === selectedSpecialization &&
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
