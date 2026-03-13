import { Link, useNavigate } from "react-router-dom";
import HeaderMenuDropdown from "./HeaderMenuDropdown";
import { useAuth } from "@/provider/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatatFallbackText } from "@/lib/utils";

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <header>
      <div className="headerContainer">
        <Link
          to={"/"}
          onClick={() => scrollTo({ top: 0, behavior: "smooth" })}
          className="logo"
        >
          <h1>
            Heal<span>Up</span>
          </h1>
        </Link>

        <nav>
          <ul className="navList">
            <li>
              <Link to={"/doctors"}>Doctors</Link>
            </li>
            {isAuthenticated && (
              <li>
                <Link
                  to={`/dashboard/${user?.roles.includes("admin") ? "admin" : "user"}/${user?._id}`}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li>
              {isAuthenticated ? (
                <button className="logoutButton" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <Link to={"/login"}>Login</Link>
              )}
            </li>
            {isAuthenticated && (
              <Avatar>
                <AvatarImage />
                <AvatarFallback>
                  {user && getAvatatFallbackText(user?.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </ul>
        </nav>

        <div className="headerMenuDropdown">
          <HeaderMenuDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
