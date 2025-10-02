import Navbar from "../Navbar";
import Footer from "../Footer";
import { FaUserCog, FaChartBar, FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/Styles/Admin.css";


function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="dashboard">
        <h2>👤 Panel de Administrador</h2>
        <p>Estas son tus herramientas administrativas:</p>

        <div className="card-container">
          <div className="card">
            <FaUserCog className="card-icon" />
            <h3>Gestión de Usuarios</h3>
            <p>Crea, edita y elimina usuarios del sistema.</p>
            <button onClick={() => navigate("/admin/usuarios")}>Ingresar</button>
          </div>

          <div className="card">
            <FaChartBar className="card-icon" />
            <h3>Reportes</h3>
            <p>Genera reportes de evaluación y estadísticas.</p>
            <button onClick={() => navigate("/admin/reportes")}>Ver reportes</button>
          </div>

          <div className="card">
            <FaShieldAlt className="card-icon" />
            <h3>Control de Roles</h3>
            <p>Asigna permisos y roles a los usuarios.</p>
            <button onClick={() => navigate("/admin/roles")}>Gestionar roles</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default AdminDashboard;
