import DoctorAppointmentsTable from "@/components/sections/userDashboardSections/DoctorAppointmentsTable";
import PatientAppointmentsTable from "@/components/sections/userDashboardSections/PatientAppointmentsTable ";
import AvatarUploader from "@/components/shared/AvatarUploader";
import Loader from "@/components/shared/Loader";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "@/provider/auth-context";
import { CalendarDays, Stethoscope } from "lucide-react";

const UserDashboard = () => {
  const { user, doctorProfile, isLoading } = useAuth();

  const isPatient = user?.roles.includes("patient");
  const isDoctor = user?.roles.includes("doctor");
  const isBoth = isPatient && isDoctor;

  console.log("DOCTOR PROFILE ==> ", doctorProfile);

  if (isLoading) return <Loader />;

  return (
    <section className="userDashboard">
      <div className="sectionContainer">
        <div className="personDashboardDetails">
          <AvatarUploader
            currentAvatar={user?.avatar || ""}
            userName={user?.name || ""}
          />

          <div className="personTextInfo">
            <h2 className="personFullName">{user?.name}</h2>
            <p className="personRoles">
              {user?.roles.map((role) => (
                <span key={role}>{role}</span>
              ))}
            </p>
            <p className="personEmail">{user?.email}</p>
          </div>
        </div>
        {isDoctor && (
          <div className="userDoctorProfileInfo">
            <div className="left">
              <p>Specialist in {doctorProfile?.specialty}</p>
              <p>
                Degree:{" "}
                <span className="inline uppercase">
                  {doctorProfile?.degree}
                </span>
              </p>
              <p>Experience: {doctorProfile?.experience} Years</p>
            </div>
            <div className="right">
              <p>{doctorProfile?.about}</p>
            </div>
          </div>
        )}

        <div className="userDashboardTablesSection mt-16">
          <h2 className="text-2xl font-semibold text-indigo-600 ">
            Dashboard Details
          </h2>
          {isPatient && !isDoctor && (
            <>
              <div className="mb-6">
                <p className=" mt-1">
                  View and manage your booked appointments.
                </p>
              </div>
              <PatientAppointmentsTable />
            </>
          )}

          {isBoth && (
            <>
              <div className="mb-6">
                <p className=" mt-1">
                  You have both patient and doctor roles. Switch tabs to manage
                  each.
                </p>
              </div>

              {/*
            Shadcn Tabs:
            - defaultValue="patient" → patient tab is active on first load.
            - Each TabsTrigger value matches its TabsContent value exactly.
          */}
              <Tabs defaultValue="patient">
                <TabsList className="mb-4">
                  <TabsTrigger
                    value="patient"
                    className="flex items-center gap-2 text-indigo-600"
                  >
                    <CalendarDays className="w-4 h-4" />
                    My Appointments
                  </TabsTrigger>
                  <TabsTrigger
                    value="doctor"
                    className="flex items-center gap-2 text-indigo-600"
                  >
                    <Stethoscope className="w-4 h-4" />
                    My Patients
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: appointments this user booked as a patient */}
                <TabsContent value="patient">
                  <p className="mb-2">
                    Appointments you have booked with doctors.
                  </p>
                  <PatientAppointmentsTable />
                </TabsContent>

                {/* Tab 2: patients who have confirmed appointments with this doctor */}
                <TabsContent value="doctor">
                  <p className=" mb-2">
                    Confirmed &amp; paid appointments from your patients.
                  </p>
                  <DoctorAppointmentsTable />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
