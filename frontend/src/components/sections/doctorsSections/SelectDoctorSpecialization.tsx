import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { specialties } from "@/lib";
import type { DoctorSpecialty } from "@/types";

import type { SetURLSearchParams } from "react-router-dom";

type DoctorSpecialties = "all" | DoctorSpecialty;

interface ISelectDoctorSpecializationProps {
  selectedSpecialty: DoctorSpecialties;
  setSearchParams: SetURLSearchParams;
}

const SelectDoctorSpecialization = ({
  selectedSpecialty,
  setSearchParams,
}: ISelectDoctorSpecializationProps) => {
  const handleChange = (value: DoctorSpecialties) => {
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
    <div className="selectDoctorSpecialization">
      <p>Select Specialization</p>
      <Select value={selectedSpecialty} onValueChange={handleChange}>
        <SelectTrigger className="selectTrigger">
          <SelectValue placeholder="Select Specialization" />
        </SelectTrigger>
        <SelectContent className="border border-indigo-600">
          <SelectGroup>
            <SelectLabel>Select Specialization</SelectLabel>
            <SelectItem value={"all"}>ALL</SelectItem>
            {specialties.map((item) => (
              <SelectItem key={item} value={item}>
                {item.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectDoctorSpecialization;
