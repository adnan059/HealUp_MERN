import BookAppointment from "@/components/sections/booking/BookAppointment";
import Loader from "@/components/shared/Loader";
import { useGetADoctorById } from "@/hooks/useDoctors";

import { Award, Coins, GraduationCap, Stethoscope } from "lucide-react";
import { useParams } from "react-router-dom";
import fallbackDoctorAvatar from "@/assets/images/doctor.png";

const DoctorDetails = () => {
  const { id } = useParams() as {
    id: string;
  };

  const { data, isPending } = useGetADoctorById(id);

  if (isPending) {
    return (
      <div className="min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <section className="doctorDetails">
      <div className="sectionContainer">
        <div className="doctorInfo">
          <div className="doctorImage">
            <img src={data?.userId?.avatar || fallbackDoctorAvatar} alt="" />
          </div>
          <div className="doctorTextData">
            <h2>Dr. {data?.userId?.name}</h2>
            <p>
              <Stethoscope className="doctorDetailsIcon" size={20} />
              <span>Specialist in {data?.specialty}</span>
            </p>
            <p className="degree">
              <GraduationCap className="doctorDetailsIcon" size={20} />{" "}
              <span>{data?.degree}</span>
            </p>
            <p>
              <Award className="doctorDetailsIcon" size={20} />
              <span>{data?.experience}</span> Years of Experience
            </p>
            <p className="about">{data?.about}</p>
            <p>
              <Coins className="doctorDetailsIcon" size={20} />{" "}
              <span>Consultation Fee: {data?.fees} BDT</span>
            </p>
          </div>
        </div>
        {data && <BookAppointment doctorDetails={data} />}
      </div>
    </section>
  );
};

export default DoctorDetails;
