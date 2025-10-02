import { useState, useRef, useEffect } from "react";
import { FiUser, FiLogOut, FiEdit } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import "../assets/styles/ProfileMenu.css";

export default function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="profile-wrapper" ref={menuRef}>
      <button className="profile-btn" onClick={() => setOpen(!open)}>
        <FiUser size={22} />
        <span className="profile-name">{user?.nombre || "Perfil"}</span>
      </button>

      {open && (
        <ul className="profile-dropdown">
          <li onClick={() => alert("Ir a editar datos")}>
            <FiEdit /> Editar datos
          </li>
          <li onClick={logout}>
            <FiLogOut /> Cerrar sesión
          </li>
        </ul>
      )}
    </div>
  );
}
