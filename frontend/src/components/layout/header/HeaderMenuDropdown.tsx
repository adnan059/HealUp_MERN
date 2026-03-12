import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/provider/auth-context";
import {
  LayoutDashboard,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  Stethoscope,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HeaderMenuDropdown = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {isMenuOpen ? (
            <X size={30} className="text-indigo-900" />
          ) : (
            <MenuIcon size={30} className="text-indigo-900" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              setIsMenuOpen(false);
              scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Link to={"/doctors"} className="headerMenuDropdownLinkItem">
              <Stethoscope className="headerMenuDropdownLinkItemIcon" />{" "}
              <span>Doctors</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setIsMenuOpen(false);
              scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Link
              to={`/dashboard/${user?.roles.includes("admin") ? "admin" : "user"}/${user?._id}`}
              className="headerMenuDropdownLinkItem"
            >
              <LayoutDashboard className="headerMenuDropdownLinkItemIcon" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
            {isAuthenticated ? (
              <button
                className="headerMenuDropdownLinkItem"
                onClick={handleLogout}
              >
                <LogOutIcon className="headerMenuDropdownLinkItemIcon" />
                Logout
              </button>
            ) : (
              <Link className="headerMenuDropdownLinkItem" to={"/login"}>
                <LogInIcon className="headerMenuDropdownLinkItemIcon" />
                Login
              </Link>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenuDropdown;
