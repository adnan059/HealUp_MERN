import BookAppointment from "@/components/sections/booking/BookAppointment";
import Loader from "@/components/shared/Loader";
import { useGetADoctorById } from "@/hooks/useDoctors";

import { Award, Coins, GraduationCap, Stethoscope } from "lucide-react";
import { useParams } from "react-router-dom";

const DoctorDetails = () => {
  const { id } = useParams() as {
    id: string;
  };

  const { data, isPending } = useGetADoctorById(id);

  if (isPending) {
    return <Loader />;
  }

  return (
    <section className="doctorDetails">
      <div className="sectionContainer">
        <div className="doctorInfo">
          <div className="doctorImage">
            <img
              src={
                data?.userId?.avatar ||
                "https://static.vecteezy.com/system/resources/previews/015/412/022/non_2x/doctor-round-avatar-medicine-flat-avatar-with-male-doctor-medical-clinic-team-round-icon-medical-collection-illustration-vector.jpg"
              }
              alt=""
            />
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
