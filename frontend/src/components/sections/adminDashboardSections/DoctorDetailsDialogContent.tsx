import { getWorkinDays } from "@/lib/utils";
import type { IDoctorDetailsWithSchedule } from "@/types";

const DoctorDetailsDialogContent = ({
  viewDoctor,
}: {
  viewDoctor: IDoctorDetailsWithSchedule | null;
}) => {
  return (
    <div className="viewDoctorDetails">
      <h2>
        <span>Name:</span> {viewDoctor?.userId.name}
      </h2>

      <p>
        <span>DoctorId:</span> {viewDoctor?._id}
      </p>

      <p>
        <span>Email:</span>{" "}
        <a className="lowercase">{viewDoctor?.userId.email.toLowerCase()}</a>
      </p>

      <p>
        <span>Specialty:</span> {viewDoctor?.specialty}
      </p>

      <p>
        <span>Degree:</span> {viewDoctor?.degree}
      </p>

      <p>
        <span>Experience:</span> {viewDoctor?.experience} years
      </p>

      <p>
        <span>Fees:</span> {viewDoctor?.fees} BDT
      </p>

      <p>
        <span>About:</span> {viewDoctor?.about}
      </p>

      <p>
        <span>Working Days:</span>{" "}
        {viewDoctor?.workingDays && getWorkinDays(viewDoctor?.workingDays)}
      </p>

      <p>
        <span>Slot Duration:</span> {viewDoctor?.slotDuration} minutes
      </p>
    </div>
  );
};

export default DoctorDetailsDialogContent;
