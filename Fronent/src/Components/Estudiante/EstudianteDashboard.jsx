import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/styles/Estudiante.css";
import { FaBook, FaCheckCircle, FaChartLine, FaFileDownload, FaFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EstudianteDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <main className="estudiante-main">
        <h2>👋 Bienvenido, Estudiante</h2>
        <p>Estas son tus opciones disponibles:</p>

        <div className="estudiante-cards">
          <div className="estudiante-card">
            <FaFolderOpen className="estudiante-icon" />
            <h3>Crear Proyecto</h3>
            <p>Crea y registra un nuevo proyecto académico.</p>
            <button onClick={() => navigate("/estudiante/crear-proyecto")}>Crear proyecto</button>
          </div>

          <div className="estudiante-card">
            <FaBook className="estudiante-icon" />
            <h3>Mis Proyectos</h3>
            <p>Consulta y gestiona tus proyectos académicos.</p>
            <button onClick={() => navigate("/estudiante/proyectos")}>Ingresar</button>
          </div>

          <div className="estudiante-card">
            <FaCheckCircle className="estudiante-icon" />
            <h3>Evaluaciones</h3>
            <p>Visualiza las evaluaciones de tus proyectos.</p>
            <button onClick={() => navigate("/estudiante/evaluaciones")}>Ingresar</button>
          </div>

          <div className="estudiante-card">
            <FaChartLine className="estudiante-icon" />
            <h3>Notas</h3>
            <p>Consulta tus calificaciones acumuladas.</p>
            <button onClick={() => navigate("/estudiante/notas")}>Ingresar</button>
          </div>

          <div className="estudiante-card">
            <FaFileDownload className="estudiante-icon" />
            <h3>Certificado de Proyecto</h3>
            <p>Descarga tu certificado de participación en proyectos.</p>
            <button onClick={() => navigate("/estudiante/certificado")}>Generar certificado</button>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}

export default EstudianteDashboard;
