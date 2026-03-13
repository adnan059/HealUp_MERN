import type { IDoctor } from "@/types";
import { Award, GraduationCap } from "lucide-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import fallbackDoctorAvatar from "@/assets/images/doctor.png";

const DoctorCard = ({ doctor }: { doctor: IDoctor }) => {
  return (
    <Link to={`/doctor/${doctor?._id}`} key={doctor._id} className="doctorCard">
      <div className="doctorCardImage">
        <img
          src={doctor?.userId?.avatar || fallbackDoctorAvatar}
          alt={doctor.userId?.name}
        />
      </div>
      <div className="doctorInfo">
        <h2 className="doctorName">Dr. {doctor?.userId?.name}</h2>
        <p className="specialty">{doctor.specialty}</p>
        <hr />
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
