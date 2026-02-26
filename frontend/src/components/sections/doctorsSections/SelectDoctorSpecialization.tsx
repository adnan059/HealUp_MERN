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

type DoctorSpecialization = "all" | DoctorSpecialty;

interface ISelectDoctorSpecializationProps {
  selectedSpecialization: DoctorSpecialization;
  setSearchParams: SetURLSearchParams;
}

const SelectDoctorSpecialization = ({
  selectedSpecialization,
  setSearchParams,
}: ISelectDoctorSpecializationProps) => {
  const handleChange = (value: DoctorSpecialization) => {
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
  console.log(selectedSpecialization);
  return (
    <div className="selectDoctorSpecialization">
      <p>Select Specialization</p>
      <Select value={selectedSpecialization} onValueChange={handleChange}>
        <SelectTrigger className="selectTrigger">
          <SelectValue placeholder="Select Specialization" />
        </SelectTrigger>
        <SelectContent>
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
