import { useAuth } from "@/provider/auth-context";
import { Link } from "react-router-dom";

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer>
      <div className="footerContainer">
        <span>© {new Date().getFullYear()} HealUp. All rights reserved.</span>
        <div>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          {!user?.roles.includes("doctor") && (
            <Link to={"/doctor/apply"}>Apply To Be A Doctor</Link>
          )}
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
