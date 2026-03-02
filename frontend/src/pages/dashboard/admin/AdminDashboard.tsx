import AdminDashboardTable from "@/components/sections/adminDashboardSections/AdminDashboardTable";
import { useAuth } from "@/provider/auth-context";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <section>
      <div className="sectionContainer">
        <div className="personDashboardDetails">
          <div className="personImage">
            <img
              src={
                user?.avatar ||
                "https://static.vecteezy.com/system/resources/previews/015/412/022/non_2x/doctor-round-avatar-medicine-flat-avatar-with-male-doctor-medical-clinic-team-round-icon-medical-collection-illustration-vector.jpg"
              }
              alt={user?.name}
            />
          </div>
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

        <AdminDashboardTable />
      </div>
    </section>
  );
};

export default AdminDashboard;
