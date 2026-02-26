import type { IDoctor } from "@/types";
import { Award, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const DoctorCard = ({ doctor }: { doctor: IDoctor }) => {
  return (
    <Link to={`/doctor/${doctor?._id}`} key={doctor._id} className="doctorCard">
      <img
        src={
          doctor?.userId?.avatar ||
          "https://static.vecteezy.com/system/resources/previews/015/412/022/non_2x/doctor-round-avatar-medicine-flat-avatar-with-male-doctor-medical-clinic-team-round-icon-medical-collection-illustration-vector.jpg"
        }
        alt=""
      />
      <div className="doctorInfo">
        <h2 className="doctorName">Dr. {doctor?.userId?.name}</h2>
        <p className="specialty">- {doctor.specialty} -</p>
        <div className="metadata">
          <p>
            <Award size={20} className="text-indigo-800" />
            <span>{doctor.experience} years</span>
          </p>
          <p>
            <GraduationCap size={20} className="text-indigo-800" />
            <span className="degree">{doctor.degree}</span>
          </p>
        </div>
        <Button>View Details</Button>
      </div>
    </Link>
  );
};

export default DoctorCard;
