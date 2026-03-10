import DoctorCard from "@/components/shared/DoctorCard";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetFeaturedDoctors } from "@/hooks/useDoctors";

import { useNavigate } from "react-router-dom";

const FeaturedDoctors = () => {
  const navigate = useNavigate();
  const { data: featuredDoctors, isPending } = useGetFeaturedDoctors();

  if (isPending) {
    return <Loader />;
  }

  return (
    <section>
      <div className="sectionContainer">
        <h1 className="sectionTitle">Featured Doctors</h1>
        <div className="featuredDoctorList">
          {featuredDoctors?.map((doctor) => (
            <DoctorCard doctor={doctor} key={doctor._id} />
          ))}
        </div>
        <Button
          onClick={() => navigate("/doctors")}
          className="viewMoreDoctorsButton"
        >
          View More
        </Button>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
