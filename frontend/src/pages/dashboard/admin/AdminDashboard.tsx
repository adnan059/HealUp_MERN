import AdminDashboardTable from "@/components/sections/adminDashboardSections/AdminDashboardTable";
import AvatarUploader from "@/components/shared/AvatarUploader";
import { useAuth } from "@/provider/auth-context";

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <section>
      <div className="sectionContainer">
        <div className="personDashboardDetails">
          <div className="personImage">
            <AvatarUploader
              currentAvatar={user?.avatar || ""}
              userName={user?.name || ""}
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
