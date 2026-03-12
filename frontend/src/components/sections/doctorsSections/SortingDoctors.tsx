import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortingOptions } from "@/lib";
import type { SortOption } from "@/types";

import type { SetURLSearchParams } from "react-router-dom";

type DoctorSortOptions = "" | SortOption;
interface ISortingDoctorsProps {
  sort: DoctorSortOptions;
  setSearchParams: SetURLSearchParams;
}

const SortingDoctors = ({ sort, setSearchParams }: ISortingDoctorsProps) => {
  const handleChange = (value: SortOption) => {
    setSearchParams((prev) => {
      const currentSort = prev.get("sort");
      if (currentSort === value) {
        return prev;
      }
      const params = new URLSearchParams(prev);
      params.set("sort", value);
      params.set("page", "1");
      return params;
    });
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  console.log(sort);
  return (
    <div className="selectDoctorSorting">
      <p>Sort Doctors</p>
      <Select value={sort} onValueChange={handleChange}>
        <SelectTrigger className="selectTrigger">
          <SelectValue placeholder="Sort Doctors" />
        </SelectTrigger>
        <SelectContent className="border border-indigo-600">
          <SelectGroup>
            <SelectLabel>Sort Doctors</SelectLabel>

            {sortingOptions.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortingDoctors;
