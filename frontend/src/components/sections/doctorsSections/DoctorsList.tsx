import DoctorCard from "@/components/shared/DoctorCard";
import Loader from "@/components/shared/Loader";

import type { IDoctor } from "@/types";
interface IDoctorListProps {
  doctors: IDoctor[];
  isPending: boolean;
}

const DoctorsList = ({ doctors, isPending }: IDoctorListProps) => {
  if (isPending) {
    return <Loader />;
  }
  if (!doctors?.length) {
    return <p className="text-center pt-10">No Doctors Found!</p>;
  }
  return (
    <div className="allDoctorsContainer">
      {doctors?.map((doctor) => (
        <DoctorCard doctor={doctor} key={doctor?._id} />
      ))}
    </div>
  );
};

export default DoctorsList;
