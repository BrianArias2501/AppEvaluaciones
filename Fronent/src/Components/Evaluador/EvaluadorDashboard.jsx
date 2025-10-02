import Navbar from "../Navbar";
import Footer from "../Footer";
import "../../assets/Styles/Evaluador.css";
import { FaCheckCircle, FaHistory, FaFileDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EvaluadorDashboard() {
  const navigate = useNavigate();  

  return (
    <div className="evaluador-dashboard">
      <Navbar />
      <main className="evaluador-main">
        <h2>👋 Bienvenido, Evaluador</h2>
        <p>Estas son tus opciones disponibles:</p>

        <div className="evaluador-cards">
          <div className="card">
            <FaCheckCircle className="card-icon" />
            <h3>Calificar Proyecto</h3>
            <p>Evalúa y comenta los proyectos asignados.</p>
            <button onClick={() => navigate("/evaluador/calificar")}>
              Ir a calificar
            </button>
          </div>

          <div className="card">
            <FaHistory className="card-icon" />
            <h3>Historial</h3>
            <p>Consulta las evaluaciones realizadas.</p>
            <button onClick={() => navigate("/evaluador/historial")}>
              Ver historial
            </button>
          </div>

          <div className="card">
            <FaFileDownload className="card-icon" />
            <h3>Certificado</h3>
            <p>Descarga tu certificado de participación.</p>
            <button onClick={() => navigate("/evaluador/certificado")}>
              Generar certificado
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default EvaluadorDashboard;

