import { useAuth } from "@/provider/auth-context";
import { Link } from "react-router-dom";

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer>
      <div className="footerContainer">
        <span>© {new Date().getFullYear()} HealUp. All rights reserved.</span>
        <div>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {!user?.roles.includes("doctor") && (
            <Link to={"/doctor/apply"}>Apply To Be A Doctor</Link>
          )}
          <Link to="/privacy">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
