import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  LogOutIcon,
  MenuIcon,
  Stethoscope,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const HeaderMenuDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
            <Link to={"/doctors"} className="headerMenuDropdownLinkItem">
              <Stethoscope className="headerMenuDropdownLinkItemIcon" />{" "}
              <span>Doctors</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
            <Link to={"/dashboard"} className="headerMenuDropdownLinkItem">
              <LayoutDashboard className="headerMenuDropdownLinkItemIcon" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setIsMenuOpen(false)}>
            <button className="headerMenuDropdownLinkItem">
              <LogOutIcon className="headerMenuDropdownLinkItemIcon" />
              Logout
            </button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderMenuDropdown;
