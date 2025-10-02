import "../assets/Styles/Navbar.css";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">NOVA</div>
      <div className="nav-links">
        <ProfileMenu />
      </div>
    </nav>
  );
}

export default Navbar;



